"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

interface DeveloperNoteProps {
    isOpen: boolean;
    onStartTour: () => void;
    onSkip: () => void;
}

export function DeveloperNote({ isOpen, onStartTour, onSkip }: DeveloperNoteProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Decorative Header Bar */}
                        <div className="h-2 w-full bg-gradient-brand" />

                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground">Welcome to Break the Block</h2>
                                    <p className="text-sm font-medium text-primary mt-1 uppercase tracking-widest">A Note from the Developer</p>
                                </div>
                                <button
                                    onClick={onSkip}
                                    className="p-2 -mr-2 -mt-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed font-medium">
                                <p>
                                    Hey there.
                                </p>
                                <p>
                                    We built <strong>Break the Block</strong> because we noticed a problem: modern digital platforms are engineered to trap us in endless, passive consumption. It's incredibly easy to lose hours doomscrolling, stuck in a state of <em>stasis</em>.
                                </p>
                                <p>
                                    This app is an experiment in reverse-engineering that dopamine loop. Instead of rewarding you for passive scrolling, we want to reward you for taking <strong>meaningful action in the real world</strong>.
                                </p>
                                <p className="p-4 bg-muted/30 border border-border/50 rounded-xl my-4 italic text-foreground">
                                    "Your goal isn't just to track habits; it's to break out of digital paralysis by building momentum—one block at a time."
                                </p>
                                <div className="mt-6 mb-4">
                                    <strong className="block mb-2 text-foreground">How to wire this into your life:</strong>
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        <li>Start small. Create just 1 or 2 hybrid goals to begin with.</li>
                                        <li>Use the <strong>Friction Breaker</strong> (the giant button at the bottom) whenever you feel paralyzed or stuck procrastinating. It will guide you out.</li>
                                        <li>Celebrate your wins by posting proof to the community. Your individual momentum fuels the Global Stone.</li>
                                    </ul>
                                </div>
                                <p>
                                    Let's break some blocks.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    onClick={onStartTour}
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-glow-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Quick Tour
                                </button>
                                <button
                                    onClick={onSkip}
                                    className="w-full text-sm font-bold text-muted-foreground py-2 hover:text-foreground transition-colors"
                                >
                                    Skip Tour & Dive In
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
