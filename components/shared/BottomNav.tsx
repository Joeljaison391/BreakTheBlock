"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users, User, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Start", href: "/friction", icon: Zap, isAction: true },
    { label: "Feed", href: "/feed", icon: Users },
    { label: "Ranks", href: "/leaderboard", icon: Trophy },
];

export function BottomNav() {
    const pathname = usePathname();

    // Hide bottom nav on friction breaker full-screen wizard
    if (pathname === "/friction") return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-between px-2 pb-5 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
            <div id="tour-step-nav" className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl px-2 py-2 shadow-2xl pointer-events-auto">
                {navItems.map((item) => {
                    // Note: home is now / mapping to /dashboard for demo matching, let's normalize
                    const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");

                    if (item.isAction) {
                        return (
                            <Link key={item.href} href={item.href} id={`tour-step-nav-${item.label.toLowerCase()}`} className="relative -top-5 flex-shrink-0 z-10 px-2">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                                    <item.icon className="h-6 w-6 text-white fill-white/20" />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={`tour-step-nav-${item.label.toLowerCase()}`}
                            className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1"
                        >
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-semibold transition-colors duration-300",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -bottom-2 h-1 w-8 rounded-t-full bg-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
