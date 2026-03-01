"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAppStore } from "@/store";
import { Zap, Flame, Settings, MapPin, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { formatPoints, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ProfilePage() {
    const user = useAppStore((s) => s.user);
    const [activeTab, setActiveTab] = useState<"Timeline" | "Trophy Room">("Timeline");

    if (!user) {
        return (
            <PageTransition>
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-10">

                {/* Profile Hero */}
                <section className="flex flex-col items-center mt-4">
                    <div className="relative">
                        <UserAvatar user={user} size="lg" className="h-28 w-28 border-4 border-background shadow-xl" />
                        <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                            <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center shadow-glow-primary">
                                <Flame className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black mt-4">{user.name}</h2>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.geo}</span>
                    </div>

                    <div className="flex gap-6 mt-6">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-accent">{formatPoints(user.points)}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Total Points</span>
                        </div>
                        <div className="w-px bg-border my-2" />
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-primary">{user.streak}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Day Streak</span>
                        </div>
                    </div>
                </section>

                {/* Badges */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Earned Badges</h3>
                        <span className="text-xs font-bold text-muted-foreground">{user.badges.length} Unlocked</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {user.badges.map((b, i) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card flex flex-col items-center text-center p-3 rounded-2xl group relative"
                            >
                                <div className="text-4xl filter drop-shadow-md mb-2 group-hover:scale-110 transition-transform">{b.icon}</div>
                                <span className="text-[11px] font-bold leading-tight line-clamp-2">{b.name}</span>

                                {/* CSS Tooltip */}
                                <div className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 w-[140px] p-2 bg-popover text-popover-foreground text-[10px] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none text-center">
                                    {b.description}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Tabs */}
                <div className="flex bg-muted/50 p-1.5 rounded-2xl w-full max-w-sm mx-auto mt-2">
                    {["Timeline", "Trophy Room"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab === "Timeline" ? <Zap className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-2 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "Timeline" && (
                            <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <section id="tour-step-profile-timeline">
                                    <div className="relative pl-[30px] ml-2 border-l-[3px] border-border space-y-10 pb-8 mt-4">

                                        {/* Task Creation (Diverge) */}
                                        <div className="relative">
                                            {/* Main timeline dot */}
                                            <div className="absolute -left-[39px] top-2 w-[15px] h-[15px] rounded-full bg-background border-[4px] border-muted-foreground z-10" />
                                            {/* Branch curve OUT */}
                                            <div className="absolute -left-[30px] top-[14px] w-5 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-2xl origin-top-left" />

                                            <div className="flex flex-col gap-1.5 ml-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today</span>
                                                <div className="glass-card p-4 rounded-2xl border border-primary/20 shadow-sm relative">
                                                    {/* Connector line to card */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-2 h-0 border-t-[3px] border-primary" />
                                                    <h4 className="font-bold text-sm">Created Goal: 75 Hard Challenge</h4>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Tracking engine initialized.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mid-progress log (on branch) */}
                                        <div className="relative ml-5">
                                            {/* Branch line vertical continuing down */}
                                            <div className="absolute -left-[35px] -top-12 w-0 h-[120px] border-l-[3px] border-primary" />
                                            {/* Dot on the branch */}
                                            <div className="absolute -left-[39px] top-4 w-[11px] h-[11px] rounded-full bg-primary z-10" />

                                            <div className="flex flex-col gap-1.5 ml-0">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Yesterday</span>
                                                <div className="p-3 bg-muted/30 rounded-xl border border-border">
                                                    <p className="text-xs font-medium text-foreground">Logged 5k run + 1 gallon water.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Completion (Merge) */}
                                        <div className="relative">
                                            {/* Main timeline dot (end) */}
                                            <div className="absolute -left-[39px] top-2 w-[15px] h-[15px] rounded-full bg-primary ring-4 ring-primary/20 z-10" />
                                            {/* Branch curve IN */}
                                            <div className="absolute -left-[30px] bottom-full mb-3 w-5 h-10 border-t-[3px] border-l-[3px] border-primary rounded-tl-2xl" />

                                            <div className="flex flex-col gap-1.5 ml-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Mar 24</span>
                                                <div className="bg-gradient-brand text-white p-4 rounded-2xl shadow-glow-primary relative overflow-hidden">
                                                    {/* Connector line to card */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-2 h-0 border-t-[3px] border-primary" />
                                                    <h4 className="font-bold text-sm relative z-10">Completed: Read 12 Books</h4>
                                                    <p className="text-xs text-white/80 mt-0.5 font-medium relative z-10">+1000 Total Points Earned</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "Trophy Room" && (
                            <motion.div key="trophy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <section>
                                    <div className="columns-2 gap-3 space-y-3 mt-4">
                                        {[20, 40, 21, 60, 41, 12, 11].map((id, i) => (
                                            <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer break-inside-avoid">
                                                <img src={`https://picsum.photos/id/${id}/300/${200 + (i % 3) * 50}`} alt="Proof" className="w-full h-auto object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                                        <span className="text-xs font-bold text-white">Done</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="flex justify-center w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mt-4 bg-muted/30 rounded-2xl">
                    <Settings className="w-4 h-4 mr-2" /> Account Settings
                </button>

            </div>
        </PageTransition>
    );
}
