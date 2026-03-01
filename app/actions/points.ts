"use server";

import { createClient } from "@/utils/supabase/server";
import { POINT_RULES, getLevel, type PointAction } from "@/lib/gameConfig";

/**
 * Central point-awarding function.
 * Checks daily cap, applies active multipliers, updates profile, logs the action.
 * Wrapped in try-catch so gamification table issues don't break the app.
 */
export async function awardPoints(action: PointAction, metadata?: { streak?: number }) {
    try {
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
            const { data: logs, error: logErr } = await supabase
                .from("point_logs")
                .select("points")
                .eq("user_id", user.id)
                .eq("action", action)
                .gte("created_at", `${today}T00:00:00Z`);

            if (logErr) {
                console.error("[awardPoints] point_logs query error:", logErr);
                // Table may not exist yet — just award points without cap check
            } else {
                const todayTotal = (logs || []).reduce((sum, l) => sum + l.points, 0);
                if (todayTotal >= rule.dailyCap) {
                    return { awarded: 0, capped: true };
                }
                basePoints = Math.min(basePoints, rule.dailyCap - todayTotal);
            }
        }

        // Check for active 2x multiplier (graceful if table doesn't exist)
        let multiplier = 1;
        try {
            const { data: activePowerup } = await supabase
                .from("user_powerups")
                .select("id")
                .eq("user_id", user.id)
                .eq("type", "double_xp")
                .eq("used", false)
                .gte("expires_at", new Date().toISOString())
                .limit(1)
                .maybeSingle();
            if (activePowerup) multiplier = 2;
        } catch {
            // user_powerups table may not exist yet
        }

        const finalPoints = basePoints * multiplier;
        if (finalPoints <= 0) return { awarded: 0 };

        // Log the point action (graceful)
        try {
            await supabase.from("point_logs").insert({
                user_id: user.id,
                action,
                points: finalPoints,
            });
        } catch {
            console.error("[awardPoints] Failed to insert point_log");
        }

        // Update profile points + recalculate level
        const { data: profile } = await supabase
            .from("profiles")
            .select("points")
            .eq("id", user.id)
            .single();

        const newTotal = (profile?.points || 0) + finalPoints;
        const newLevel = getLevel(newTotal);

        // Update points (and level column if it exists)
        const { error: updateErr } = await supabase
            .from("profiles")
            .update({ points: newTotal, level: newLevel.level })
            .eq("id", user.id);

        if (updateErr) {
            // level column might not exist — try without it
            console.error("[awardPoints] Profile update error (maybe level column missing):", updateErr);
            await supabase
                .from("profiles")
                .update({ points: newTotal })
                .eq("id", user.id);
        }

        return { awarded: finalPoints, multiplied: multiplier > 1, newTotal, level: newLevel };
    } catch (e) {
        console.error("[awardPoints] Unhandled error:", e);
        return { awarded: 0, error: "Points system error" };
    }
}

/**
 * Award daily login points (called once per day).
 * Gracefully handles missing columns/tables.
 */
export async function awardDailyLogin() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split("T")[0];

        const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("last_login_date, streak")
            .eq("id", user.id)
            .single();

        if (profileErr) {
            // last_login_date column may not exist yet
            console.error("[awardDailyLogin] Profile fetch error (run migration 02?):", profileErr);
            return;
        }

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
    } catch (e) {
        console.error("[awardDailyLogin] Unhandled error:", e);
    }
}

/**
 * Activate a powerup for the user.
 */
export async function activatePowerup(type: string) {
    try {
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
    } catch (e: any) {
        console.error("[activatePowerup] Error:", e);
        return { error: e.message || "Failed to activate powerup" };
    }
}
