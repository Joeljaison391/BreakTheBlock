"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Zap, Target, Users, TrendingUp, Brain, Flame,
    Shield, Trophy, ArrowRight, Sparkles, Heart,
    MessageSquare, ChevronDown
} from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
};

const features = [
    {
        icon: Target,
        title: "Hybrid Goals",
        desc: "Set 5 unique goal types — DailyHabit, CountTarget, MultiStep, ProofOnly, and Journal. Track anything from running streaks to reading challenges.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: Zap,
        title: "Friction Breaker AI",
        desc: "Feeling stuck? Our AI generates 3 tiny, dopamine-friendly micro-steps to get you moving when procrastination hits hardest.",
        color: "text-accent",
        bg: "bg-accent/10",
    },
    {
        icon: Trophy,
        title: "Gamified Leaderboards",
        desc: "Earn XP for real-world actions. Compete across Global, Regional, and Group leaderboards. Your effort becomes your rank.",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
    {
        icon: Users,
        title: "Group Factions",
        desc: "Create or join a faction. Attack the Global Stone together. Your group's combined momentum fuels collective progress.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        icon: Shield,
        title: "Proof-Based Verification",
        desc: "Upload image proof of your achievements. No honor system — real evidence, real points, real accountability.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
    },
    {
        icon: MessageSquare,
        title: "Community Feed",
        desc: "Share wins, celebrate others, and build momentum through a social feed that rewards action over consumption.",
        color: "text-pink-400",
        bg: "bg-pink-400/10",
    },
];

const psychologyPrinciples = [
    {
        emoji: "🧠",
        title: "Dopamine Redirection",
        desc: "We hijack the same reward loops that social media exploits — but redirect them toward meaningful real-world achievements.",
    },
    {
        emoji: "⚡",
        title: "Micro-Momentum",
        desc: "The hardest part is starting. Our Friction Breaker decomposes overwhelming goals into 3 laughably tiny steps to trigger action.",
    },
    {
        emoji: "🪨",
        title: "The Stasis Stone",
        desc: "A visual metaphor for collective inertia. Every user's action chips away at the stone. Together, we break through digital paralysis.",
    },
    {
        emoji: "🔥",
        title: "Streak Psychology",
        desc: "Loss aversion is powerful. Once you build a streak, the fear of breaking it becomes a stronger motivator than any notification.",
    },
];

const stats = [
    { value: "5", label: "Goal Types" },
    { value: "3", label: "AI Micro-Steps" },
    { value: "∞", label: "Potential" },
    { value: "1", label: "You" },
];

export default function LandingPage() {
    return (
        <main className="relative min-h-screen bg-background overflow-hidden">
            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/8 blur-[150px]" />
                <div className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/6 blur-[120px]" />
                <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/3 rounded-full bg-secondary/5 blur-[100px]" />
            </div>

            {/* ═══════════ HERO ═══════════ */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center gap-6 max-w-3xl"
                >
                    {/* Logo */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand shadow-glow-primary">
                        <svg viewBox="0 0 40 40" className="h-11 w-11 text-white" fill="currentColor">
                            <ellipse cx="20" cy="21" rx="17" ry="15" opacity="0.9" />
                            <path d="M14 12 L10 22 L20 28 L30 22 L26 12 Z" fill="rgba(255,255,255,0.12)" />
                            <path d="M20 8 L13 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Reverse-Engineer Your Dopamine
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]"
                        >
                            Break{" "}
                            <span className="gradient-text">the Block</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
                        >
                            Stop doomscrolling. Start doing. We gamify{" "}
                            <strong className="text-foreground">real-world action</strong> so your
                            dopamine works <em>for</em> you, not against you.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center gap-4 mt-4"
                    >
                        <Link
                            href="/login"
                            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-brand px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] hover:shadow-primary/40"
                        >
                            Start Breaking Blocks
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                        </Link>
                        <a
                            href="#psychology"
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Learn the science
                            <ChevronDown className="w-4 h-4 animate-bounce" />
                        </a>
                    </motion.div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-20 grid grid-cols-4 gap-8 sm:gap-16"
                >
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl sm:text-4xl font-black gradient-text">{s.value}</div>
                            <div className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════ THE PROBLEM ═══════════ */}
            <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="glass-card rounded-3xl p-8 sm:p-12 border border-border text-center"
                >
                    <motion.div variants={fadeUp} custom={0} className="text-6xl mb-6">🪨</motion.div>
                    <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                        You&apos;re Stuck in <span className="text-primary">Digital Stasis</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        Modern platforms are <strong className="text-foreground">engineered to trap you</strong> in endless passive consumption.
                        Hours vanish into doomscrolling. Goals stay as notes on your phone. The gap between intention and action grows wider every day.
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3} className="mt-8 p-6 bg-muted/30 rounded-2xl border border-border/50 max-w-lg mx-auto">
                        <p className="text-foreground font-medium italic text-lg">
                            &ldquo;What if the same dopamine loops that keep you scrolling could be
                            rewired to make you <span className="text-primary font-bold">unstoppable</span>?&rdquo;
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                        <Flame className="w-3.5 h-3.5" />
                        Core Features
                    </motion.div>
                    <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black tracking-tight">
                        Everything You Need to <span className="gradient-text">Break Through</span>
                    </motion.h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                            custom={i}
                            className="glass-card rounded-2xl p-6 border border-border group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <f.icon className={`w-6 h-6 ${f.color}`} />
                            </div>
                            <h3 className="text-lg font-black tracking-tight mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════ PSYCHOLOGY ═══════════ */}
            <section id="psychology" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                        <Brain className="w-3.5 h-3.5" />
                        The Science
                    </motion.div>
                    <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black tracking-tight">
                        Psychology Behind <span className="gradient-text">the Engine</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        This isn&apos;t another habit tracker. Every mechanic is grounded in behavioral psychology research.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {psychologyPrinciples.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                            custom={i}
                            className="glass-card rounded-2xl p-6 border border-border"
                        >
                            <div className="text-4xl mb-3">{p.emoji}</div>
                            <h3 className="text-lg font-black tracking-tight mb-2">{p.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-black tracking-tight">
                        How It <span className="gradient-text">Works</span>
                    </motion.h2>
                </motion.div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[3px] bg-border sm:-translate-x-1/2" />

                    {[
                        { step: "01", title: "Set a Hybrid Goal", desc: "Choose from 5 goal types. Daily habits, count targets, multi-step challenges — whatever matches your ambition.", icon: Target, color: "border-primary" },
                        { step: "02", title: "Take Action IRL", desc: "Go outside. Do the thing. Upload photo proof or log your progress. Real effort earns real points.", icon: Flame, color: "border-accent" },
                        { step: "03", title: "Earn & Compete", desc: "Watch your XP grow. Climb leaderboards. Your faction attacks the Global Stone. Every action counts.", icon: TrendingUp, color: "border-secondary" },
                        { step: "04", title: "Break the Block", desc: "The stone cracks. Your streak ignites. You've rewired your brain from passive to active. You're unstoppable.", icon: Sparkles, color: "border-primary" },
                    ].map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeUp}
                            custom={i}
                            className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} sm:text-${i % 2 === 0 ? "right" : "left"}`}
                        >
                            <div className="absolute left-8 sm:left-1/2 sm:-translate-x-1/2 -translate-x-1/2">
                                <div className={`w-10 h-10 rounded-full bg-card border-[3px] ${item.color} flex items-center justify-center z-10 relative`}>
                                    <item.icon className="w-4 h-4 text-foreground" />
                                </div>
                            </div>
                            <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-40px)] ${i % 2 === 0 ? "" : "sm:ml-auto"} glass-card rounded-2xl p-5 border border-border`}>
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Step {item.step}</div>
                                <h3 className="text-lg font-black tracking-tight mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════ COMMUNITY ═══════════ */}
            <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="glass-card rounded-3xl p-8 sm:p-12 border border-border text-center"
                >
                    <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-400/10 border border-pink-400/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Heart className="w-3.5 h-3.5" />
                        Community
                    </motion.div>
                    <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                        Built for People Who Are <span className="gradient-text">Tired of Being Stuck</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        This isn&apos;t a productivity cult. It&apos;s a community of real humans who understand that
                        <strong className="text-foreground"> the hardest part is starting</strong>. We celebrate small wins.
                        We hold each other accountable. We break through together.
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {[
                            { icon: Users, label: "Group Factions", desc: "Team up and compete together" },
                            { icon: MessageSquare, label: "Social Feed", desc: "Share wins and celebrate others" },
                            { icon: Trophy, label: "Leaderboards", desc: "Global, Regional, and Group ranks" },
                        ].map((c) => (
                            <div key={c.label} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                <c.icon className="w-5 h-5 text-primary mb-2 mx-auto" />
                                <div className="text-sm font-bold">{c.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════ CTA ═══════════ */}
            <section className="relative z-10 px-6 py-32 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-2xl mx-auto"
                >
                    <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
                        Ready to <span className="gradient-text">Break Through</span>?
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                        Your goals are waiting. Your dopamine is ready to be redirected.
                        The stone won&apos;t break itself.
                    </motion.p>
                    <motion.div variants={fadeUp} custom={2}>
                        <Link
                            href="/login"
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-brand px-10 py-5 text-lg font-black text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] hover:shadow-primary/40"
                        >
                            Get Started — It&apos;s Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="relative z-10 border-t border-border px-6 py-8">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                                <ellipse cx="12" cy="13" rx="10" ry="9" opacity="0.9" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold gradient-text">Break the Block</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Built with 🔥 for people who refuse to stay stuck.
                    </p>
                </div>
            </footer>
        </main>
    );
}
