"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAppStore } from "@/store";
import { Zap, Flame, Settings } from "lucide-react";
import { formatPoints } from "@/lib/utils";

export default function ProfilePage() {
    const user = useAppStore((s) => s.user);

    return (
        <PageTransition>
            <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your stats and settings.
                    </p>
                </div>

                {/* Profile card */}
                <div className="glass-card rounded-xl p-6 flex items-start gap-5">
                    <UserAvatar user={user} size="lg" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                            {user?.display_name ?? "Guest"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                                <Zap className="h-4 w-4" />
                                {formatPoints(user?.total_points ?? 0)} points
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                <Flame className="h-4 w-4" />
                                {user?.streak_days ?? 0} day streak
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
                        <Settings className="h-3.5 w-3.5" />
                        Edit
                    </button>
                </div>

                {/* Placeholder sections */}
                <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
                    Achievement badges, goal history, and avatar customization coming soon.
                </div>
            </div>
        </PageTransition>
    );
}
