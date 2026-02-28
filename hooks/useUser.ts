"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMockSession, isMockAuthEnabled } from "@/lib/mock-auth";
import { useAppStore } from "@/store";

/**
 * useUser — returns the current user from the Zustand store.
 * On mount, syncs with sessionStorage mock session.
 * Replace internals with Supabase auth when ready.
 */
export function useUser() {
    const { user, setUser } = useAppStore();

    useEffect(() => {
        if (isMockAuthEnabled() && !user) {
            const session = getMockSession();
            if (session) setUser(session);
        }
    }, [user, setUser]);

    return { user, isLoading: false };
}

/**
 * useRequireAuth — redirects to /login if not authenticated.
 */
export function useRequireAuth() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const session = getMockSession();
        if (!session) {
            router.replace("/login");
        }
    }, [router]);

    return { user };
}
