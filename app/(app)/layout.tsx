import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthInitializer } from "@/components/shared/AuthInitializer";
import { AppShell } from "@/components/shared/AppShell";
import type { MockUser } from "@/lib/mockData";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // 1. Verify Authentication
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    // 2. Fetch Profile Data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // 3. Fetch User's Goals from DB
    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // 4. Map profile to store format
    const mappedUser: MockUser | null = profile ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        points: profile.points || 0,
        streak: profile.streak || 0,
        level: profile.level || 1,
        avatar: profile.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.name}`,
        geo: "Global Engine",
        badges: []
    } : null;

    if (!mappedUser) {
        redirect("/login");
    }

    // 5. Map goals from DB snake_case to store camelCase
    const mappedGoals = (goals || []).map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description || "",
        type: g.type,
        trackingConfig: g.tracking_config || {},
        enableLogging: g.enable_logging || false,
        postCompletionProofType: g.post_completion_proof_type || "none",
        logs: [],
        progress: g.progress || 0,
        pointsEarned: g.points_earned || 0,
        lastUpdated: g.updated_at || g.created_at,
        endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    }));

    return (
        <>
            <AuthInitializer serverUser={mappedUser} serverGoals={mappedGoals} />
            <AppShell>{children}</AppShell>
        </>
    );
}
