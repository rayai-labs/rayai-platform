BEGIN;

-- Load the pgTAP extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- No plan needed - tests will be counted automatically
SELECT no_plan();

-- Test 1: Check that profiles table exists
SELECT has_table('public', 'profiles', 'profiles table should exist');

-- Test 2: Check that RLS is enabled
SELECT ok(
    (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.profiles'::regclass),
    'RLS should be enabled on profiles table'
);

-- Test 3: Check that required columns exist
SELECT has_column('public', 'profiles', 'id', 'profiles should have id column');
SELECT has_column('public', 'profiles', 'email', 'profiles should have email column');
SELECT has_column('public', 'profiles', 'full_name', 'profiles should have full_name column');
SELECT has_column('public', 'profiles', 'avatar_url', 'profiles should have avatar_url column');
SELECT has_column('public', 'profiles', 'provider', 'profiles should have provider column');
SELECT has_column('public', 'profiles', 'provider_id', 'profiles should have provider_id column');

-- Test 4: Check that email is not null
SELECT col_not_null('public', 'profiles', 'email', 'email column should be NOT NULL');

-- Test 5: Setup test data for trigger tests
DO $$
DECLARE
    test_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Insert a test user into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        test_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'test@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        jsonb_build_object(
            'full_name', 'Test User',
            'avatar_url', 'https://example.com/avatar.jpg',
            'provider_id', 'google_12345'
        ),
        jsonb_build_object('provider', 'google'),
        NOW(),
        NOW(),
        '',
        ''
    );
END $$;

-- Test that profile was created by trigger
SELECT ok(
    EXISTS(SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001'),
    'Profile should be created when auth.users entry is created'
);

-- Test that profile data matches
SELECT is(
    (SELECT email FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001'),
    'test@example.com',
    'Profile email should match auth user email'
);

SELECT is(
    (SELECT full_name FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001'),
    'Test User',
    'Profile full_name should be extracted from raw_user_meta_data'
);

-- Test 6: Test handle_updated_at trigger is properly configured
-- Setup test user 2
DO $$
BEGIN
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'test2@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        jsonb_build_object('full_name', 'Test User 2'),
        jsonb_build_object('provider', 'google'),
        NOW(),
        NOW(),
        '',
        ''
    );
END $$;

-- Check that the trigger exists and is configured
SELECT ok(
    EXISTS(
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_profile_updated'
        AND tgrelid = 'public.profiles'::regclass
    ),
    'on_profile_updated trigger should exist on profiles table'
);

-- Test 7: Test handle_user_metadata_sync trigger syncs profile data
-- Setup test user 3
DO $$
BEGIN
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'test3@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        jsonb_build_object(
            'full_name', 'Original Name',
            'avatar_url', 'https://example.com/old.jpg'
        ),
        jsonb_build_object('provider', 'google'),
        NOW(),
        NOW(),
        '',
        ''
    );

    -- Update auth user metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object(
        'full_name', 'Updated Name',
        'avatar_url', 'https://example.com/new.jpg'
    )
    WHERE id = '00000000-0000-0000-0000-000000000003';
END $$;

-- Check that profile was synced
SELECT is(
    (SELECT full_name FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000003'),
    'Updated Name',
    'Profile full_name should sync when auth user metadata changes'
);

SELECT is(
    (SELECT avatar_url FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000003'),
    'https://example.com/new.jpg',
    'Profile avatar_url should sync when auth user metadata changes'
);

-- Finish the tests
SELECT * FROM finish();

ROLLBACK;
