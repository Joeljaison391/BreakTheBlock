import { PageTransition } from "@/components/shared/PageTransition";
import { Users } from "lucide-react";

export default function CommunityPage() {
    return (
        <PageTransition>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Community</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        See what others are breaking through.
                    </p>
                </div>

                <div className="glass-card flex flex-col items-center rounded-xl p-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                        <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">Community feed coming soon</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        Public goals and proof posts will appear here with realtime updates.
                    </p>
                </div>
            </div>
        </PageTransition>
    );
}
