"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { PageTransition } from "@/components/shared/PageTransition";
import { ArrowLeft, Globe, Users, Key, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function CreateGroupPage() {
    const router = useRouter();
    const { regions, createGroup, user } = useAppStore();

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [regionId, setRegionId] = useState(regions[0]?.id || "r1");
    const [inviteCode, setInviteCode] = useState("");

    const handleGenerateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setInviteCode(code);
        setStep(3);

        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ff6b35', '#10b981']
        });
    };

    const handleCreate = () => {
        const newGroup = {
            id: `g_${Date.now()}`,
            name,
            points: 0,
            stoneProgress: 0,
            memberCount: 1,
            regionId,
            adminId: user?.id || "u1",
            inviteCode,
        };

        createGroup(newGroup);
        toast.success(`Group "${name}" created successfully!`);
        router.push("/leaderboard");
    };

    return (
        <PageTransition>
            <div className="flex flex-col gap-6 pb-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-1">Create Group</h2>
                        <p className="text-sm text-muted-foreground">Form your faction and break stones together.</p>
                    </div>
                </div>

                <div className="relative glass-card border border-border rounded-3xl p-6 min-h-[400px] flex flex-col pt-10">

                    {/* Stepper Progress */}
                    <div className="absolute top-0 left-0 right-0 flex h-1.5 bg-muted rounded-t-3xl overflow-hidden">
                        <motion.div
                            className="bg-primary h-full"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Name */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-4">
                                    <div className="mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-black">Group Details</h3>
                                        <p className="text-sm text-muted-foreground">Give your new faction a powerful name.</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Group Name</label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Austin Builders"
                                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-primary transition-colors"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        disabled={name.trim().length === 0}
                                        onClick={() => setStep(2)}
                                        className="mt-auto w-full bg-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Region */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-4">
                                    <div className="mb-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                                            <Globe className="w-6 h-6 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-black">Select Region</h3>
                                        <p className="text-sm text-muted-foreground">Which global stone will your group be attacking?</p>
                                    </div>

                                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto no-scrollbar pb-4 mt-2">
                                        {regions.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => setRegionId(r.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border text-left transition-colors",
                                                    regionId === r.id ? "bg-accent/10 border-accent" : "bg-card border-border hover:bg-muted"
                                                )}
                                            >
                                                <span className={cn("font-bold", regionId === r.id ? "text-accent" : "text-foreground")}>{r.name}</span>
                                                {regionId === r.id && <Check className="w-4 h-4 text-accent" />}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleGenerateCode}
                                        className="mt-auto w-full bg-primary text-white font-bold py-3.5 rounded-xl"
                                    >
                                        Generate Invite Code
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 3: Invite Code */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-4 items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                                        <Key className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black">Group Ready!</h3>
                                    <p className="text-sm text-muted-foreground max-w-[250px]">Share this invite code with your friends to let them join your faction.</p>

                                    <div
                                        className="bg-card border-2 border-primary/50 border-dashed rounded-2xl px-6 py-4 mt-4 select-all cursor-pointer hover:bg-card/80 transition-colors"
                                        onClick={() => {
                                            if (navigator?.clipboard?.writeText) {
                                                navigator.clipboard.writeText(inviteCode);
                                                toast.success("Copied to clipboard!");
                                            } else {
                                                const textArea = document.createElement("textarea");
                                                textArea.value = inviteCode;
                                                document.body.appendChild(textArea);
                                                textArea.select();
                                                try {
                                                    document.execCommand('copy');
                                                    toast.success("Copied to clipboard!");
                                                } catch (err) {
                                                    toast.error("Failed to copy code.");
                                                }
                                                document.body.removeChild(textArea);
                                            }
                                        }}
                                    >
                                        <span className="text-3xl font-black tracking-widest text-primary">{inviteCode}</span>
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-widest">Tap to copy</div>
                                    </div>

                                    <button
                                        onClick={handleCreate}
                                        className="mt-auto w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-glow-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                                    >
                                        Go to Leaderboard
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
}
