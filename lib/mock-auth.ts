/**
 * Mock Auth — Development Only
 *
 * Simulates a logged-in user session without hitting Supabase.
 * Replace with real Supabase auth when ready.
 */

export interface MockUser {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    streak_days: number;
    created_at: string;
}

export const MOCK_USER: MockUser = {
    id: "mock-user-001",
    email: "dev@breaktheblock.app",
    display_name: "Dev User",
    avatar_url: null,
    total_points: 420,
    streak_days: 7,
    created_at: new Date().toISOString(),
};

const SESSION_KEY = "btb_mock_session";

export function getMockSession(): MockUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as MockUser) : null;
    } catch {
        return null;
    }
}

export function setMockSession(user: MockUser): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearMockSession(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(SESSION_KEY);
}

export function isMockAuthEnabled(): boolean {
    return process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
}
