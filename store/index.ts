import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser } from "@/lib/mock-auth";

type Theme = "dark" | "light" | "system";

interface AppState {
    // User
    user: MockUser | null;
    setUser: (user: MockUser | null) => void;

    // Theme
    theme: Theme;
    setTheme: (theme: Theme) => void;

    // Points (optimistic UI)
    pointsDelta: number;
    addPoints: (pts: number) => void;
    resetPointsDelta: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),

            theme: "dark",
            setTheme: (theme) => set({ theme }),

            pointsDelta: 0,
            addPoints: (pts) => set((s) => ({ pointsDelta: s.pointsDelta + pts })),
            resetPointsDelta: () => set({ pointsDelta: 0 }),
        }),
        {
            name: "btb-store",
            // Only persist theme preference — user session is in sessionStorage
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);
