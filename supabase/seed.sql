-- Seed data for development/testing
-- This file is used to populate your local Supabase instance with test data

-- Insert test user into auth.users first
-- This user ID matches the stub auth user ID in api/app/middleware/auth.py
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password', gen_salt('bf')), -- Password is 'password' (not for production!)
  now(),
  now(),
  now(),
  '{"provider":"local"}',
  '{"full_name":"Test User","avatar_url":"https://example.com/avatar.jpg"}',
  false,
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- The trigger on auth.users will automatically create the profile record
