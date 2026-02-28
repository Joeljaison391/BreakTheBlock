"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Target, Users, User, Menu, LogOut, Zap } from "lucide-react";
import { cn, formatPoints } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatar } from "./UserAvatar";
import { useAppStore } from "@/store";
import { clearMockSession } from "@/lib/mock-auth";
import { toast } from "sonner";

const mobileNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Community", href: "/community", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
];

export function Topbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAppStore();

    const pageTitle = mobileNav.find(
        (n) => pathname === n.href || pathname.startsWith(n.href + "/")
    )?.label ?? "Break the Block";

    function handleSignOut() {
        clearMockSession();
        setUser(null);
        toast.success("Signed out");
        router.push("/login");
    }

    return (
        <>
            {/* Desktop topbar */}
            <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
                <div className="flex items-center gap-3">
                    {user && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                            <Zap className="h-3.5 w-3.5" />
                            {formatPoints(user.total_points)} pts
                        </div>
                    )}
                    <ThemeToggle />
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

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card/90 backdrop-blur-md">
                {mobileNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                                active ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
