"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Target, CalendarDays, ListOrdered, Camera, BookOpen, PenTool, CheckCircle2, Image as ImageIcon, Link2, FileText, XCircle } from "lucide-react";
import { useAppStore } from "@/store";
import { Goal, GoalType } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Confetti } from "@/components/shared/Confetti";

import { createGoal } from "@/app/actions/goals";
import { awardPoints } from "@/app/actions/points";

const GOAL_TYPES: { id: GoalType; label: string; icon: any; desc: string }[] = [
    { id: "DailyHabit", label: "Daily Habit", icon: CalendarDays, desc: "Check a box every day (e.g. Meditate)" },
    { id: "CountTarget", label: "Number Target", icon: Target, desc: "Hit a specific number (e.g. Read 10 books)" },
    { id: "MultiStep", label: "Multi-Step Project", icon: ListOrdered, desc: "A checklist of milestones (e.g. Build an app)" },
    { id: "ProofOnly", label: "Big Win (Proof)", icon: Camera, desc: "One massive task needing a photo (e.g. Run a marathon)" },
    { id: "Journal", label: "Daily Journal", icon: BookOpen, desc: "Reflect and write text logs (e.g. Gratitude)" },
];

export default function CreateGoalPage() {
    const router = useRouter();
    const { addGoal } = useAppStore();

    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);

    // Form State
    const [type, setType] = useState<GoalType | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [enableLogging, setEnableLogging] = useState(false);
    const [postCompletionProofType, setPostCompletionProofType] = useState<'none' | 'image' | 'link' | 'blog'>('none');

    // Type-Specific State
    const [targetNumber, setTargetNumber] = useState<number>(10);
    const [unit, setUnit] = useState<string>("times");
    const [multiSteps, setMultiSteps] = useState([{ id: "1", title: "" }]);
    const [habitDurationDays, setHabitDurationDays] = useState<number>(30);

    const [showConfetti, setShowConfetti] = useState(false);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => step > 1 ? setStep(s => s - 1) : router.back();

    const addMultiStep = () => {
        setMultiSteps([...multiSteps, { id: Date.now().toString(), title: "" }]);
    };

    const updateMultiStep = (id: string, val: string) => {
        setMultiSteps(multiSteps.map(s => s.id === id ? { ...s, title: val } : s));
    };

    const handleCreate = async () => {
        if (!type || !title.trim() || saving) return;
        setSaving(true);

        let trackingConfig: any = {};
        if (type === "DailyHabit") {
            trackingConfig = {
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + habitDurationDays * 24 * 60 * 60 * 1000).toISOString(),
                completedDates: []
            };
        }
        if (type === "CountTarget") trackingConfig = { targetNumber, currentNumber: 0, unit };
        if (type === "MultiStep") trackingConfig.steps = multiSteps.filter(s => s.title.trim() !== "").map(s => ({ id: s.id, title: s.title, completed: false }));
        if (type === "ProofOnly") trackingConfig.requiresProof = true;
        if (type === "Journal") trackingConfig.minEntriesPerMonth = 30;

        // Save to Supabase
        const result = await createGoal({
            title,
            description,
            type,
            tracking_config: trackingConfig,
            enable_logging: enableLogging,
            post_completion_proof_type: postCompletionProofType,
        });

        if (result.error) {
            toast.error(result.error);
            setSaving(false);
            return;
        }

        // Add to local store for immediate UI update
        const dbGoal = result.goal;
        addGoal({
            id: dbGoal.id,
            title: dbGoal.title,
            description: dbGoal.description || "",
            type: dbGoal.type,
            trackingConfig: dbGoal.tracking_config || {},
            enableLogging: dbGoal.enable_logging || false,
            postCompletionProofType: dbGoal.post_completion_proof_type || "none",
            logs: [],
            progress: 0,
            pointsEarned: 0,
            lastUpdated: dbGoal.created_at,
            endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
        });

        setShowConfetti(true);
        toast.success("Goal Created Successfully!");

        setTimeout(() => {
            router.push("/goals");
        }, 2500);

        setStep(5);
    };

    const isStep2Valid = title.trim().length > 0;
    const isStep3Valid =
        type === "CountTarget" ? targetNumber > 0 && unit.trim() !== "" :
            type === "MultiStep" ? multiSteps.some(s => s.title.trim() !== "") :
                type === "DailyHabit" ? habitDurationDays > 0 : true;

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
                {step < 5 && <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step {step} of 4</span>}
                <div className="w-10" />
            </div>

            <div className="flex-1 relative flex flex-col">
                <AnimatePresence mode="wait">

                    {/* STEP 1: SELECT TYPE */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 h-full">
                            <div>
                                <h1 className="text-3xl font-black text-foreground">What kind of goal?</h1>
                                <p className="text-muted-foreground mt-2 font-medium">Choose a tracking style that fits your objective.</p>
                            </div>

                            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-6 flex-1 mt-2">
                                {GOAL_TYPES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]",
                                            type === t.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card hover:border-primary/50"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", type === t.id ? "bg-primary text-white shadow-glow-primary" : "bg-muted text-muted-foreground")}>
                                            <t.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-foreground text-lg tracking-tight">{t.label}</span>
                                            <span className="text-sm text-muted-foreground font-medium leading-snug">{t.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!type}
                                className="w-full py-4 rounded-xl bg-foreground text-background font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 shrink-0"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 h-full">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-3 bg-primary/10 px-3 py-1 rounded-md text-primary font-bold text-xs uppercase tracking-widest">
                                    <Target className="w-3.5 h-3.5" />
                                    {GOAL_TYPES.find(t => t.id === type)?.label}
                                </div>
                                <h1 className="text-3xl font-black text-foreground">Name your goal</h1>
                            </div>

                            <div className="flex flex-col gap-4 mt-2">
                                <div>
                                    <label className="text-sm font-bold text-muted-foreground ml-1 mb-1.5 block">Goal Title</label>
                                    <input
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Read 12 Books"
                                        className="w-full bg-card border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-lg placeholder:font-medium"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-muted-foreground ml-1 mb-1.5 block">Description (Optional)</label>
                                    <textarea
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        placeholder="Why are you doing this?"
                                        className="w-full h-32 bg-card border border-border rounded-xl px-4 py-3.5 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!isStep2Valid}
                                className="mt-auto w-full py-4 rounded-xl bg-foreground text-background font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: TYPE SPECIFIC CONFIG (if needed) */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 h-full">

                            {/* Skip step if no specific config needed */}
                            {["ProofOnly", "Journal"].includes(type!) ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h2 className="text-2xl font-black text-foreground">Standard Tracking</h2>
                                    <p className="text-muted-foreground max-w-[250px]">No extra setup required for this behavior module.</p>
                                </div>
                            ) : null}

                            {/* Daily Habit Setup */}
                            {type === "DailyHabit" && (
                                <>
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground">Set duration</h1>
                                        <p className="text-muted-foreground mt-2 font-medium">How many days will you commit to this habit?</p>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-2 flex-1">
                                        <div>
                                            <label className="text-sm font-bold text-muted-foreground ml-1 mb-1.5 block">Total Days</label>
                                            <input type="number" value={habitDurationDays} onChange={e => setHabitDurationDays(parseInt(e.target.value) || 0)} className="w-full bg-card border border-border rounded-xl px-4 py-3.5 outline-none font-bold text-2xl" autoFocus />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* CountTarget Setup */}
                            {type === "CountTarget" && (
                                <>
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground">Set your target</h1>
                                        <p className="text-muted-foreground mt-2 font-medium">What number are you trying to hit?</p>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-2">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-sm font-bold text-muted-foreground ml-1 mb-1.5 block">Target Number</label>
                                                <input type="number" value={targetNumber} onChange={e => setTargetNumber(parseInt(e.target.value) || 0)} className="w-full bg-card border border-border rounded-xl px-4 py-3.5 outline-none font-bold text-2xl text-center" />
                                            </div>
                                            <div className="flex-[2]">
                                                <label className="text-sm font-bold text-muted-foreground ml-1 mb-1.5 block">Unit</label>
                                                <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. chapters, km, problems" className="w-full bg-card border border-border rounded-xl px-4 py-3.5 outline-none font-bold text-lg" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* MultiStep Setup */}
                            {type === "MultiStep" && (
                                <div className="flex flex-col h-full">
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground">Milestones</h1>
                                        <p className="text-muted-foreground mt-2 font-medium">Break this project down into steps.</p>
                                    </div>
                                    <div className="mt-6 flex flex-col gap-3 flex-1 overflow-y-auto min-h-[250px]">
                                        {multiSteps.map((s, i) => (
                                            <div key={s.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black text-muted-foreground shrink-0">{i + 1}</div>
                                                <input
                                                    value={s.title} onChange={e => updateMultiStep(s.id, e.target.value)}
                                                    placeholder="Step description..."
                                                    className="flex-1 bg-card border border-border rounded-xl px-4 py-3 focus:border-primary outline-none text-sm font-medium transition-colors"
                                                    autoFocus={i === multiSteps.length - 1}
                                                />
                                            </div>
                                        ))}
                                        <button onClick={addMultiStep} className="mt-2 text-sm font-bold text-primary self-start hover:underline">
                                            + Add another step
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={!isStep3Valid}
                                className="mt-auto w-full py-4 rounded-xl bg-foreground text-background font-black flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 shrink-0"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: TOGGLES & CREATE */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 h-full">
                            <div>
                                <h1 className="text-3xl font-black text-foreground">Activate Tracking System</h1>
                                <p className="text-muted-foreground mt-2 font-medium">Final confirmations.</p>
                            </div>

                            <div className="mt-6">
                                <label className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card cursor-pointer group hover:border-primary/50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <PenTool className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <span className="font-bold text-foreground leading-none">Hybrid Logging</span>
                                        <span className="text-xs text-muted-foreground leading-snug">Add a quick text note capability to any progress event. Earn bonus points for reflecting.</span>
                                    </div>
                                    <div className={cn("w-14 h-7 rounded-full p-1 transition-colors flex shrink-0", enableLogging ? "bg-accent justify-end" : "bg-muted-foreground/30 justify-start")}>
                                        <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-sm" />
                                    </div>
                                    <input type="checkbox" checked={enableLogging} onChange={e => setEnableLogging(e.target.checked)} className="hidden" />
                                </label>
                            </div>

                            <div className="mt-2 flex-1">
                                <h3 className="font-bold text-foreground mb-3 text-sm ml-1">Completion Verification Protocol</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'none', label: 'None', icon: XCircle, desc: 'Auto-complete' },
                                        { id: 'image', label: 'Image Proof', icon: ImageIcon, desc: 'Before & After photo' },
                                        { id: 'link', label: 'Link URL', icon: Link2, desc: 'GitHub, Strava, etc.' },
                                        { id: 'blog', label: 'Blog Post', icon: FileText, desc: 'Write about the journey' },
                                    ].map(proof => (
                                        <button
                                            key={proof.id}
                                            onClick={() => setPostCompletionProofType(proof.id as any)}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 flex flex-col items-start gap-2 text-left transition-all active:scale-[0.98]",
                                                postCompletionProofType === proof.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card hover:border-primary/50"
                                            )}
                                        >
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", postCompletionProofType === proof.id ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                                <proof.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground text-sm">{proof.label}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium leading-snug">{proof.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                className="mt-auto w-full py-4 rounded-xl bg-gradient-brand text-white shadow-glow-primary font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                Create Engine <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: SUCCESS */}
                    {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-6">
                            <Confetti trigger={showConfetti} />
                            <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", damping: 12 }} className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-primary relative z-10">
                                <Target className="w-12 h-12 text-primary" />
                            </motion.div>
                            <div className="relative z-10">
                                <h1 className="text-4xl font-black tracking-tight mt-4">Goal Secured.</h1>
                                <p className="text-lg text-muted-foreground mt-2 font-medium">System instantiated and tracking online.</p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
