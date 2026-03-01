"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Create a new goal in Supabase.
 */
export async function createGoal(goal: {
    title: string;
    description: string;
    type: string;
    tracking_config: any;
    enable_logging: boolean;
    post_completion_proof_type: string;
}) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Not authenticated", goal: null };

        const { data, error } = await supabase.from("goals").insert({
            user_id: user.id,
            title: goal.title,
            description: goal.description || "",
            type: goal.type,
            tracking_config: goal.tracking_config,
            enable_logging: goal.enable_logging,
            post_completion_proof_type: goal.post_completion_proof_type || "none",
            progress: 0,
            points_earned: 0,
        }).select().single();

        if (error) {
            console.error("[createGoal] DB error:", error);
            return { error: error.message, goal: null };
        }
        console.log("[createGoal] Success:", data.id);
        return { error: null, goal: data };
    } catch (e: any) {
        console.error("[createGoal] Unhandled error:", e);
        return { error: e.message || "Failed to create goal", goal: null };
    }
}

/**
 * Fetch all goals for the authenticated user.
 */
export async function fetchGoals() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[fetchGoals] DB error:", error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error("[fetchGoals] Unhandled error:", e);
        return [];
    }
}

/**
 * Update a goal's tracking config, progress, etc.
 */
export async function updateGoalAction(goalId: string, updates: {
    tracking_config?: any;
    progress?: number;
    points_earned?: number;
}) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Not authenticated" };

        const { error } = await supabase
            .from("goals")
            .update({ ...updates, last_updated: new Date().toISOString() })
            .eq("id", goalId)
            .eq("user_id", user.id);

        if (error) {
            console.error("[updateGoalAction] DB error:", error);
            return { error: error.message };
        }
        return { error: null };
    } catch (e: any) {
        console.error("[updateGoalAction] Unhandled error:", e);
        return { error: e.message || "Failed to update goal" };
    }
}
