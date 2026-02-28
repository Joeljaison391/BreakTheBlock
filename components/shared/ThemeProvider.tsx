"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeProvider — applies the saved theme class to <html> on mount.
 * Must be a Client Component because it reads from Zustand (localStorage).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", prefersDark);
            root.classList.toggle("light", !prefersDark);
        } else {
            root.classList.remove("dark", "light");
            root.classList.add(theme);
        }
    }, [theme]);

    return <>{children}</>;
}
