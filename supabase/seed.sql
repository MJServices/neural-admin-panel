
-- Insert into auth.users first to satisfy Foreign Key constraints
-- NOTE: This requires appropriate permissions in the Supabase SQL Editor.
-- If this fails, you must create users via the Supabase Authentication UI 
-- and then update the specific UUIDs in this script to match.

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'authenticated', 'authenticated', 'sarah@example.com', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'authenticated', 'authenticated', 'mike@example.com', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'authenticated', 'authenticated', 'emma@example.com', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 1. AI Models
INSERT INTO public.ai_models (id, name, personality_prompt, description)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Caring Guardian', 'You are a warm, protective AI...', 'A supportive presence.'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Strict Mentor', 'You are a disciplined, tough love AI...', 'Pushing you to be better.')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Users (public.users)
INSERT INTO public.users (id, email, full_name, avatar_url, member_since, conversations_count, bond_score, is_verified, level)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'sarah@example.com', 'Sarah Johnson', 'https://i.pravatar.cc/150?u=sarah', NOW() - INTERVAL '2 days', 5, 80, true, 2),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'mike@example.com', 'Mike Chen', 'https://i.pravatar.cc/150?u=mike', NOW() - INTERVAL '5 days', 12, 45, false, 1),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'emma@example.com', 'Emma Davis', 'https://i.pravatar.cc/150?u=emma', NOW() - INTERVAL '10 days', 25, 120, true, 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Profiles
INSERT INTO public.profiles (id, full_name, avatar_url, bond_score, xp, total_xp)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Sarah Johnson', 'https://i.pravatar.cc/150?u=sarah', 80, 500, 1200),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Mike Chen', 'https://i.pravatar.cc/150?u=mike', 45, 100, 300),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Emma Davis', 'https://i.pravatar.cc/150?u=emma', 120, 800, 2500)
ON CONFLICT (id) DO NOTHING;

-- 4. Messages
INSERT INTO public.messages (user_id, content, role, created_at)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Hi, how do I reset my password?', 'user', NOW() - INTERVAL '2 hours'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'You can do it from the settings page.', 'assistant', NOW() - INTERVAL '1 hour 59 minutes'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'I need help with the subscription.', 'user', NOW() - INTERVAL '1 day'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Great app!', 'user', NOW() - INTERVAL '30 minutes');

-- 5. XP Logs (Activity Feed)
INSERT INTO public.xp_logs (user_id, amount, source, created_at)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 50, 'Daily Login', NOW() - INTERVAL '1 hour'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 100, 'Completed Lesson', NOW() - INTERVAL '5 hours'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 200, 'Streak Bonus', NOW() - INTERVAL '20 minutes');
