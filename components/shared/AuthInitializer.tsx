"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import type { MockUser } from "@/lib/mockData";

export function AuthInitializer({ serverUser }: { serverUser: MockUser | null }) {
    const { user, setUser, setTourStepIndex } = useAppStore();
    const prevUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (serverUser) {
            // If a DIFFERENT user just logged in, reset onboarding so they get the tour
            const prevId = prevUserIdRef.current ?? user?.id;
            if (prevId !== serverUser.id) {
                // New user detected — reset onboarding state
                useAppStore.setState({
                    hasSeenOnboarding: false,
                    tourStepIndex: 0,
                });
            }
            prevUserIdRef.current = serverUser.id;
            setUser(serverUser);
        } else {
            setUser(null);
        }
    }, [serverUser, setUser, user?.id, setTourStepIndex]);

    return null;
}

