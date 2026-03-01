// Types
export type GoalCategory = "fitness" | "learning" | "career" | "creativity" | "mindfulness" | "social" | "finance" | "personal";
export type GoalStatus = "active" | "completed" | "archived";

export interface MockUser {
    id: string;
    email?: string;
    name: string;
    avatar: string;
    points: number;
    geo: string;
    streak: number;
    badges: Badge[];
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export type GoalType = 'DailyHabit' | 'CountTarget' | 'MultiStep' | 'ProofOnly' | 'Journal';

export interface Goal {
    id: string;
    title: string;
    description?: string;
    type: GoalType;
    trackingConfig: {
        // DailyHabit
        startDate?: string;
        endDate?: string;
        completedDates?: string[];
        // CountTarget
        targetNumber?: number;
        currentNumber?: number;
        unit?: string;
        // MultiStep
        steps?: Array<{
            id: string;
            title: string;
            completed: boolean;
            proofUrl?: string;
        }>;
        // ProofOnly
        requiresProof?: boolean;
        // Journal
        minEntriesPerMonth?: number;
    };
    enableLogging: boolean;
    postCompletionProofType?: 'none' | 'image' | 'link' | 'blog';
    logs: Array<{ id: string; date: string; text: string }>;
    progress: number;
    pointsEarned: number;
    lastUpdated: string; // ISO date string
    endOfMonth: string;  // ISO date string
}

export interface Comment {
    id: string;
    text: string;
    user: {
        name: string;
        avatar: string;
    };
    timestamp: string;
}

export interface Proof {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    goalTitle: string;
    beforePhoto: string;
    afterPhoto: string;
    caption: string;
    points: number;
    upvotes: number;
    comments: Comment[];
    timestamp: string;
}

export interface ChatMessage {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    text?: string;
    image?: string;
    timestamp: string;
}

export interface GroupRank {
    id: string;
    name: string;
    points: number;
    stoneProgress: number; // 0 - 100
    memberCount: number;
    regionId: string;
    adminId?: string;
    inviteCode?: string;
}

export interface RegionRank {
    id: string;
    name: string;
    points: number;
    stoneProgress: number;
    memberCount: number;
}

export interface GlobalStats {
    groupStoneProgress: number; // 0 - 100
    totalMonthlyGoals: number;
    globalPointsThisMonth: number;
    groupMembers: number;
}

// Mock Data
export const currentUser: MockUser = {
    id: "u1",
    name: "Alex Dev",
    avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alex",
    points: 1250,
    geo: "San Francisco, CA",
    streak: 12,
    badges: [
        { id: "b1", name: "Early Bird", icon: "🌅", description: "Logged 5 proofs before 8 AM" },
        { id: "b2", name: "Stone Cracker", icon: "🪨", description: "Contributed to breaking 3 group stones" },
        { id: "b3", name: "Consistency King", icon: "👑", description: "10-day streak achieved" },
    ],
};

export interface GoalTemplate {
    id: string;
    title: string;
    description: string;
    type: GoalType;
    trackingConfig: any;
    postCompletionProofType?: 'none' | 'image' | 'link' | 'blog';
    creator: {
        name: string;
        avatar: string;
    };
    downloads: number;
}

export const goalTemplates: GoalTemplate[] = [
    {
        id: "t1",
        title: "75 Hard Challenge",
        description: "Two workouts a day, a gallon of water, and strict diet.",
        type: "DailyHabit",
        trackingConfig: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
            completedDates: []
        },
        postCompletionProofType: 'image',
        creator: { name: "Andy F.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Andy" },
        downloads: 12500
    },
    {
        id: "t2",
        title: "Read 12 Books",
        description: "One book per month for the entire year.",
        type: "CountTarget",
        trackingConfig: { targetNumber: 12, currentNumber: 0, unit: "books" },
        postCompletionProofType: 'none',
        creator: { name: "Sarah J.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Sarah" },
        downloads: 8400
    },
    {
        id: "t3",
        title: "First Marathon Training",
        description: "Milestones to get from couch to 42.2km.",
        type: "MultiStep",
        trackingConfig: {
            steps: [
                { id: "s1", title: "Run 5k without stopping", completed: false },
                { id: "s2", title: "Run 10k race", completed: false },
                { id: "s3", title: "Run Half Marathon", completed: false },
                { id: "s4", title: "Run Full Marathon", completed: false }
            ]
        },
        postCompletionProofType: 'image',
        creator: { name: "David K.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=David" },
        downloads: 3200
    }
];

export const globalStats: GlobalStats = {
    groupStoneProgress: 65,
    totalMonthlyGoals: 142,
    globalPointsThisMonth: 125400,
    groupMembers: 48,
};

