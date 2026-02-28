import { PageTransition } from "@/components/shared/PageTransition";
import { Target, Flame, Zap, TrendingUp } from "lucide-react";

const stats = [
    { label: "Active Goals", value: "0", icon: Target, color: "text-primary" },
    { label: "Day Streak", value: "0", icon: Flame, color: "text-primary" },
    { label: "Total Points", value: "420", icon: Zap, color: "text-accent" },
    { label: "Goals Done", value: "0", icon: TrendingUp, color: "text-secondary" },
];

export default function DashboardPage() {
    return (
        <PageTransition>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Welcome back 👋
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your blocks won&apos;t break themselves. Let&apos;s get to it.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="glass-card flex flex-col gap-3 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                                <s.icon className={`h-4 w-4 ${s.color}`} />
                            </div>
                            <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
                        </div>
                    ))}
                </div>

                {/* Placeholder content */}
                <div className="glass-card rounded-xl p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">No goals yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first goal to start breaking blocks.
                    </p>
                    <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        + New Goal
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
