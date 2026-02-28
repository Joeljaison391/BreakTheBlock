export type GoalCategory =
    | "fitness"
    | "learning"
    | "career"
    | "creativity"
    | "mindfulness"
    | "social"
    | "finance"
    | "personal";

export type GoalStatus = "active" | "completed" | "archived";

export interface Profile {
    id: string;
    username: string | null;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    total_points: number;
    streak_days: number;
    created_at: string;
    updated_at: string;
}

export interface Goal {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category: GoalCategory;
    status: GoalStatus;
    target_date: string | null;
    points: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface Proof {
    id: string;
    goal_id: string;
    user_id: string;
    note: string | null;
    photo_url: string | null;
    points: number;
    created_at: string;
}

export interface FrictionBreakerStep {
    id: string;
    text: string;
    completed: boolean;
}

export interface NavItem {
    label: string;
    href: string;
    icon: string;
}
