"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Zap, MessageSquare } from "lucide-react";
import { formatPoints } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatar } from "./UserAvatar";
import { useAppStore } from "@/store";
import { logout } from "@/app/login/actions";
import { toast } from "sonner";

const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/goals": "Goals",
    "/feed": "Feed",
    "/leaderboard": "Leaderboards",
    "/chat": "Group Chat",
    "/profile": "Profile",
};

export function Topbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAppStore();

    // Determine title loosely based on path
    const pageTitle = Object.entries(pageTitles).find(([key]) =>
        pathname === key || (key !== "/" && pathname.startsWith(key + "/"))
    )?.[1] ?? "Break the Block";

    async function handleSignOut() {
        await logout();
        setUser(null);
        toast.success("Signed out");
    }

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
            <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
            <div className="flex items-center gap-3">
                {user && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                        <Zap className="h-3.5 w-3.5" />
                        {formatPoints(user.points)} pts
                    </div>
                )}
                <ThemeToggle />
                <Link
                    href="/chat"
                    title="Group Chat"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <MessageSquare className="h-4 w-4" />
                </Link>
                <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <LogOut className="h-4 w-4" />
                </button>
                <UserAvatar user={user} size="sm" />
            </div>
        </header>
    );
}
