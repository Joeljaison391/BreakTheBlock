"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedStone } from "@/components/shared/AnimatedStone";
import { useAppStore } from "@/store";

import { Target, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { ProofCard } from "@/components/shared/ProofCard";
import { useRouter } from "next/navigation";
import { DeveloperNote } from "@/components/onboarding/DeveloperNote";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { useState, useEffect } from "react";

export default function HomePage() {
    const { groupStoneProgress, hasSeenOnboarding, completeOnboarding, goals } = useAppStore();
    const router = useRouter();

    const [showDevNote, setShowDevNote] = useState(false);

    useEffect(() => {
        // Automatically show the developer note if they haven't seen it yet.
        // We delay slightly to let the page animation finish naturally.
        if (!hasSeenOnboarding) {
            const timer = setTimeout(() => setShowDevNote(true), 500);
            return () => clearTimeout(timer);
        }
    }, [hasSeenOnboarding]);

    const handleStartTour = () => {
        setShowDevNote(false);
        // Dispatch an event to wake up the TourOverlay component
        window.dispatchEvent(new Event("startOnboardingTour"));
    };

    const handleSkip = () => {
        setShowDevNote(false);
        completeOnboarding();
    };

    return (
        <PageTransition>
            <DeveloperNote
                isOpen={showDevNote}
                onStartTour={handleStartTour}
                onSkip={handleSkip}
            />
            <TourOverlay />

            <div className="flex flex-col gap-8">

                {/* HERO SECTION */}
                <section id="tour-step-global-stone" className="relative flex flex-col items-center justify-center pt-8 pb-4 text-center">
                    <div className="flex flex-col items-center hover:cursor-pointer group" title="Global Group active!">
                        <div className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Global Stone</span>
                        </div>

                        <AnimatedStone
                            progress={groupStoneProgress}
                            size="lg"
                            className="mt-6 mb-2"
                            showText
                        />

                        <h2 className="text-xl font-black mt-2">Level 4: The Monolith</h2>
                        <p className="text-sm text-muted-foreground mt-1 px-4">{groupStoneProgress}% destroyed by the community.</p>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section id="tour-step-friction" className="px-1">
                    <button
                        onClick={() => router.push("/friction")}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-brand shadow-glow-primary active:scale-95 transition-transform"
                    >
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-lg text-white">Crack a block right now</span>
                            <span className="text-sm font-medium text-white/80">Launch Friction Breaker →</span>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                    </button>
                </section>

                {/* MY GOALS SCROLL */}
                <section id="tour-step-my-goals" className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-lg">My Goals This Month</h3>
                        <Link href="/goals" className="text-xs font-bold text-primary hover:underline flex items-center">
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        {goals.length > 0 ? goals.map((g) => (
                            <div key={g.id} className="min-w-[240px] snap-center glass-card border border-border/50 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                        <Target className="h-4 w-4 text-accent" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">{g.progress}%</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm line-clamp-1">{g.title}</h4>
                                    <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: `${g.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="min-w-[240px] glass-card border border-dashed border-border rounded-2xl p-4 text-center">
                                <p className="text-sm text-muted-foreground">No goals yet. Create one!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* RECENT ACTIVITY */}
                <section className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg px-1">Recent Activity</h3>
                    <div className="flex flex-col gap-4">
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <p className="text-sm text-muted-foreground">Your community feed will appear here once people start posting proofs.</p>
                        </div>
                    </div>
                    <Link href="/feed" className="w-full py-3 text-center text-sm font-bold text-muted-foreground hover:text-foreground">
                        View full feed
                    </Link>
                </section>

            </div>
        </PageTransition>
    );
}