export const myGoals: Goal[] = [
    {
        id: "g1",
        title: "Morning Routine",
        description: "Wake up early and stretch.",
        type: "DailyHabit",
        trackingConfig: {
            startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // started 4 days ago
            endDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(), // 30 days total
            completedDates: [
                new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            ],
        },
        enableLogging: true,
        postCompletionProofType: 'none',
        logs: [
            { id: "l1", date: new Date().toISOString(), text: "Felt great today!" }
        ],
        progress: 45,
        pointsEarned: 450,
        lastUpdated: new Date().toISOString(),
        endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    },
    {
        id: "g2",
        title: "Read 10 Books",
        description: "Read 10 non-fiction books this year.",
        type: "CountTarget",
        trackingConfig: {
            targetNumber: 10,
            currentNumber: 2,
            unit: "books"
        },
        enableLogging: false,
        postCompletionProofType: 'link',
        logs: [],
        progress: 20,
        pointsEarned: 100,
        lastUpdated: new Date().toISOString(),
        endOfMonth: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    },
    {
        id: "g3",
        title: "Build Startup MVP",
        description: "Launch the MVP for Break the Block.",
        type: "MultiStep",
        trackingConfig: {
            steps: [
                { id: "s1", title: "Design UI", completed: true },
                { id: "s2", title: "Implement Goals", completed: false },
                { id: "s3", title: "Launch on Product Hunt", completed: false }
            ]
        },
        enableLogging: true,
        postCompletionProofType: 'blog',
        logs: [],
        progress: 33,
        pointsEarned: 300,
        lastUpdated: new Date().toISOString(),
        endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    },
    {
        id: "g4",
        title: "Run a Marathon",
        description: "Complete the SF Marathon with proof.",
        type: "ProofOnly",
        trackingConfig: {
            requiresProof: true
        },
        enableLogging: false,
        postCompletionProofType: 'image',
        logs: [],
        progress: 0,
        pointsEarned: 0,
        lastUpdated: new Date().toISOString(),
        endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    },
    {
        id: "g5",
        title: "Daily Journal",
        description: "Write down 3 things I'm grateful for.",
        type: "Journal",
        trackingConfig: {
            minEntriesPerMonth: 30
        },
        enableLogging: true,
        postCompletionProofType: 'none',
        logs: [],
        progress: 10,
        pointsEarned: 50,
        lastUpdated: new Date().toISOString(),
        endOfMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    }
];

export const feedProofs: Proof[] = [
    {
        id: "p1",
        user: { name: "Sarah Jenkins", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Sarah" },
        goalTitle: "Deep Work Block",
        beforePhoto: "https://picsum.photos/id/20/400/300",
        afterPhoto: "https://picsum.photos/id/21/400/300",
        caption: "Finally finished the refactor I’ve been putting off! 🚀",
        points: 50,
        upvotes: 12,
        comments: [
            { id: "c1", text: "Nice work Sarah!", user: { name: "David K.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=David" }, timestamp: "5 mins ago" }
        ],
        timestamp: "10 mins ago",
    },
    {
        id: "p2",
        user: { name: "Mike T.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Mike" },
        goalTitle: "Gym Session",
        beforePhoto: "https://picsum.photos/id/40/400/300",
        afterPhoto: "https://picsum.photos/id/41/400/300",
        caption: "Leg day crushed. Barely walking. 🦵",
        points: 40,
        upvotes: 8,
        comments: [],
        timestamp: "1 hour ago",
    },
    {
        id: "p3",
        user: { name: "Alex Dev", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alex" },
        goalTitle: "100 Days of Code",
        beforePhoto: "https://picsum.photos/id/1/400/300",
        afterPhoto: "https://picsum.photos/id/2/400/300",
        caption: "Day 45: Built the frontend structure for the hackathon. 💻",
        points: 10,
        upvotes: 24,
        comments: [
            { id: "c2", text: "Looks amazing!", user: { name: "Priya P.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Priya" }, timestamp: "1 hour ago" },
            { id: "c3", text: "Keep it up bro", user: { name: "Mike T.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Mike" }, timestamp: "30 mins ago" }
        ],
        timestamp: "2 hours ago",
    },
];

export const globalRegions: RegionRank[] = [
    { id: "r1", name: "North America", points: 854000, stoneProgress: 72, memberCount: 1250 },
    { id: "r2", name: "Europe", points: 720500, stoneProgress: 60, memberCount: 940 },
    { id: "r3", name: "Asia Pacific", points: 645000, stoneProgress: 55, memberCount: 820 },
    { id: "r4", name: "South America", points: 310200, stoneProgress: 30, memberCount: 510 },
    { id: "r5", name: "Africa", points: 125000, stoneProgress: 15, memberCount: 150 },
];

export const regionGroups: GroupRank[] = [
    { id: "g1", name: "SF Hackers", points: 125400, stoneProgress: 80, memberCount: 48, regionId: "r1" },
    { id: "g2", name: "NY Builders", points: 98000, stoneProgress: 65, memberCount: 42, regionId: "r1" },
    { id: "g3", name: "Austin Tech", points: 75200, stoneProgress: 40, memberCount: 30, regionId: "r1" },
    { id: "g4", name: "Seattle Devs", points: 62000, stoneProgress: 35, memberCount: 25, regionId: "r1" },
    { id: "g5", name: "Denver Creatives", points: 45000, stoneProgress: 20, memberCount: 15, regionId: "r1" },
];

export const mockChats: ChatMessage[] = [
    { id: "m1", user: { name: "Priya P.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Priya" }, text: "Hey team! Who is cracking a stone today?", timestamp: "10:00 AM" },
    { id: "m2", user: { name: "David K.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=David" }, text: "Already did! Had a hard time starting the blog post but pushed through.", timestamp: "10:15 AM" },
    { id: "m3", user: { name: "Alex Dev", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alex" }, image: "https://picsum.photos/id/42/400/300", timestamp: "10:20 AM" },
    { id: "m4", user: { name: "Alex Dev", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alex" }, text: "Check out this new setup for the hackathon.", timestamp: "10:20 AM" },
];

export const topMembers = [
    { id: "1", name: "Priya P.", points: 3400, avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Priya" },
    { id: "2", name: "Alex Dev", points: 1250, avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alex" },
    { id: "3", name: "David K.", points: 980, avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=David" },
];
