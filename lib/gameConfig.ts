// ═══════════════ BREAK THE BLOCK — GAME CONFIG ═══════════════
// All game rules in one place. No DB needed — pure static config.

// ── Point Distribution ──
export const POINT_RULES = {
    DAILY_LOGIN: { points: 10, dailyCap: 10, label: "Daily Login" },
    FRICTION_BREAKER: { points: 25, dailyCap: 75, label: "Friction Breaker" },
    PROOF_UPLOAD: { points: 15, dailyCap: 45, label: "Proof Upload" },
    GOAL_STEP: { points: 10, dailyCap: 100, label: "Goal Step" },
    GOAL_COMPLETE: { points: 50, dailyCap: null, label: "Goal Achieved" },
    RECEIVE_LIKE: { points: 2, dailyCap: 20, label: "Received a Like" },
    STREAK_BONUS: { points: 2, dailyCap: 30, label: "Streak Bonus", perStreak: true },
    JOURNAL_ENTRY: { points: 5, dailyCap: 15, label: "Journal Entry" },
} as const;

export type PointAction = keyof typeof POINT_RULES;

// ── Level System (20 Levels) ──
export interface LevelDef {
    level: number;
    xpRequired: number;
    title: string;
    unlocks?: string;
}

export const LEVELS: LevelDef[] = [
    { level: 1, xpRequired: 0, title: "Newbie" },
    { level: 2, xpRequired: 50, title: "Starter" },
    { level: 3, xpRequired: 150, title: "Mover", unlocks: "Chat" },
    { level: 4, xpRequired: 300, title: "Builder", unlocks: "Upvote / Like" },
    { level: 5, xpRequired: 500, title: "Breaker", unlocks: "Join Groups, Streak Shield" },
    { level: 6, xpRequired: 700, title: "Shaker" },
    { level: 7, xpRequired: 1000, title: "Crusher", unlocks: "Create Groups" },
    { level: 8, xpRequired: 1400, title: "Hammer" },
    { level: 9, xpRequired: 1800, title: "Striker" },
    { level: 10, xpRequired: 2500, title: "Warrior", unlocks: "Powerups" },
    { level: 11, xpRequired: 3200, title: "Champion" },
    { level: 12, xpRequired: 4000, title: "Titan" },
    { level: 13, xpRequired: 5000, title: "Apex" },
    { level: 14, xpRequired: 6000, title: "Dominator" },
    { level: 15, xpRequired: 7500, title: "Legend", unlocks: "2x Powerup" },
    { level: 16, xpRequired: 9000, title: "Mythic" },
    { level: 17, xpRequired: 10500, title: "Ascended" },
    { level: 18, xpRequired: 12000, title: "Immortal" },
    { level: 19, xpRequired: 13500, title: "Transcendent" },
    { level: 20, xpRequired: 15000, title: "Block Breaker", unlocks: "All unlocks" },
];

/** Get the level for a given XP total */
export function getLevel(xp: number): LevelDef {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
    }
    return LEVELS[0];
}

/** Get XP progress towards next level (0-100%) */
export function getLevelProgress(xp: number): { current: LevelDef; next: LevelDef | null; percent: number } {
    const current = getLevel(xp);
    const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
    const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;

    if (!next) return { current, next: null, percent: 100 };

    const range = next.xpRequired - current.xpRequired;
    const progress = xp - current.xpRequired;
    return { current, next, percent: Math.min(100, Math.round((progress / range) * 100)) };
}

// ── Feature Gating ──
export const FEATURE_LEVELS = {
    CHAT: 3,
    UPVOTE: 4,
    JOIN_GROUP: 5,
    CREATE_GROUP: 7,
    USE_POWERUPS: 10,
} as const;

export function canUseFeature(feature: keyof typeof FEATURE_LEVELS, userLevel: number): boolean {
    return userLevel >= FEATURE_LEVELS[feature];
}

// ── Powerups ──
export interface PowerupDef {
    id: string;
    name: string;
    description: string;
    effect: string;
    durationMinutes: number | null; // null = single use
    cost: number;
    minLevel: number;
    emoji: string;
}

export const POWERUPS: PowerupDef[] = [
    {
        id: "double_xp",
        name: "Double XP",
        description: "All points earned are doubled",
        effect: "2x multiplier on all point gains",
        durationMinutes: 60,
        cost: 100,
        minLevel: 10,
        emoji: "⚡",
    },
    {
        id: "streak_shield",
        name: "Streak Shield",
        description: "Protect your streak if you miss a day",
        effect: "Prevents streak reset for 1 missed day",
        durationMinutes: null,
        cost: 75,
        minLevel: 5,
        emoji: "🛡️",
    },
];

// ── Stone Formulas ──
export const STONE_CONFIG = {
    /** Points needed per group member to fill a group stone */
    GROUP_TARGET_PER_MEMBER: 500,
    /** Stone resets monthly */
    RESET_MONTHLY: true,
};
