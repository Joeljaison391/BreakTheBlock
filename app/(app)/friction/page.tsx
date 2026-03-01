"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, UploadCloud, CheckCircle2, ChevronLeft, Target, Camera } from "lucide-react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as Sentry from "@sentry/nextjs";
import { submitProofAction } from "@/app/actions/proofs";
import { Confetti } from "@/components/shared/Confetti";

// Mock AI Steps
const generateMockSteps = (input: string) => [
    `Clear your immediate workspace and fetch any tools you need for "${input.slice(0, 15)}...".`,
    `Set a timer for exactly 5 minutes and focus ONLY on the very first sub-task.`,
    `Write down or block out the next immediate action you must take after the timer ends.`,
];

export default function FrictionBreakerPage() {
    const [step, setStep] = useState(1);

    // Form State
    const [input, setInput] = useState("");
    const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
    const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState<string | null>(null);
    const [afterPreview, setAfterPreview] = useState<string | null>(null);
    const [shareToFeed, setShareToFeed] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI State
    const [aiSteps, setAiSteps] = useState<string[]>([]);
    const [currentAiStepIndex, setCurrentAiStepIndex] = useState(0);

    const [showConfetti, setShowConfetti] = useState(false);
    const router = useRouter();
    const { addPoints, incrementGroupProgress, incrementGoalsCompleted } = useAppStore();

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => {
        if (step > 1) {
            setStep((s) => s - 1);
        } else {
            router.back();
        }
    };

    const handleGenerateAndNext = () => {
        Sentry.startSpan(
            {
                op: "ui.action",
                name: "Generate AI Friction Steps",
            },
            () => {
                setAiSteps(generateMockSteps(input));
                setStep(3); // Go to step 3 (AI Steps)
            }
        );
    };

    const handleStepComplete = () => {
        if (currentAiStepIndex < aiSteps.length - 1) {
            setCurrentAiStepIndex(curr => curr + 1);
            toast.success("Awesome! Next step unlocked.");
        } else {
            // All AI steps done, move to Job Confirmation
            setStep(4);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is actually an image
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        if (type === "before") {
            setBeforePhoto(file);
            setBeforePreview(previewUrl);
        } else {
            setAfterPhoto(file);
            setAfterPreview(previewUrl);
        }
    };

    const handleSubmitProof = () => {
        if (!beforePhoto || !afterPhoto) {
            toast.error("Missing photos.");
            return;
        }

        setIsSubmitting(true);

        Sentry.startSpan(
            {
                op: "ui.action",
                name: "Complete Friction Wizard",
            },
            async (span) => {
                span.setAttribute("shared_to_feed", shareToFeed);

                try {
                    // Send actual files to Server Action
                    const formData = new FormData();
                    formData.append("beforePhoto", beforePhoto);
                    formData.append("afterPhoto", afterPhoto);

                    // We mock a goalId for the Friction wizard in this demo
                    await submitProofAction(formData, "friction-goal-mock", shareToFeed);

                    setShowConfetti(true);
                    addPoints(50);
                    incrementGroupProgress(2);
                    incrementGoalsCompleted();

                    toast.success("Block Destroyed! +50 Points", {
                        description: shareToFeed ? "Proof sent to Backblaze B2!" : "Kept private.",
                        icon: <Target className="h-5 w-5 text-accent" />
                    });

                    setTimeout(() => router.push("/"), 4000);
                    setStep(6);
                } catch (err: any) {
                    toast.error("Upload failed", { description: err.message });
                    console.error("Upload Error:", err);
                } finally {
                    setIsSubmitting(false);
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col pt-12 pb-8 px-6 overflow-hidden max-w-lg mx-auto md:relative md:h-[850px] md:mt-10 md:rounded-3xl md:border md:border-border md:shadow-2xl">

            {/* Top Nav */}
            <div className="flex items-center justify-between mb-8 z-10 shrink-0">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 -ml-0.5" />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phases 1-6</span>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 relative flex flex-col justify-center">
                <AnimatePresence mode="wait">

                    {/* PHASE 1: INPUT */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-accent/20 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-accent/20">
                                    <Sparkles className="w-8 h-8 text-accent" />
                                </div>
                                <h1 className="text-3xl font-black">What's blocking you?</h1>
                                <p className="mt-2 text-muted-foreground">Tell us what you're avoiding. We'll break it down for you.</p>
                            </div>

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g. My desk is a mess and I can't focus on coding..."
                                className="w-full h-40 bg-card border border-border rounded-2xl p-4 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted/50 font-medium text-sm md:text-base"
                            />

                            <button
                                onClick={handleNext}
                                disabled={!input.trim()}
                                className="mt-6 w-full py-4 rounded-xl bg-foreground text-background font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 2: BEFORE PHOTO */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6 h-full"
                        >
                            <div className="text-center mb-2">
                                <h2 className="text-3xl font-black">Commit to the Before</h2>
                                <p className="text-muted-foreground mt-2 text-sm">Take a photo of the mess, the blank screen, or the current state before you start.</p>
                            </div>

                            <div className="relative flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-colors group mt-4 mb-6 overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleFileChange(e, "before")}
                                />

                                {beforePreview ? (
                                    <>
                                        <img src={beforePreview} alt="Before" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white mb-2" />
                                            <span className="text-white font-bold text-sm">Retake Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Camera className="w-8 h-8 text-primary" />
                                        </div>
                                        <span className="font-bold text-lg">Tap to Snap</span>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={handleGenerateAndNext}
                                disabled={!beforePhoto}
                                className="mt-auto w-full py-4 rounded-xl bg-gradient-brand shadow-glow-primary text-white font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                Give me AI Steps <Sparkles className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 3: AI STEPS Drip-Fed */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="text-center mb-6">
                                <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">Mini-Mission {currentAiStepIndex + 1}/3</span>
                                <h2 className="text-3xl font-black mt-4">Break the Friction</h2>
                            </div>

                            <div className="flex-1 flex items-center justify-center min-h-[250px]">
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={currentAiStepIndex}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                        transition={{ type: "spring", bounce: 0.4 }}
                                        className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm w-full text-center"
                                    >
                                        <p className="text-xl md:text-2xl font-bold leading-relaxed">{aiSteps[currentAiStepIndex]}</p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={handleStepComplete}
                                className="mt-12 w-full py-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-black flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                {currentAiStepIndex < 2 ? "Step Complete" : "All Steps Complete"}
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 4: JOB CONFIRMATION */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6 items-center justify-center h-full text-center"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                <Target className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-4xl font-black">Momentum Achieved!</h2>
                            <p className="text-lg text-muted-foreground max-w-sm">The hardest part is over. You've started.</p>
                            <div className="bg-muted px-6 py-4 rounded-2xl border border-border mt-4">
                                <p className="font-bold">Can you complete the whole job now?</p>
                            </div>

                            <button
                                onClick={handleNext}
                                className="mt-8 w-full py-4 rounded-xl bg-foreground text-background font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                Yes, I'm ready to finish it.
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 5: AFTER PHOTO & SHARE */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6 h-full"
                        >
                            <div className="text-center mb-2">
                                <h2 className="text-3xl font-black">The Aftermath</h2>
                                <p className="text-muted-foreground mt-2 text-sm">Snap a photo of the completed work. Be proud.</p>
                            </div>

                            <div className="relative flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-colors group mt-4 mb-4 overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleFileChange(e, "after")}
                                />

                                {afterPreview ? (
                                    <>
                                        <img src={afterPreview} alt="After" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <UploadCloud className="w-8 h-8 text-white mb-2" />
                                            <span className="text-white font-bold text-sm">Retake Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <UploadCloud className="w-8 h-8 text-accent" />
                                        </div>
                                        <span className="font-bold text-lg">Upload After Photo</span>
                                    </>
                                )}
                            </div>

                            {/* Share Toggle */}
                            <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-muted/30 cursor-pointer mb-2">
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-sm">Share to community</span>
                                    <span className="text-xs text-muted-foreground">Inspire others in San Francisco Hackers</span>
                                </div>
                                <div className={cn("w-12 h-6 rounded-full p-1 transition-colors flex", shareToFeed ? "bg-primary justify-end" : "bg-muted-foreground/30 justify-start")}>
                                    <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                                {/* Hidden input solely for standard form semantics if ever needed, but Framer layout handles visual toggle */}
                                <input type="checkbox" checked={shareToFeed} onChange={() => setShareToFeed(!shareToFeed)} className="hidden" />
                            </label>

                            <button
                                onClick={handleSubmitProof}
                                disabled={!afterPhoto || isSubmitting}
                                className="mt-auto w-full py-4 rounded-xl bg-gradient-brand shadow-glow-primary text-white font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                {isSubmitting ? "Uploading binaries..." : "Submit Proof & Earn 50 Pts"}
                                {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 6: SUCCESS */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center gap-6"
                        >
                            <Confetti trigger={showConfetti} />

                            <motion.div
                                initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", damping: 12 }}
                                className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center shadow-glow-secondary relative z-10"
                            >
                                <CheckCircle2 className="w-12 h-12 text-accent" />
                            </motion.div>

                            <div className="relative z-10">
                                <h1 className="text-4xl font-black tracking-tight mt-4">Job Done!</h1>
                                <p className="text-lg text-muted-foreground mt-2 font-medium">Friction defeated. Earned <span className="text-accent font-bold">+50 pts</span>.</p>
                            </div>

                            <div className="glass-card mt-8 p-4 rounded-2xl border border-primary/20 w-full animate-pulse relative z-10">
                                <p className="text-sm font-bold text-primary">Redirecting you to glory...</p>
                            </div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
    );
}
