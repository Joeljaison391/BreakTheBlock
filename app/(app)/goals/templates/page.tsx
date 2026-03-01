"use client";

import { PageTransition } from "@/components/shared/PageTransition";
import { goalTemplates, Goal } from "@/lib/mockData";
import { ChevronLeft, Download, Plus, Target, CalendarDays, ListOrdered, Camera, BookOpen } from "lucide-react";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TYPE_ICONS: Record<string, any> = {
    "DailyHabit": CalendarDays,
    "CountTarget": Target,
    "MultiStep": ListOrdered,
    "ProofOnly": Camera,
    "Journal": BookOpen,
};

const TYPE_LABELS: Record<string, string> = {
    "DailyHabit": "Daily Habit",
    "CountTarget": "Number Target",
    "MultiStep": "Step-by-Step",
    "ProofOnly": "Big Win (Proof)",
    "Journal": "Daily Journal",
};

export default function GoalTemplatesPage() {
    const router = useRouter();
    const { addGoal } = useAppStore();

    const handleActivate = (template: typeof goalTemplates[0]) => {
        const newGoal: Goal = {
            id: `g_tpl_${Date.now()}`,
            title: template.title,
            description: template.description,
            type: template.type,
            trackingConfig: JSON.parse(JSON.stringify(template.trackingConfig)), // deep copy for nested steps
            enableLogging: true, // default templates to true
            logs: [],
            progress: 0,
            pointsEarned: 0,
            lastUpdated: new Date().toISOString(),
            endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
        };

        addGoal(newGoal);
        toast.success(`Activated: ${template.title}!`);
        router.push("/goals");
    };

    return (
        <PageTransition>
            <div className="flex flex-col gap-6 relative min-h-[80vh] pb-20 mt-2 md:mt-0">

                {/* Header */}
                <div className="flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 -ml-1" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Template Store</h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Community curated goals</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {goalTemplates.map((tpl, i) => {
                        const Icon = TYPE_ICONS[tpl.type] || Target;
                        return (
                            <motion.div
                                key={tpl.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card flex flex-col rounded-3xl p-5 border border-border/50 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 bg-primary/10 px-2.5 py-1 rounded-md">
                                        <Icon className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                            {TYPE_LABELS[tpl.type]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                        <Download className="w-3 h-3" />
                                        <span className="text-xs font-bold">{(tpl.downloads / 1000).toFixed(1)}k</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-foreground leading-tight mb-2">{tpl.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 flex-1">
                                    {tpl.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <img src={tpl.creator.avatar} alt={tpl.creator.name} className="w-6 h-6 rounded-full bg-muted" />
                                        <span className="text-xs font-bold text-muted-foreground">By {tpl.creator.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleActivate(tpl)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-md hover:opacity-90"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Activate
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </PageTransition>
    );
}
