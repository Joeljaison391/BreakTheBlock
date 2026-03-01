"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface AnimatedStoneProps {
    progress: number; // 0 to 100
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    onClick?: () => void;
    showText?: boolean;
    colorOverride?: string;
}

const sizeMap = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
};

export function AnimatedStone({
    progress,
    size = "md",
    className,
    onClick,
    showText = false,
    colorOverride
}: AnimatedStoneProps) {
    const controls = useAnimation();

    // Confetti trigger when reaching 100
    useEffect(() => {
        if (progress >= 100) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff6b35', '#10b981', '#f59e0b']
            });
            controls.start("broken");
        } else if (progress > 0) {
            controls.start("cracking");
        } else {
            controls.start("intact");
        }
    }, [progress, controls]);

    const crackVariants = {
        intact: {
            scale: 1,
            filter: "brightness(1)",
            rotate: 0,
        },
        cracking: {
            scale: [1, 1.02, 0.98, 1.01, 1],
            filter: [
                "brightness(1)",
                "brightness(1.1)",
                "brightness(0.95)",
                "brightness(1.05)",
                "brightness(1)",
            ],
            transition: { duration: 0.4 },
        },
        broken: {
            scale: 1.05,
            filter: "brightness(1.2)",
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    // Complex crack SVG lines to reveal based on progress
    const crackLines = [
        "M50 15 L45 35 L60 55 L40 70 L55 85",
        "M25 40 L45 50 L35 75",
        "M75 35 L60 45 L70 65 L55 80",
        "M35 25 L50 40 L30 60",
        "M65 20 L50 35 L65 50",
    ];

    const crackOpacity = Math.min((progress / 100) * 1.5, 1);

    return (
        <div
            className={cn("relative flex items-center justify-center", sizeMap[size], className)}
            onClick={onClick}
            role={onClick ? "button" : "presentation"}
            tabIndex={onClick ? 0 : -1}
        >
            <motion.div
                variants={crackVariants}
                initial="intact"
                animate={controls}
                className="relative w-full h-full"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
                    <defs>
                        <radialGradient id="stoneGrad" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#4b5563" />
                            <stop offset="70%" stopColor="#1f2937" />
                            <stop offset="100%" stopColor="#111827" />
                        </radialGradient>
                        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={colorOverride || "#ff6b35"} stopOpacity={crackOpacity * 0.8} />
                            <stop offset="60%" stopColor={colorOverride || "#f59e0b"} stopOpacity={crackOpacity * 0.4} />
                            <stop offset="100%" stopColor={colorOverride || "#ff6b35"} stopOpacity="0" />
                        </radialGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Core Stone */}
                    <path
                        d="M 50 5 C 75 5 95 25 90 50 C 85 75 70 95 50 90 C 25 85 5 70 10 45 C 15 20 25 5 50 5 Z"
                        fill="url(#stoneGrad)"
                        stroke="#374151"
                        strokeWidth="1"
                    />

                    {/* Internal Glow revealing cracks */}
                    <path
                        d="M 50 5 C 75 5 95 25 90 50 C 85 75 70 95 50 90 C 25 85 5 70 10 45 C 15 20 25 5 50 5 Z"
                        fill="url(#glowGrad)"
                    />

                    {/* Texture marks */}
                    <circle cx="25" cy="35" r="3" fill="#374151" opacity="0.5" />
                    <circle cx="70" cy="65" r="4" fill="#374151" opacity="0.4" />
                    <circle cx="40" cy="75" r="2" fill="#374151" opacity="0.6" />
                    <path d="M 60 20 Q 65 25 60 30" stroke="#374151" fill="none" strokeWidth="1.5" opacity="0.6" />

                    {/* Highlight */}
                    <path d="M 30 15 Q 50 5 65 15" stroke="white" fill="none" strokeWidth="2" opacity="0.15" strokeLinecap="round" />

                    {/* Animated Cracks */}
                    {crackLines.map((d, i) => {
                        const crackThreshold = i * 20; // Stagger cracks
                        const pathProgress = Math.max(0, Math.min(1, (progress - crackThreshold) / 20));

                        return (
                            <motion.path
                                key={i}
                                d={d}
                                stroke={colorOverride || "#ff6b35"}
                                strokeWidth={1.5 + (pathProgress * 0.5)}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: pathProgress,
                                    opacity: pathProgress > 0 ? crackOpacity : 0,
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        );
                    })}
                </svg>
            </motion.div>

            {/* Optional Progress Overlay Text */}
            {showText && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white drop-shadow-md tracking-tighter mix-blend-overlay">
                        {progress}%
                    </span>
                    {progress >= 100 && (
                        <span className="text-xs font-bold text-accent drop-shadow whitespace-nowrap -mt-1 uppercase tracking-widest">
                            Cracked
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
