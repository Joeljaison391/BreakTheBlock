"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Target,
    Users,
    User,
    Flame,
    Zap,
    MessageSquare,
    Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { formatPoints } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Feed", href: "/feed", icon: Users },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Chat", href: "/chat", icon: MessageSquare },
    { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const user = useAppStore((s) => s.user);

    return (
        <aside className="hidden md:flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                        <ellipse cx="12" cy="13" rx="10" ry="9" opacity="0.9" />
                        <path d="M12 4 L8 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M8 10 L16 14" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="text-base font-bold tracking-tight gradient-text">Break the Block</span>
            </div>

            {/* Nav */}
            <nav id="tour-step-nav" className="flex flex-1 flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={`tour-step-nav-${item.label.toLowerCase()}`}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                            {item.label}
                            {active && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Stats footer */}
            {user && (
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs">
                            <Zap className="h-3.5 w-3.5 text-accent" />
                            <span className="font-semibold text-accent">{formatPoints(user.points)} pts</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <Flame className="h-3.5 w-3.5 text-primary" />
                            <span className="font-semibold text-primary">{user.streak}d streak</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
