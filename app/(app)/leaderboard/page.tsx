"use client";

import { useState } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedStone } from "@/components/shared/AnimatedStone";
import { topMembers, globalStats } from "@/lib/mockData";
import { useAppStore } from "@/store";
import Link from "next/link";
import { Trophy, Globe, MapPin, Users, ChevronRight, ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPoints } from "@/lib/utils";

type LeaderboardTab = "global" | "region" | "group";

export default function LeaderboardPage() {
    const { groups, regions } = useAppStore();
    const [lbTab, setLbTab] = useState<LeaderboardTab>("group");

    // User's default IDs
    const MY_REGION_ID = "r1";
    const MY_GROUP_ID = "g1";

    const [selectedRegionId, setSelectedRegionId] = useState<string>(MY_REGION_ID);
    const [selectedGroupId, setSelectedGroupId] = useState<string>(MY_GROUP_ID);

    return (
        <PageTransition>
            <div className="flex flex-col gap-6 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-1">Leaderboards</h2>
                        <p className="text-sm text-muted-foreground">Where do you rank in the block-breaking universe?</p>
                    </div>
                    <Link href="/groups/create" className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors">
                        <Plus className="w-5 h-5" />
                    </Link>
                </div>

                {/* Sub Tabs */}
                <div id="tour-step-leaderboard-tabs" className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
                    {[
                        { id: "global", label: "Global", icon: Globe },
                        { id: "region", label: "Region", icon: MapPin },
                        { id: "group", label: "My Group", icon: Users },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setLbTab(t.id as LeaderboardTab);
                                // reset view to user's default when clicking top tabs
                                if (t.id === 'region') setSelectedRegionId(MY_REGION_ID);
                                if (t.id === 'group') setSelectedGroupId(MY_GROUP_ID);
                            }}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border",
                                lbTab === t.id
                                    ? "bg-primary/10 border-primary/30 text-primary"
                                    : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Group View */}
                {lbTab === "group" && (
                    <motion.div key="group" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                        {(() => {
                            const group = groups.find(g => g.id === selectedGroupId) || groups[0];
                            return (
                                <>
                                    <div className="flex items-center gap-2 mb-[-8px]">
                                        {selectedGroupId !== MY_GROUP_ID && (
                                            <button onClick={() => { setLbTab("region"); setSelectedGroupId(MY_GROUP_ID); }} className="text-muted-foreground hover:text-foreground">
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div className="text-xs font-black uppercase text-muted-foreground tracking-widest bg-muted/50 px-2 py-1 rounded-md">
                                            {selectedGroupId === MY_GROUP_ID ? "Your Group Stone" : "Inspecting Group"}
                                        </div>
                                    </div>

                                    <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-card to-muted/20">
                                        <AnimatedStone progress={group.stoneProgress} size="sm" showText />
                                        <h3 className="mt-4 font-black text-2xl">{group.name}</h3>
                                        <div className="flex gap-4 mt-2 mb-2">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                                <span className="font-black text-accent">{formatPoints(group.points)}</span>
                                            </div>
                                            <div className="flex flex-col items-center border-l border-border pl-4">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Members</span>
                                                <span className="font-black text-foreground">{group.memberCount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                                        <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Top Members</div>
                                        {topMembers.map((m, i) => (
                                            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <span className={cn("text-xs font-black w-4 text-center", i === 0 ? "text-primary" : i === 1 ? "text-accent" : "text-muted-foreground")}>{i + 1}</span>
                                                    <img src={m.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
                                                    <span className="font-bold text-sm">{m.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-accent">{formatPoints(m.points)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}

                {/* Region View */}
                {lbTab === "region" && (
                    <motion.div key="region" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                        {(() => {
                            const region = regions.find(r => r.id === selectedRegionId) || regions[0];
                            const rGroups = groups.filter(g => g.regionId === selectedRegionId);

                            return (
                                <>
                                    <div className="flex items-center gap-2 mb-[-8px]">
                                        {selectedRegionId !== MY_REGION_ID && (
                                            <button onClick={() => { setLbTab("global"); setSelectedRegionId(MY_REGION_ID); }} className="text-muted-foreground hover:text-foreground">
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div className="text-xs font-black uppercase text-muted-foreground tracking-widest bg-muted/50 px-2 py-1 rounded-md">
                                            {selectedRegionId === MY_REGION_ID ? "Your Regional Stone" : "Inspecting Region"}
                                        </div>
                                    </div>

                                    <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-card to-muted/20 border-primary/20">
                                        <AnimatedStone progress={region.stoneProgress} size="sm" showText colorOverride="#e83f3f" />
                                        <h3 className="mt-4 font-black text-2xl">{region.name}</h3>
                                        <div className="flex gap-4 mt-2 mb-2">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                                <span className="font-black text-accent">{formatPoints(region.points)}</span>
                                            </div>
                                            <div className="flex flex-col items-center border-l border-border pl-4">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Members</span>
                                                <span className="font-black text-foreground">{region.memberCount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                                        <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Groups in {region.name}</div>
                                        {rGroups.length > 0 ? rGroups.sort((a, b) => b.points - a.points).map((g, i) => (
                                            <div
                                                key={g.id}
                                                onClick={() => { setSelectedGroupId(g.id); setLbTab("group"); }}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className={cn("text-xs font-black w-4 text-center", i === 0 ? "text-primary" : "text-muted-foreground")}>{i + 1}</span>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight">{g.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium">{g.memberCount} members</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-foreground">{formatPoints(g.points)}</span>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-muted-foreground font-medium text-sm">No groups formed here yet.</div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}

                {/* Global View */}
                {lbTab === "global" && (
                    <motion.div key="global" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">

                        <div className="flex items-center gap-2 mb-[-8px]">
                            <div className="text-xs font-black uppercase text-muted-foreground tracking-widest bg-muted/50 px-2 py-1 rounded-md">
                                Global Stone Status
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-card to-muted/20 border-accent/20">
                            <AnimatedStone progress={globalStats.groupStoneProgress} size="sm" showText colorOverride="#f0a500" />
                            <h3 className="mt-4 font-black text-2xl">Earth</h3>
                            <div className="flex gap-4 mt-2 mb-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                    <span className="font-black text-accent">{formatPoints(globalStats.globalPointsThisMonth)}</span>
                                </div>
                                <div className="flex flex-col items-center border-l border-border pl-4">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Goals</span>
                                    <span className="font-black text-foreground">{globalStats.totalMonthlyGoals}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                            <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Global Regions</div>
                            {[...regions].sort((a, b) => b.points - a.points).map((r, i) => (
                                <div
                                    key={r.id}
                                    onClick={() => { setSelectedRegionId(r.id); setLbTab("region"); }}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <Globe className={cn("w-5 h-5", i === 0 ? "text-primary drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" : "text-muted-foreground")} />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{r.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{r.memberCount} active breakers</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-foreground">{formatPoints(r.points)}</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </PageTransition>
    );
}
