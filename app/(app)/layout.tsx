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

    // 3. Map to Store Structure
    const mappedUser: MockUser | null = profile ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        points: profile.points || 0,
        streak: profile.streak || 0,
        avatar: profile.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.name}`,
        geo: "Global Engine",
        badges: []
    } : null;

    if (!mappedUser) {
        redirect("/login");
    }

    return (
        <>
            <AuthInitializer serverUser={mappedUser} />
            <AppShell>{children}</AppShell>
        </>
    );
}
