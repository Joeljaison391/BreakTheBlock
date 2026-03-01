"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { BottomNav } from "@/components/shared/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative">
                <Topbar />

                {/* Main Content Area */}
                {/* Increased bottom padding on mobile for the floating BottomNav */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
                    <div className="mx-auto max-w-5xl h-full w-full">
                        {children}
                    </div>
                </main>

                <BottomNav />
            </div>
        </div>
    );
}
