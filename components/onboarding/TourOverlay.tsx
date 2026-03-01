"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import confetti from "canvas-confetti";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Check, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string; // DOM element ID to highlight
    title: string;
    description: string;
    position: "top" | "bottom" | "left" | "right";
    route: string; // The URL path where this step occurs
    action: "next" | "click"; // "next" means read and click next, "click" means click the actual highlighted element
}

const TOUR_STEPS: Step[] = [
    {
        id: "tour-step-global-stone",
        title: "The Community Stone",
        description: "This is the Global Stone. Every time any user completes a goal, they deal damage to it. We all break the block together.",
        position: "bottom",
        route: "/",
        action: "next"
    },
    {
        id: "tour-step-my-goals",
        title: "Your Battle Plan",
        description: "Track habits, numeric targets, or multi-step projects. These destroy your personal resistance and damage the global block.",
        position: "bottom",
        route: "/",
        action: "next"
    },
    {
        id: "tour-step-friction",
        title: "The Friction Breaker",
        description: "Stuck? Tap this lightning bolt anytime to have AI break your massive task into a tiny 5-minute piece to regain momentum.",
        position: "top",
        route: "/",
        action: "next"
    },
    {
        id: "tour-step-nav-leaderboard",
        title: "Competitive Ranks",
        description: "Let's check out the Leaderboards. Click this button in your navigation bar right now!",
        position: "top",
        route: "/",
        action: "click"
    },
    {
        id: "tour-step-leaderboard-tabs",
        title: "Local & Global",
        description: "You're placed into a Region based on your location. You can view Regional scores or form private Groups to compete locally!",
        position: "bottom",
        route: "/leaderboard",
        action: "next"
    },
    {
        id: "tour-step-nav-profile",
        title: "Your Legacy",
        description: "Finally, let's look at your Profile. Click your Profile link in the navigation menu.",
        position: "top",
        route: "/leaderboard",
        action: "click"
    },
    {
        id: "tour-step-profile-timeline",
        // Fallback ID if profile timeline doesn't exist yet, we'll just target the name or top
        title: "Your Journey",
        description: "Here you can track your entire history, branches, and milestones. You're ready to break your blocks. Good luck.",
        position: "bottom",
        route: "/profile",
        action: "next"
    }
];

