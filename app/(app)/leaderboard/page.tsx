"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedStone } from "@/components/shared/AnimatedStone";
import { useAppStore } from "@/store";
import Link from "next/link";
import { Trophy, Globe, MapPin, Users, ChevronRight, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPoints } from "@/lib/utils";
import { fetchGroups, fetchRegions, getUserGroup } from "@/app/actions/groups";

type LeaderboardTab = "global" | "region" | "group";

export default function LeaderboardPage() {
    const { groupStoneProgress, totalMonthlyGoals, globalPointsThisMonth, user } = useAppStore();
    const [lbTab, setLbTab] = useState<LeaderboardTab>("group");
    const [loading, setLoading] = useState(true);

    // Data from Supabase
    const [groups, setGroups] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const [myGroup, setMyGroup] = useState<any>(null);

    useEffect(() => {
        async function load() {
            const [g, r, ug] = await Promise.all([fetchGroups(), fetchRegions(), getUserGroup()]);
            setGroups(g);
            setRegions(r);
            setMyGroup(ug);
            setLoading(false);
        }
        load();
    }, []);

    const MY_REGION_ID = myGroup?.region_id || regions[0]?.id || "";
    const MY_GROUP_ID = myGroup?.id || "";

    const [selectedRegionId, setSelectedRegionId] = useState<string>("");
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");

    // Set defaults once data loads
    useEffect(() => {
        if (!loading) {
            setSelectedRegionId(MY_REGION_ID);
            setSelectedGroupId(MY_GROUP_ID);
        }
    }, [loading, MY_REGION_ID, MY_GROUP_ID]);

    if (loading) {
        return (
            <PageTransition>
                <div className="flex items-center justify-center h-[50vh]">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </PageTransition>
        );
    }

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

                            if (!group) {
                                return (
                                    <div className="glass-card rounded-3xl p-8 text-center">
                                        <div className="text-4xl mb-4">👥</div>
                                        <h3 className="font-black text-xl mb-2">No Group Yet</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Join or create a faction to see your group stone.</p>
                                        <Link href="/groups/create" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold">
                                            <Plus className="w-4 h-4" /> Create Group
                                        </Link>
                                    </div>
                                );
                            }

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
                                        <AnimatedStone progress={group.stone_progress || 0} size="sm" showText />
                                        <h3 className="mt-4 font-black text-2xl">{group.name}</h3>
                                        <div className="flex gap-4 mt-2 mb-2">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                                <span className="font-black text-accent">{formatPoints(group.points || 0)}</span>
                                            </div>
                                            <div className="flex flex-col items-center border-l border-border pl-4">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Members</span>
                                                <span className="font-black text-foreground">{group.member_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                                        <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Top Members</div>
                                        {user ? (
                                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black w-4 text-center text-primary">1</span>
                                                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
                                                    <span className="font-bold text-sm">{user.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-accent">{formatPoints(user.points)}</span>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground text-sm">No members yet</div>
                                        )}
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

                            if (!region) {
                                return (
                                    <div className="glass-card rounded-3xl p-8 text-center">
                                        <div className="text-4xl mb-4">🌍</div>
                                        <h3 className="font-black text-xl mb-2">No Region Data</h3>
                                        <p className="text-sm text-muted-foreground">Region data will appear once the database is seeded.</p>
                                    </div>
                                );
                            }

                            const rGroups = groups.filter(g => g.region_id === selectedRegionId);

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
                                        <AnimatedStone progress={region.stone_progress || 0} size="sm" showText colorOverride="#e83f3f" />
                                        <h3 className="mt-4 font-black text-2xl">{region.name}</h3>
                                        <div className="flex gap-4 mt-2 mb-2">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                                <span className="font-black text-accent">{formatPoints(region.points || 0)}</span>
                                            </div>
                                            <div className="flex flex-col items-center border-l border-border pl-4">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Members</span>
                                                <span className="font-black text-foreground">{region.member_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                                        <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Groups in {region.name}</div>
                                        {rGroups.length > 0 ? rGroups.sort((a, b) => (b.points || 0) - (a.points || 0)).map((g, i) => (
                                            <div
                                                key={g.id}
                                                onClick={() => { setSelectedGroupId(g.id); setLbTab("group"); }}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className={cn("text-xs font-black w-4 text-center", i === 0 ? "text-primary" : "text-muted-foreground")}>{i + 1}</span>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight">{g.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium">{g.member_count || 0} members</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-foreground">{formatPoints(g.points || 0)}</span>
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
                            <AnimatedStone progress={groupStoneProgress} size="sm" showText colorOverride="#f0a500" />
                            <h3 className="mt-4 font-black text-2xl">Earth</h3>
                            <div className="flex gap-4 mt-2 mb-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</span>
                                    <span className="font-black text-accent">{formatPoints(globalPointsThisMonth)}</span>
                                </div>
                                <div className="flex flex-col items-center border-l border-border pl-4">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Goals</span>
                                    <span className="font-black text-foreground">{totalMonthlyGoals}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border p-2 flex flex-col gap-1">
                            <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Global Regions</div>
                            {regions.length > 0 ? [...regions].sort((a, b) => (b.points || 0) - (a.points || 0)).map((r, i) => (
                                <div
                                    key={r.id}
                                    onClick={() => { setSelectedRegionId(r.id); setLbTab("region"); }}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <Globe className={cn("w-5 h-5", i === 0 ? "text-primary drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" : "text-muted-foreground")} />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{r.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{r.member_count || 0} active breakers</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-foreground">{formatPoints(r.points || 0)}</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-muted-foreground text-sm">No region data yet.</div>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>
        </PageTransition>
    );
}
