"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Target, Users, TrendingUp } from "lucide-react";
import { setMockSession, MOCK_USER } from "@/lib/mock-auth";
import { useAppStore } from "@/store";

const features = [
    { icon: Target, label: "Set Goals", desc: "Define what you want to break through" },
    { icon: Zap, label: "AI Steps", desc: "Get 3 tiny friction-breaker steps" },
    { icon: TrendingUp, label: "Earn Points", desc: "Track streaks and milestones" },
    { icon: Users, label: "Community", desc: "Accountability with others" },
];

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAppStore();

    function handleMockLogin() {
        setMockSession(MOCK_USER);
        setUser(MOCK_USER);
        router.push("/dashboard");
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-secondary/10 blur-[100px]" />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-3"
                >
                    {/* Stone icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg glow-primary">
                        <svg viewBox="0 0 40 40" className="h-9 w-9 text-white" fill="currentColor">
                            <ellipse cx="20" cy="21" rx="17" ry="15" opacity="0.9" />
                            <path d="M14 12 L10 22 L20 28 L30 22 L26 12 Z" fill="rgba(255,255,255,0.12)" />
                            <path d="M20 8 L13 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M15 18 L28 24" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Break{" "}
                            <span className="gradient-text">the Block</span>
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Smash goals. Earn points. No more excuses.
                        </p>
                    </div>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-2 gap-3 w-full"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={f.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i + 0.3 }}
                            className="glass-card rounded-xl p-3 flex items-start gap-3"
                        >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                                <f.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">{f.label}</p>
                                <p className="text-xs text-muted-foreground">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Login card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-card w-full rounded-2xl p-6 flex flex-col gap-4"
                >
                    {/* Mock login button */}
                    <button
                        onClick={handleMockLogin}
                        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-orange-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-orange-400/90 hover:shadow-primary/40 hover:shadow-xl active:scale-[0.98]"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                    </button>

                    {/* Dev mock session notice */}
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                        <p className="text-center text-xs text-amber-400/80">
                            🛠️ <strong>Dev mode:</strong> Click the button above to enter with a mock session.
                            Real Google OAuth will be wired up later.
                        </p>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <span className="text-primary cursor-pointer hover:underline">Terms</span> and{" "}
                        <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                </motion.div>

                <p className="text-xs text-muted-foreground/50">v0.1.0 — scaffold</p>
            </div>
        </main>
    );
}
