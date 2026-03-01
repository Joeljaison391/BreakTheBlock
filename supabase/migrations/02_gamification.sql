-- Phase 18 Migration: Gamification — Point logs, Powerups, Level tracking

-- 1. Point Logs — tracks every point action for daily cap enforcement
CREATE TABLE IF NOT EXISTS point_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_point_logs_user_day 
ON point_logs (user_id, action, created_at);

ALTER TABLE point_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own point logs" ON point_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert point logs" ON point_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. User Powerups
CREATE TABLE IF NOT EXISTS user_powerups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    expires_at TIMESTAMP WITH TIME ZONE,
    used BOOLEAN DEFAULT false
);

ALTER TABLE user_powerups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own powerups" ON user_powerups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert powerups" ON user_powerups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own powerups" ON user_powerups FOR UPDATE USING (auth.uid() = user_id);

-- 3. Add level + last_login_date to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;
