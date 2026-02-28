import { PageTransition } from "@/components/shared/PageTransition";
import { Target, Plus } from "lucide-react";

export default function GoalsPage() {
    return (
        <PageTransition>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">My Goals</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Every block you break earns you points.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        New Goal
                    </button>
                </div>

                {/* Empty state */}
                <div className="glass-card flex flex-col items-center rounded-xl p-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">No goals yet</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        Set your first goal and let AI generate tiny friction-breaker steps to get you started.
                    </p>
                </div>
            </div>
        </PageTransition>
    );
}
