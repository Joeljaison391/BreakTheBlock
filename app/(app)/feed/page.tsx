"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { ProofCard } from "@/components/shared/ProofCard";
import { feedProofs } from "@/lib/mockData";

export default function FeedPage() {
    return (
        <PageTransition>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">Community Feed</h2>
                    <p className="text-sm text-muted-foreground">See who's breaking blocks and crushing goals today.</p>
                </div>

                <div className="flex flex-col gap-5 pb-20">
                    {feedProofs.map((p) => (
                        <ProofCard key={p.id} proof={p} />
                    ))}
                    {/* Mock infinite scroll loader */}
                    <div className="py-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
