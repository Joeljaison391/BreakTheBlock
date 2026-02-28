"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMockSession } from "@/lib/mock-auth";
import { useAppStore } from "@/store";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { setUser } = useAppStore();

    useEffect(() => {
        const session = getMockSession();
        if (!session) {
            router.replace("/login");
        } else {
            setUser(session);
        }
    }, [router, setUser]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
