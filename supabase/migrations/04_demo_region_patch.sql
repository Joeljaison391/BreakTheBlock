-- 04_demo_region_patch.sql
-- Run this to update the region leaderboard stats after injecting demo users

UPDATE public.regions
SET 
    member_count = member_count + 10,
    points = points + 8750, -- Sum of 1550+1400+1250+1100+950+800+650+500+350+200
    stone_progress = 75
WHERE id = 'north-america';
