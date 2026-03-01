"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import type { MockUser, Goal } from "@/lib/mockData";
import { awardDailyLogin } from "@/app/actions/points";

interface Props {
    serverUser: MockUser | null;
    serverGoals?: Goal[];
}

export function AuthInitializer({ serverUser, serverGoals = [] }: Props) {
    const { user, setUser, setTourStepIndex } = useAppStore();
    const prevUserIdRef = useRef<string | null>(null);
    const loginAwardedRef = useRef(false);

    useEffect(() => {
        if (serverUser) {
            // If a DIFFERENT user just logged in, reset onboarding so they get the tour
            const prevId = prevUserIdRef.current ?? user?.id;
            if (prevId !== serverUser.id) {
                useAppStore.setState({
                    hasSeenOnboarding: false,
                    tourStepIndex: 0,
                });
            }
            prevUserIdRef.current = serverUser.id;
            setUser(serverUser);

            // Load goals from server into store
            useAppStore.setState({ goals: serverGoals });

            // Award daily login points (once per session)
            if (!loginAwardedRef.current) {
                loginAwardedRef.current = true;
                awardDailyLogin().catch(() => { });
            }
        } else {
            setUser(null);
        }
    }, [serverUser, setUser, user?.id, setTourStepIndex, serverGoals]);

    return null;
}
