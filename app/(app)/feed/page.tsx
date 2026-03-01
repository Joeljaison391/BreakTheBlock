"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { ProofCard } from "@/components/shared/ProofCard";
import { Rss } from "lucide-react";

export default function FeedPage() {
    return (
        <PageTransition>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">Community Feed</h2>
                    <p className="text-sm text-muted-foreground">See who's breaking blocks and crushing goals today.</p>
                </div>

                <div className="flex flex-col gap-5 pb-20">
                    {/* Empty state — feed proofs will be fetched from Supabase */}
                    <div className="glass-card rounded-2xl p-10 text-center border border-dashed border-border">
                        <Rss className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-black text-lg mb-2">No proofs yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Be the first to upload proof of your progress! Complete a goal or use the Friction Breaker to share your win.
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
