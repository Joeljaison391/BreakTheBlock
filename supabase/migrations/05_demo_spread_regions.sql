-- 05_demo_spread_regions.sql
-- Spreads the 10 demo users evenly across all 6 regions and recalculates stats

DO $$ 
DECLARE
    i int;
    v_user_id uuid;
    v_region text;
    regions text[] := ARRAY['north-america', 'europe', 'asia-pacific', 'south-america', 'africa', 'oceania'];
BEGIN
    -- 1. Reset all regions to zero safely
    UPDATE public.regions
    SET 
        member_count = 0,
        points = 0,
        stone_progress = 0;

    -- 2. Loop through the 10 demo users and re-assign them
    FOR i IN 1..10 LOOP
        v_user_id := ('d0000000-0000-0000-0000-0000000000' || LPAD(i::text, 2, '0'))::uuid;
        v_region := regions[((i - 1) % 6) + 1]; -- Cycles through the 6 regions

        -- Update the user's profile with the new region
        UPDATE public.profiles
        SET region_id = v_region
        WHERE id = v_user_id;
        
        -- Add their points to the new region (calculating based on our original staggered formula)
        UPDATE public.regions
        SET 
            member_count = member_count + 1,
            points = points + ((11 - i) * 150 + 50),
            stone_progress = LEAST(stone_progress + 15, 100) -- Just capping visual progress at 100
        WHERE id = v_region;
    END LOOP;
END $$;