export function TourOverlay() {
    const { hasSeenOnboarding, completeOnboarding, tourStepIndex, setTourStepIndex } = useAppStore();
    // Use session storage for isActive so it survives soft reloads during the multi-page tour if needed, 
    // or we can rely on tourStepIndex > 0 && !hasSeenOnboarding
    const [isActive, setIsActive] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Auto-resume tour if we're midway through
    useEffect(() => {
        if (!hasSeenOnboarding && tourStepIndex > 0) {
            setIsActive(true);
        }
    }, [hasSeenOnboarding, tourStepIndex]);

    // This component will be mounted, but wait to be activated by the Developer Note
    useEffect(() => {
        const handleStartTour = () => {
            setIsActive(true);
            setTourStepIndex(0);
        };
        window.addEventListener('startOnboardingTour', handleStartTour);
        return () => window.removeEventListener('startOnboardingTour', handleStartTour);
    }, [setTourStepIndex]);

    const updateTargetRect = () => {
        if (!isActive || hasSeenOnboarding) return;

        const step = TOUR_STEPS[tourStepIndex];
        if (!step) return;

        // If the current step's route doesn't match the actual URL pathname, don't show the rect 
        // (Wait for user to navigate there, or Next.js to finish transitioning)
        if (pathname !== step.route) {
            setTargetRect(null);
            return;
        }

        // The exact ID for profile fallbacks
        const targetId = step.id === 'tour-step-profile-timeline'
            ? document.getElementById('tour-step-profile-timeline') ? 'tour-step-profile-timeline' : 'tour-step-nav'
            : step.id;

        const el = document.getElementById(targetId);

        if (el) {
            // Need a tiny delay for layout shifts from DOM mounting
            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                setTargetRect(rect);

                // Only scroll into view if it's not a generic nav item (which might mess with fixed navbars)
                if (!targetId.includes("nav")) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        } else {
            setTargetRect(null);
        }
    };

    useEffect(() => {
        updateTargetRect();

        // When path changes, wait slightly for DOM mounts then update
        const timeout = setTimeout(updateTargetRect, 600);

        window.addEventListener('resize', updateTargetRect);
        window.addEventListener('scroll', updateTargetRect);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updateTargetRect);
            window.removeEventListener('scroll', updateTargetRect);
        };
    }, [tourStepIndex, isActive, pathname]);

    // Handle Route changes automatically progressing the tour
    useEffect(() => {
        if (!isActive) return;
        const step = TOUR_STEPS[tourStepIndex];

        // If we were on a step asking to click a link, and the pathname just became that target route,
        // automatically advance the tour index!
        if (step && step.action === "click" && pathname !== step.route) {
            // Did they arrive at the next mapped destination?
            const nextStep = TOUR_STEPS[tourStepIndex + 1];
            if (nextStep && pathname === nextStep.route) {
                setTourStepIndex(tourStepIndex + 1);
            }
        }
    }, [pathname, isActive, tourStepIndex, setTourStepIndex]);

    const handleNext = () => {
        if (tourStepIndex < TOUR_STEPS.length - 1) {
            setTourStepIndex(tourStepIndex + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsActive(false);
        completeOnboarding();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b35', '#10b981', '#f59e0b']
        });
    };

    if (hasSeenOnboarding || !isActive) return null;

    const step = TOUR_STEPS[tourStepIndex];
    if (!step) return null;

    // Wait until they are on the correct route to render the overlay to avoid weird jumping
    if (pathname !== step.route) return null;

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* SVG Mask to create the "spotlight" hole */}
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                <mask id="spotlight-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {targetRect && (
                        <motion.rect
                            initial={false}
                            animate={{
                                x: targetRect.x - 12 - (targetRect.width > 300 && step.id === 'tour-step-my-goals' ? 20 : 0),
                                y: targetRect.y - 12,
                                width: (step.id === 'tour-step-my-goals' ? Math.min(targetRect.width, window.innerWidth - 32) : targetRect.width) + 24,
                                height: targetRect.height + 24,
                                rx: 16
                            }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            fill="black"
                        />
                    )}
                </mask>
                <rect
                    width="100%" height="100%"
                    fill="rgba(0,0,0,0.75)"
                    mask="url(#spotlight-mask)"
                    // If it's a "click" action step, passing pointer-events-none to the background rect 
                    // allows the user to click THROUGH the overlay directly onto the highlighted link!
                    className={cn("backdrop-blur-sm transition-all", step.action === "click" ? "pointer-events-none" : "pointer-events-auto")}
                />
            </svg>

            {/* Tooltip Card */}
            {targetRect && (
                <motion.div
                    className="absolute z-[201] pointer-events-auto w-full max-w-sm px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        top: step.position === 'bottom' ? targetRect.bottom + 20 : "auto",
                        bottom: step.position === 'top' ? window.innerHeight - targetRect.top + 20 : "auto",
                        left: "50%",
                        x: "-50%",
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 250, delay: 0.1 }}
                >
                    <div className="bg-card border border-border/50 rounded-2xl shadow-2xl p-5 w-full flex flex-col gap-3 relative overflow-hidden">
                        {/* Glow accent */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black tracking-tight">{step.title}</h3>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full">
                                {tourStepIndex + 1} / {TOUR_STEPS.length}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            {step.description}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                            <button
                                onClick={handleComplete}
                                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Skip Tour
                            </button>

                            {step.action === "next" && (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-glow-primary hover:bg-primary/90 transition-transform active:scale-95"
                                >
                                    {tourStepIndex === TOUR_STEPS.length - 1 ? (
                                        <>Finish <Check className="w-4 h-4" /></>
                                    ) : (
                                        <>Next <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            )}

                            {step.action === "click" && (
                                <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 animate-pulse cursor-pointer">
                                    <MousePointerClick className="w-4 h-4" />
                                    <span>Click the highlighted link</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
