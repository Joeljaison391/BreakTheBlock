"use server";

import { createClient } from "@/utils/supabase/server";
import { POINT_RULES, getLevel, type PointAction } from "@/lib/gameConfig";

/**
 * Central point-awarding function.
 * Checks daily cap, applies active multipliers, updates profile, logs the action.
 */
export async function awardPoints(action: PointAction, metadata?: { streak?: number }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { awarded: 0, error: "Not authenticated" };

    const rule = POINT_RULES[action] as { points: number; dailyCap: number | null; label: string; perStreak?: boolean };
    let basePoints: number = rule.points;

    // Streak bonus scales with streak count
    if (rule.perStreak && metadata?.streak) {
        basePoints = Math.min(metadata.streak * rule.points, rule.dailyCap || Infinity);
    }

    // Check daily cap
    if (rule.dailyCap !== null) {
        const today = new Date().toISOString().split("T")[0];
        const { data: logs } = await supabase
            .from("point_logs")
            .select("points")
            .eq("user_id", user.id)
            .eq("action", action)
            .gte("created_at", `${today}T00:00:00Z`);

        const todayTotal = (logs || []).reduce((sum, l) => sum + l.points, 0);
        if (todayTotal >= rule.dailyCap) {
            return { awarded: 0, capped: true };
        }
        // Don't exceed cap
        basePoints = Math.min(basePoints, rule.dailyCap - todayTotal);
    }

    // Check for active 2x multiplier
    const { data: activePowerup } = await supabase
        .from("user_powerups")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", "double_xp")
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .limit(1)
        .maybeSingle();

    const multiplier = activePowerup ? 2 : 1;
    const finalPoints = basePoints * multiplier;

    if (finalPoints <= 0) return { awarded: 0 };

    // Log the point action
    await supabase.from("point_logs").insert({
        user_id: user.id,
        action,
        points: finalPoints,
    });

    // Update profile points + recalculate level
    const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

    const newTotal = (profile?.points || 0) + finalPoints;
    const newLevel = getLevel(newTotal);

    await supabase
        .from("profiles")
        .update({ points: newTotal, level: newLevel.level })
        .eq("id", user.id);

    return { awarded: finalPoints, multiplied: multiplier > 1, newTotal, level: newLevel };
}

/**
 * Award daily login points (called once per day).
 */
export async function awardDailyLogin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data: profile } = await supabase
        .from("profiles")
        .select("last_login_date, streak")
        .eq("id", user.id)
        .single();

    if (profile?.last_login_date === today) return; // Already awarded today

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = profile?.last_login_date === yesterday ? (profile?.streak || 0) + 1 : 1;

    await supabase.from("profiles").update({
        last_login_date: today,
        streak: newStreak,
    }).eq("id", user.id);

    // Award points
    await awardPoints("DAILY_LOGIN");
    if (newStreak > 1) {
        await awardPoints("STREAK_BONUS", { streak: newStreak });
    }
}

/**
 * Activate a powerup for the user.
 */
export async function activatePowerup(type: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { POWERUPS } = await import("@/lib/gameConfig");
    const powerup = POWERUPS.find(p => p.id === type);
    if (!powerup) return { error: "Unknown powerup" };

    // Check level
    const { data: profile } = await supabase
        .from("profiles")
        .select("points, level")
        .eq("id", user.id)
        .single();

    if ((profile?.level || 1) < powerup.minLevel) {
        return { error: `Requires Level ${powerup.minLevel}` };
    }
    if ((profile?.points || 0) < powerup.cost) {
        return { error: "Not enough points" };
    }

    // Deduct cost
    await supabase.from("profiles").update({
        points: (profile?.points || 0) - powerup.cost,
    }).eq("id", user.id);

    // Create powerup
    const expiresAt = powerup.durationMinutes
        ? new Date(Date.now() + powerup.durationMinutes * 60000).toISOString()
        : null;

    await supabase.from("user_powerups").insert({
        user_id: user.id,
        type,
        expires_at: expiresAt,
    });

    return { error: null };
}
