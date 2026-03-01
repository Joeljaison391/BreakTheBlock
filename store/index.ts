import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser, Goal, GroupRank, RegionRank } from "@/lib/mockData";

type Theme = "dark" | "light" | "system";

interface AppState {
    // User
    user: MockUser | null;
    setUser: (user: MockUser | null) => void;

    // Theme
    theme: Theme;
    setTheme: (theme: Theme) => void;

    // Onboarding
    hasSeenOnboarding: boolean;
    completeOnboarding: () => void;
    tourStepIndex: number;
    setTourStepIndex: (index: number) => void;

    // Global State
    groupStoneProgress: number;
    totalMonthlyGoals: number;
    globalPointsThisMonth: number;

    // Goals
    goals: Goal[];

    // Groups & Regions
    groups: GroupRank[];
    regions: RegionRank[];

    // Actions
    addPoints: (pts: number) => void;
    incrementGroupProgress: (amount: number) => void;
    incrementGoalsCompleted: () => void;
    updateGoal: (goalId: string, updater: (g: Goal) => Goal) => void;
    addGoal: (goal: Goal) => void;
    createGroup: (group: GroupRank) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initialized empty — real data comes from AuthInitializer + server actions
            user: null,
            theme: "dark",
            hasSeenOnboarding: false,
            tourStepIndex: 0,
            groupStoneProgress: 0,
            totalMonthlyGoals: 0,
            globalPointsThisMonth: 0,
            goals: [],
            groups: [],
            regions: [],

            setUser: (user) => set({ user }),
            setTheme: (theme) => set({ theme }),

            completeOnboarding: () => set({ hasSeenOnboarding: true, tourStepIndex: 0 }),
            setTourStepIndex: (index) => set({ tourStepIndex: index }),

            addPoints: (pts) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: { ...state.user, points: state.user.points + pts },
                        globalPointsThisMonth: state.globalPointsThisMonth + pts,
                    };
                }),

            incrementGroupProgress: (amount) =>
                set((state) => ({
                    groupStoneProgress: Math.min(100, state.groupStoneProgress + amount),
                })),

            incrementGoalsCompleted: () =>
                set((state) => ({
                    totalMonthlyGoals: state.totalMonthlyGoals + 1,
                })),

            updateGoal: (goalId, updater) =>
                set((state) => ({
                    goals: state.goals.map((g) => g.id === goalId ? updater(g) : g)
                })),

            addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),

            createGroup: (group) => set((state) => ({ groups: [group, ...state.groups] }))
        }),
        {
            name: "btb-store",
            partialize: (state) => ({
                theme: state.theme,
                hasSeenOnboarding: state.hasSeenOnboarding,
                tourStepIndex: state.tourStepIndex
            }),
        }
    )
);
