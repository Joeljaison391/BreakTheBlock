"use client";

import { useAppStore } from "@/store";
import { useEffect } from "react";

export function useTheme() {
    const { theme, setTheme } = useAppStore();

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", prefersDark);
            root.classList.toggle("light", !prefersDark);
        } else {
            root.classList.toggle("dark", theme === "dark");
            root.classList.toggle("light", theme === "light");
        }
    }, [theme]);

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

    return { theme, setTheme, toggle };
}
