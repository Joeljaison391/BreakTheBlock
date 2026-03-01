"use client";

import { useState } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAppStore } from "@/store";
import { Goal } from "@/lib/mockData";
import { Target, Circle, Plus, Minus, CheckCircle2, Camera, PenTool, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Image as ImageIcon, Link2, FileText, CheckCircle } from "lucide-react";
import { updateGoalAction } from "@/app/actions/goals";
import { awardPoints } from "@/app/actions/points";

// --- Subcomponents for specific Goal Types ---

function DailyHabitTracker({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();

    // Safety check in case it's an old mock data format
    const config = goal.trackingConfig;
    const startDate = config.startDate ? new Date(config.startDate) : new Date();
    const endDate = config.endDate ? new Date(config.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const completedDates = config.completedDates || [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Generate an array of dates from start to end
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const days = Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        return {
            dateObj: d,
            dateStr: d.toISOString().split('T')[0],
            dayNum: i + 1,
            isToday: d.toISOString().split('T')[0] === todayStr,
            isPast: d.toISOString().split('T')[0] < todayStr,
            isFuture: d.toISOString().split('T')[0] > todayStr,
        };
    });

    return (
        <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
                {days.map(d => {
                    const isCompleted = completedDates.includes(d.dateStr);
                    const canCheck = d.isToday && !isCompleted;
                    const isFocus = d.isToday || (!d.isFuture && !d.isPast);

                    return (
                        <div
                            key={d.dateStr}
                            className={cn(
                                "w-14 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border-2 snap-center transition-colors",
                                canCheck ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-80",
                                isCompleted ? "bg-primary text-white border-primary" :
                                    d.isToday ? "bg-primary/20 border-primary text-primary shadow-glow-primary" :
                                        d.isFuture ? "bg-transparent border-border text-muted-foreground/50 border-dashed" :
                                            "bg-muted border-border text-muted-foreground line-through opacity-50" // missed past
                            )}
                            onClick={() => {
                                if (canCheck) {
                                    const newCompleted = [...completedDates, d.dateStr];
                                    const newProgress = Math.min(100, Math.round((newCompleted.length / totalDays) * 100));
                                    const newConfig = { ...config, completedDates: newCompleted };
                                    updateGoal(goal.id, g => ({
                                        ...g,
                                        progress: newProgress,
                                        trackingConfig: newConfig
                                    }));
                                    // Persist to DB + award XP
                                    updateGoalAction(goal.id, { tracking_config: newConfig, progress: newProgress });
                                    awardPoints("GOAL_STEP");
                                    toast.success("Habit checked for today!");
                                } else if (d.isFuture) {
                                    toast.error("You can only check off today's habit!");
                                } else if (d.isPast && !isCompleted) {
                                    toast.error("You missed this day. Keep moving forward!");
                                }
                            }}
                        >
                            <span className="text-[10px] uppercase font-black opacity-80 mb-0.5">Day {d.dayNum}</span>
                            <span className="text-xs font-bold mb-1 opacity-60 leading-none">{d.dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>

                            {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 mt-auto" />
                            ) : (
                                <div className={cn("w-5 h-5 mt-auto rounded-full border-2", d.isToday ? "border-current opacity-50" : "border-border")} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {completedDates.length} of {totalDays} Days Completed
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Must check in daily
                </span>
            </div>
        </div>
    );
}

function CountTargetTracker({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    const config = goal.trackingConfig;
    const target = config.targetNumber || 100;
    const current = config.currentNumber || 0;
    const percentage = Math.min(100, Math.round((current / target) * 100));

    const handleUpdate = (amt: number) => {
        const newCurrent = Math.max(0, current + amt);
        const newProgress = Math.min(100, Math.round((newCurrent / target) * 100));
        const newConfig = { ...config, currentNumber: newCurrent };
        updateGoal(goal.id, (g) => ({
            ...g,
            progress: newProgress,
            trackingConfig: newConfig
        }));
        // Persist to DB
        updateGoalAction(goal.id, { tracking_config: newConfig, progress: newProgress });
        if (amt > 0) {
            awardPoints("GOAL_STEP");
            toast.success("Progress updated!");
        } else {
            toast("Removed progress");
        }
    };

    return (
        <div className="flex items-center justify-between mt-4 bg-background rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex flex-col">
                <span className="text-3xl font-black text-foreground">{current} <span className="text-sm text-muted-foreground font-bold">/ {target} {config.unit}</span></span>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">{percentage}% Completed</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handleUpdate(-1)}
                    className="w-12 h-12 rounded-xl bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95 border border-border"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleUpdate(1)}
                    className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow-primary active:scale-95 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function MultiStepTracker({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    const steps = goal.trackingConfig.steps || [];

    const handleToggle = (stepId: string) => {
        const step = steps.find(s => s.id === stepId);
        if (!step) return;

        const newSteps = steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
        const completedCount = newSteps.filter(s => s.completed).length;
        const newProgress = Math.min(100, Math.round((completedCount / newSteps.length) * 100));
        const newConfig = { ...goal.trackingConfig, steps: newSteps };
        updateGoal(goal.id, (g) => ({ ...g, progress: newProgress, trackingConfig: newConfig }));
        // Persist to DB
        updateGoalAction(goal.id, { tracking_config: newConfig, progress: newProgress });

        if (!step.completed) {
            awardPoints("GOAL_STEP");
            toast.success("Milestone achieved!");
        }
    };
    return (
        <div className="flex flex-col gap-2 mt-4">
            {steps.map(s => (
                <div key={s.id}
                    onClick={() => handleToggle(s.id)}
                    className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors active:scale-[0.98]",
                        s.completed ? "bg-primary/10 border-primary text-foreground" : "bg-background border-border text-foreground hover:border-primary/50"
                    )}
                >
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors", s.completed ? "bg-primary text-white" : "border-2 border-muted-foreground/30")}>
                        {s.completed && <CheckSquare className="w-4 h-4" />}
                    </div>
                    <span className={cn("font-bold text-sm", s.completed && "line-through opacity-50")}>{s.title}</span>
                </div>
            ))}
            <div className="text-center mt-1">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Tap to complete step</span>
            </div>
        </div>
    );
}

function ProofOnlyTracker({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    return (
        <div
            onClick={() => {
                updateGoal(goal.id, g => ({ ...g, progress: 100 }));
                addPoints(150);
                toast.success("Massive win proof uploaded! +150 pts");
            }}
            className="mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors hover:border-primary/50 group bg-background"
        >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
            </div>
            <span className="font-black text-foreground mt-1">Upload Big Win Proof</span>
            <span className="text-xs text-muted-foreground font-semibold">Earn +150 points instantly</span>
        </div>
    );
}

function JournalTracker({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    const [entry, setEntry] = useState("");

    const handleLog = () => {
        if (!entry.trim()) return;
        updateGoal(goal.id, g => ({
            ...g,
            progress: Math.min(100, g.progress + 5), // bump progress slightly
            logs: [{ id: Date.now().toString(), date: new Date().toISOString(), text: entry }, ...(g.logs || [])]
        }));
        setEntry("");
        addPoints(15);
        toast.success("Reflection saved! +15 pts");
    };
    return (
        <div className="mt-4 flex flex-col gap-2 relative">
            <textarea
                value={entry}
                onChange={e => setEntry(e.target.value)}
                placeholder="What did you learn today? Reflect on your progress..."
                className="w-full h-28 bg-background border border-border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
            />
            <div className="absolute bottom-3 right-3">
                <button
                    disabled={!entry.trim()}
                    onClick={handleLog}
                    className="px-4 py-2 rounded-lg bg-foreground text-background font-bold text-xs disabled:opacity-50 transition-opacity active:scale-95 shadow-lg"
                >
                    Log Entry
                </button>
            </div>
        </div>
    );
}

function GoalLogger({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    const [log, setLog] = useState("");

    const handleLog = () => {
        if (!log.trim()) return;
        updateGoal(goal.id, g => ({
            ...g,
            logs: [{ id: Date.now().toString(), date: new Date().toISOString(), text: log }, ...(g.logs || [])]
        }));
        setLog("");
        addPoints(5);
        toast.success("Hybrid Note added! +5 pts");
    };

    if (!goal.enableLogging) return null;

    return (
        <div className="mt-5 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3">
                <PenTool className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Hybrid Logging</span>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={log}
                    onChange={e => setLog(e.target.value)}
                    placeholder="Add a quick note or finding..."
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                    disabled={!log.trim()}
                    onClick={handleLog}
                    className="px-5 rounded-xl bg-muted text-foreground font-bold text-sm disabled:opacity-50 hover:bg-muted/80 transition-colors active:scale-95"
                >
                    Log
                </button>
            </div>
            {goal.logs && goal.logs.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                    {goal.logs.map(l => (
                        <div key={l.id} className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{new Date(l.date).toLocaleDateString()}</span>
                            <span>{l.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Components ---

function GoalCard({ goal }: { goal: Goal }) {
    const { updateGoal, addPoints } = useAppStore();
    const [verifying, setVerifying] = useState(false);
    const [proofInput, setProofInput] = useState("");

    const isPendingVerification = goal.progress >= 100 && goal.postCompletionProofType && goal.postCompletionProofType !== 'none' && !goal.logs.some(l => l.text.startsWith("[VERIFICATION]"));

    const handleVerificationSubmit = () => {
        if (!proofInput.trim()) return;

        // Add a special verification log to bypass the check later
        updateGoal(goal.id, g => ({
            ...g,
            progress: 100, // ensure 100
            logs: [{ id: Date.now().toString(), date: new Date().toISOString(), text: `[VERIFICATION] ${g.postCompletionProofType}: ${proofInput}` }, ...(g.logs || [])]
        }));

        addPoints(50);
        toast.success("Verification accepted! +50 pts");
        setVerifying(false);
    };

    if (isPendingVerification) {
        return (
            <motion.div
                className="glass-card flex flex-col rounded-3xl p-5 md:p-6 border-2 border-primary/50 shadow-glow-primary/20 bg-primary/5 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute -right-10 -top-10 text-primary/10 rotate-12 pointer-events-none">
                    <CheckCircle className="w-48 h-48" />
                </div>

                <div className="flex flex-col relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-2 py-0.5 rounded-md">
                            Pending Verification
                        </span>
                    </div>
                    <h3 className="font-black text-2xl leading-tight text-foreground">{goal.title}</h3>
                    <p className="text-sm text-foreground/80 mt-1 font-medium leading-relaxed">
                        You've hit 100% on the tracker! Now it's time to provide your proof.
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                        <div className="bg-background rounded-xl p-4 border border-border">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                {goal.postCompletionProofType === 'image' && <><ImageIcon className="w-4 h-4 text-primary" /> Upload Photo Evidence</>}
                                {goal.postCompletionProofType === 'link' && <><Link2 className="w-4 h-4 text-primary" /> Provide Link URL</>}
                                {goal.postCompletionProofType === 'blog' && <><FileText className="w-4 h-4 text-primary" /> Write Journey Recap</>}
                            </h4>

                            {goal.postCompletionProofType === 'blog' ? (
                                <textarea
                                    value={proofInput} onChange={e => setProofInput(e.target.value)}
                                    placeholder="Tell the community how it went..."
                                    className="w-full h-24 bg-muted/50 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 resize-none font-medium"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={proofInput} onChange={e => setProofInput(e.target.value)}
                                    placeholder={goal.postCompletionProofType === 'image' ? "Attach image URL (mock)..." : "https://..."}
                                    className="w-full bg-muted/50 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 font-medium"
                                />
                            )}

                            <button
                                disabled={!proofInput.trim()}
                                onClick={handleVerificationSubmit}
                                className="w-full mt-3 py-3 rounded-lg bg-primary text-white font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
                            >
                                Submit Verification & Complete Goal
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="glass-card flex flex-col rounded-3xl p-5 md:p-6 border border-border/50 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {goal.type}
                        </span>
                        <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                            {goal.pointsEarned} PTS
                        </span>
                    </div>
                    <h3 className="font-black text-2xl leading-tight text-foreground">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">{goal.description}</p>}
                </div>

                {/* SVG Progress Ring */}
                <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="4" />
                        <motion.circle
                            cx="18" cy="18" r="16" fill="none"
                            className={goal.progress >= 100 ? "stroke-accent" : "stroke-primary"}
                            strokeWidth="4"
                            strokeDasharray="100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - goal.progress }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute text-[11px] font-black tracking-tighter">{goal.progress}%</span>
                </div>
            </div>

            {/* Dynamic Tracking UI based on goal.type (Hide if >= 100%) */}
            {goal.progress < 100 && (
                <>
                    {goal.type === "DailyHabit" && <DailyHabitTracker goal={goal} />}
                    {goal.type === "CountTarget" && <CountTargetTracker goal={goal} />}
                    {goal.type === "MultiStep" && <MultiStepTracker goal={goal} />}
                    {goal.type === "ProofOnly" && <ProofOnlyTracker goal={goal} />}
                    {goal.type === "Journal" && <JournalTracker goal={goal} />}
                    <GoalLogger goal={goal} />
                </>
            )}

            {goal.progress >= 100 && !goal.postCompletionProofType && (
                <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Goal Completed
                </div>
            )}

            {goal.progress >= 100 && goal.postCompletionProofType && goal.postCompletionProofType !== 'none' && (
                <div className="mt-4 flex flex-col gap-2">
                    <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 text-accent font-bold text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Verification Approved
                        </div>
                    </div>

                    {/* Show the entered proof log */}
                    {goal.logs.filter(l => l.text.startsWith("[VERIFICATION]")).map(log => {
                        const text = log.text.replace("[VERIFICATION] ", "");
                        const [type, ...content] = text.split(":");
                        const actualContent = content.join(":").trim();

                        return (
                            <div key={log.id} className="text-sm font-medium text-foreground bg-muted p-4 rounded-xl border border-border flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    {type === 'image' && <ImageIcon className="w-4 h-4" />}
                                    {type === 'link' && <Link2 className="w-4 h-4" />}
                                    {type === 'blog' && <FileText className="w-4 h-4" />}
                                    <span className="text-[10px] uppercase font-black tracking-widest">{type} Log</span>
                                </div>
                                <span className="italic">"{actualContent}"</span>
                            </div>
                        );
                    })}
                </div>
            )}

        </motion.div>
    );
}

export default function GoalsPage() {
    const { goals } = useAppStore();
    const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active");

    const sortedGoals = [...goals].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    const activeGoals = sortedGoals.filter(g => g.progress < 100);
    const completedGoals = sortedGoals.filter(g => g.progress >= 100);

    const displayGoals = activeTab === "Active" ? activeGoals : completedGoals;

    return (
        <PageTransition>
            <div className="flex flex-col gap-6 relative min-h-[80vh] pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Goals System</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">Your focus pillars</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/goals/templates" className="flex items-center gap-2 h-10 px-4 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-muted/80 transition-colors">
                            Browse Templates
                        </Link>
                        <Link href="/goals/create" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow-primary active:scale-95 transition-transform hover:scale-105">
                            <Plus className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-muted/50 p-1.5 rounded-2xl w-full max-w-sm mx-auto">
                    {["Active", "Completed"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Goals List */}
                <div className="flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {displayGoals.map((g) => (
                            <motion.div key={g.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}>
                                <GoalCard goal={g} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {displayGoals.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl mt-4 flex flex-col items-center justify-center gap-3">
                            <Target className="w-12 h-12 text-muted-foreground/30" />
                            <p className="font-bold text-lg">No {activeTab.toLowerCase()} goals</p>
                            <p className="text-sm max-w-xs">
                                {activeTab === "Active"
                                    ? "Start your first goal by tapping the + button in the top right."
                                    : "Complete an active goal to see it here."}
                            </p>
                        </motion.div>
                    )}
                </div>

            </div>
        </PageTransition>
    );
}
