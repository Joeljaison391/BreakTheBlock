-- Phase 17 Migration: Chat, Region assignment, Group rules
-- Run this in your Supabase SQL Editor AFTER 00_initial_schema.sql

-- 1. Add region_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS region_id TEXT REFERENCES regions(id) ON DELETE SET NULL;

-- 2. Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat messages are viewable by group members" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime on chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- 3. Enforce ONE group per user (unique constraint)
-- This prevents a user from being in multiple groups simultaneously
CREATE UNIQUE INDEX IF NOT EXISTS group_members_user_unique ON group_members(user_id);

-- 4. Seed default regions (idempotent with ON CONFLICT)
INSERT INTO regions (id, name, stone_progress, member_count, points) VALUES
    ('north-america', 'North America', 0, 0, 0),
    ('europe', 'Europe', 0, 0, 0),
    ('asia-pacific', 'Asia Pacific', 0, 0, 0),
    ('south-america', 'South America', 0, 0, 0),
    ('africa', 'Africa', 0, 0, 0),
    ('oceania', 'Oceania', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
