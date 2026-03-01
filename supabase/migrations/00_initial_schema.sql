-- Break the Block - Supabase Initial Schema & RLS Policies
-- This migration script creates the core tables matching the sophisticated `lib/mockData.ts` structures.
-- Run this in your Supabase SQL Editor.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------------
-- 1. PROFILES
-- Extended metadata tied directly to Supabase Auth Users
------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

------------------------------------------------------------------
-- 2. REGIONS & GROUPS (Leaderboard Infrastructure)
------------------------------------------------------------------
CREATE TABLE regions (
    id TEXT PRIMARY KEY, -- e.g., 'r1', 'r2'
    name TEXT NOT NULL,
    stone_progress INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE groups (
    id TEXT PRIMARY KEY, -- e.g., 'g1'
    name TEXT NOT NULL,
    region_id TEXT REFERENCES regions(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- The user who created the group
    invite_code TEXT UNIQUE,
    stone_progress INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Join table linking User Profiles to Groups
CREATE TABLE group_members (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (user_id, group_id)
);

------------------------------------------------------------------
-- 3. GOALS SYSTEM (The 5 Types: DailyHabit, CountTarget, MultiStep, ProofOnly, Journal)
------------------------------------------------------------------
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('DailyHabit', 'CountTarget', 'MultiStep', 'ProofOnly', 'Journal')),
    
    -- We store the flexible tracking configuraton in a robust JSONB column
    tracking_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    enable_logging BOOLEAN DEFAULT false,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    points_earned INTEGER DEFAULT 0,
    end_of_month TIMESTAMP WITH TIME ZONE,
    post_completion_proof_type TEXT CHECK (post_completion_proof_type IN ('image', 'link', 'blog', 'none')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- For journal entries or 'logs' attached to goals
CREATE TABLE goal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

------------------------------------------------------------------
-- 4. FEED PROOFS (Social Posts & Achievements)
------------------------------------------------------------------
CREATE TABLE proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL, -- The goal this proof belongs to
    
    image_url TEXT,
    before_image_url TEXT,
    text TEXT,
    link_url TEXT,
    
    likes INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proof_id UUID REFERENCES proofs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- This ensures users can only read/write data they are authorized to access.
------------------------------------------------------------------

-- 1. Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Regions & Groups
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regions are viewable by everyone" ON regions FOR SELECT USING (true);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Groups are viewable by everyone" ON groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update their groups" ON groups FOR UPDATE USING (auth.uid() = admin_id);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group Memberships are viewable by everyone" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);

-- 3. Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goals are private by default" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE goal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goal logs are private by default" ON goal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON goal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update logs" ON goal_logs FOR UPDATE USING (auth.uid() = user_id);

-- 4. Proofs & Comments (Social Feed)
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Proofs are public" ON proofs FOR SELECT USING (true);
CREATE POLICY "Users can insert proofs" ON proofs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own proofs" ON proofs FOR DELETE USING (auth.uid() = user_id);
-- Allow users to upvote proofs (Simplified to allow all authenticated updates for the demo, in PROD restrict this to specific columns)
CREATE POLICY "Authenticated users can upvote proofs" ON proofs FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are public" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

------------------------------------------------------------------
-- REALTIME TWEAKS
-- Enable realtime updates for feed components
------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE proofs;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE groups;
