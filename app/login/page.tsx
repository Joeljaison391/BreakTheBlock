"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, Target, Users, TrendingUp, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { login, signup } from "./actions";
import { useState } from "react";
import { toast } from "sonner";

const features = [
    { icon: Target, label: "Set Goals", desc: "Define what you want to break through" },
    { icon: Zap, label: "AI Steps", desc: "Get 3 tiny friction-breaker steps" },
    { icon: TrendingUp, label: "Earn Points", desc: "Track streaks and milestones" },
    { icon: Users, label: "Community", desc: "Accountability with others" },
];
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);

    const handleDemoLogin = async (demoId: number) => {
        const fd = new FormData();
        fd.set("email", `demo${demoId}@breaktheblock.com`);
        fd.set("password", "DemoUser123!");
        await handleSubmit(fd);
    };

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const result = isLogin ? await login(formData) : await signup(formData);

            // If signup succeeded, show the email confirmation message
            if (result && 'success' in result) {
                setSuccessMsg(result.success as string);
                toast.success(result.success as string);
                return;
            }

            if (result?.error) {
                setErrorMsg(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            // redirect() throws a NEXT_REDIRECT error — this is expected on login success
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <AnimatePresence>
                {showWelcomeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand" />
                            <h2 className="text-2xl font-black mb-3">Welcome, Judges & Visitors! 👋</h2>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                If you're just here to check out the platform, you don't need to use your real email. Feel free to use a temporary email service like <a href="https://temp-mail.org/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">TempMail</a> or <a href="https://10minutemail.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">10MinuteMail</a> to sign up.
                            </p>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-6">
                                <p className="text-xs font-medium text-primary-foreground/80">
                                    <span className="font-bold text-primary">Pro Tip:</span> We've also created 10 pre-populated demo accounts for judges. You can access them directly from the login screen!
                                </p>
                            </div>
                            <button
                                onClick={() => setShowWelcomeModal(false)}
                                className="w-full bg-foreground text-background font-bold py-3 rounded-xl hover:bg-foreground/90 transition-colors"
                            >
                                Got it, let's go!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-[100px]" />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-3 text-center"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow-primary">
                        <svg viewBox="0 0 40 40" className="h-9 w-9 text-white" fill="currentColor">
                            <ellipse cx="20" cy="21" rx="17" ry="15" opacity="0.9" />
                            <path d="M14 12 L10 22 L20 28 L30 22 L26 12 Z" fill="rgba(255,255,255,0.12)" />
                            <path d="M20 8 L13 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Break <span className="gradient-text">the Block</span></h1>
                        <p className="mt-1 text-sm text-muted-foreground">Smash goals. Earn points. No more excuses.</p>
                        <Link href="/landing" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                            Learn what this is about →
                        </Link>
                    </div>
                </motion.div>

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
                                <p className="text-xs font-bold">{f.label}</p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-card w-full rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
                >
                    {successMsg ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-4 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Check Your Email!</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                                    We&apos;ve sent a confirmation link to your email address. Click the link to activate your account and start breaking blocks!
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSuccessMsg("");
                                    setIsLogin(true);
                                }}
                                className="text-sm font-bold text-primary hover:underline mt-2"
                            >
                                ← Back to Login
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex bg-muted/50 p-1.5 rounded-2xl w-full">
                                {["Login", "Sign Up"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setIsLogin(tab === "Login");
                                            setErrorMsg("");
                                        }}
                                        className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${(isLogin && tab === "Login") || (!isLogin && tab === "Sign Up")
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <form action={handleSubmit} className="flex flex-col gap-4">
                                <AnimatePresence mode="popLayout">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex flex-col gap-1.5 overflow-hidden"
                                        >
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Display Name</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <input
                                                    name="name"
                                                    placeholder="Your gamertag"
                                                    required={!isLogin}
                                                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                {errorMsg && (
                                    <p className="text-sm font-medium text-red-500 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                        {errorMsg}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-brand px-5 py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    ) : (
                                        <>
                                            {isLogin ? "Sign In" : "Create Profile"}
                                            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                                        </>
                                    )}
                                </button>

                                {isLogin && (
                                    <div className="mt-2 pt-4 border-t border-border">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-3">Demo Accounts (For Judges)</p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => handleDemoLogin(num)}
                                                    disabled={isLoading}
                                                    className="flex items-center justify-center py-2 px-1 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-colors text-xs font-bold disabled:opacity-50 text-foreground/80 hover:text-foreground"
                                                    title={`Login as Demo User ${num}`}
                                                >
                                                    D{num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
