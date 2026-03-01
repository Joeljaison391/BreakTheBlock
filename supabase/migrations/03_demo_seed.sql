-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ 
DECLARE
    pwd_hash text;
    v_user_id uuid;
    v_group_id text := '10000000-0000-0000-0000-000000000000';
    i int;
BEGIN
    pwd_hash := crypt('DemoUser123!', gen_salt('bf'));

    -- Create Demo Group
    INSERT INTO public.groups (id, name, region_id, member_count, stone_progress, invite_code)
    VALUES (
        v_group_id,
        'Global Demo Group',
        'north-america',
        10,
        75, -- 75% stone progress
        'DEMO123'
    ) ON CONFLICT (id) DO NOTHING;

    -- Create 10 Demo Users
    FOR i IN 1..10 LOOP
        v_user_id := ('d0000000-0000-0000-0000-0000000000' || LPAD(i::text, 2, '0'))::uuid;

        -- 1. Insert into auth.users (Bypass Auth API)
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            confirmation_token, email_change, email_change_token_new, recovery_token
        )
        VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo' || i || '@breaktheblock.com',
            pwd_hash,
            now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('name', 'Demo User ' || i),
            now(),
            now(),
            '', '', '', ''
        )
        ON CONFLICT (id) DO NOTHING;

        -- 2. Insert into auth.identities
        INSERT INTO auth.identities (
            id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
        )
        VALUES (
            gen_random_uuid(),
            v_user_id::text,
            v_user_id,
            jsonb_build_object('sub', v_user_id::text, 'email', 'demo' || i || '@breaktheblock.com'),
            'email',
            now(),
            now(),
            now()
        )
        ON CONFLICT DO NOTHING;

        -- 3. Insert into public.profiles
        INSERT INTO public.profiles (
            id, email, name, avatar_url, region_id, points, streak, is_admin, created_at
        )
        VALUES (
            v_user_id,
            'demo' || i || '@breaktheblock.com',
            'Demo User ' || i,
            'https://api.dicebear.com/9.x/avataaars/svg?seed=DemoUser' || i,
            'north-america',
            (11 - i) * 150 + 50, -- Staggered points for leaderboard (Demo 1 is highest)
            (11 - i) * 2,        -- Staggered streak
            (i = 1),             -- Demo 1 is admin
            now() - (i || ' days')::interval
        )
        ON CONFLICT (id) DO NOTHING;

        -- 4. Add to Group
        INSERT INTO public.group_members (
            group_id, user_id, joined_at
        )
        VALUES (
            v_group_id,
            v_user_id,
            now() - (i || ' days')::interval
        )
        ON CONFLICT (user_id) DO NOTHING;

        -- 5. Add a Template Goal
        INSERT INTO public.goals (
            user_id, title, description, type, tracking_config, progress, post_completion_proof_type
        )
        VALUES (
            v_user_id,
            'Demo Habit ' || i,
            'A generated daily habit to build consistency.',
            'DailyHabit',
            '{"startDate": "2026-03-01T00:00:00.000Z", "endDate": "2026-03-31T00:00:00.000Z"}',
            30,
            'image'
        )
        ON CONFLICT DO NOTHING;

        -- 6. Add some chat messages
        INSERT INTO public.chat_messages (
            group_id, user_id, text, created_at
        )
        VALUES (
            v_group_id,
            v_user_id,
            'Hello from Demo User ' || i || '! Ready to break some blocks.',
            now() - (10 - i || ' hours')::interval
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- 7. Update the Region Leaderboard stats to reflect the demo users
    UPDATE public.regions
    SET 
        member_count = member_count + 10,
        points = points + 8750, -- Sum of 1550+1400+1250+1100+950+800+650+500+350+200
        stone_progress = 75
    WHERE id = 'north-america';
    
END $$;
