"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
    duration?: number;
    particleCount?: number;
    trigger?: boolean;
}

export function Confetti({ duration = 3000, particleCount = 200, trigger = true }: ConfettiProps) {
    useEffect(() => {
        if (!trigger) return;

        const end = Date.now() + duration;
        const colors = ["#ff6b35", "#10b981", "#f59e0b", "#ffffff"];

        (function frame() {
            confetti({
                particleCount: particleCount / (duration / 100), // distribute particles over time
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: particleCount / (duration / 100),
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, [duration, particleCount, trigger]);

    return null;
}
