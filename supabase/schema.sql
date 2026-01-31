-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Create enum type for subscription_tier if it doesn't exist
DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.achievements (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  xp_reward integer DEFAULT 100,
  icon_key text,
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.ai_models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  personality_prompt text NOT NULL,
  bonding_multiplier double precision DEFAULT 1.0,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ai_models_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  cover_image text,
  author_id uuid,
  status text DEFAULT 'draft'::text,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  tags text[] DEFAULT ARRAY[]::text[],
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id)
);
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_name text,
  admin_email text,
  time_zone text,
  language text,
  bot_name text,
  bot_model text,
  bot_temperature float,
  system_prompt text,
  openai_api_key text,
  webhook_url text,
  two_factor_enabled boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title text NOT NULL,
  description text,
  content text,
  category text,
  level text,
  duration_min integer DEFAULT 15,
  xp_reward integer DEFAULT 100,
  icon_key text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE IF NOT EXISTS public.missions (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  xp_reward integer DEFAULT 100,
  target_value integer NOT NULL,
  mission_type text NOT NULL CHECK (mission_type = ANY (ARRAY['message_count'::text, 'xp_earned'::text, 'streak'::text])),
  icon_key text DEFAULT 'star'::text,
  CONSTRAINT missions_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  selected_model_id uuid,
  updated_at timestamp with time zone,
  age integer,
  location text,
  bio text,
  member_since timestamp with time zone DEFAULT timezone('utc'::text, now()),
  conversations_count integer DEFAULT 0,
  days_active integer DEFAULT 0,
  level integer DEFAULT 1,
  bond_score integer DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  current_streak integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  last_streak_date date,
  last_weekly_bonus_claimed_at timestamp with time zone,
  streak integer DEFAULT 0,
  settings jsonb DEFAULT '{"theme": "dark", "privacy": {"show_activity": true, "profile_visibility": "public"}, "notifications": {"push": true, "email": true, "marketing": false}}'::jsonb,
  xp integer DEFAULT 0,
  last_reward_claim timestamp with time zone,
  subscription_tier subscription_tier DEFAULT 'free'::subscription_tier,
  daily_image_count integer DEFAULT 0,
  daily_video_count integer DEFAULT 0,
  last_usage_reset timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_selected_model_id_fkey FOREIGN KEY (selected_model_id) REFERENCES public.ai_models(id)
);
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  status text DEFAULT 'active'::text,
  source text DEFAULT 'Newsletter'::text,
  subscribed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id text NOT NULL,
  user_id uuid NOT NULL,
  status text,
  price_id text,
  cancel_at_period_end boolean DEFAULT false,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id uuid NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (user_id, achievement_id),
  CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);
CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  enrolled_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_course_enrollments_pkey PRIMARY KEY (user_id, course_id),
  CONSTRAINT user_course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE IF NOT EXISTS public.user_course_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  progress integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  last_accessed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_course_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
  user_id uuid NOT NULL,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  xp_earned integer DEFAULT 0,
  message_count integer DEFAULT 0,
  CONSTRAINT user_daily_activity_pkey PRIMARY KEY (user_id, activity_date),
  CONSTRAINT user_daily_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  lesson_id uuid,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  CONSTRAINT user_lesson_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE IF NOT EXISTS public.user_missions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  mission_id text,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  claimed boolean DEFAULT false,
  mission_date date DEFAULT CURRENT_DATE,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_missions_pkey PRIMARY KEY (id),
  CONSTRAINT user_missions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_missions_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES public.missions(id)
);
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid NOT NULL,
  selected_personality_id text DEFAULT 'caring-guardian'::text,
  relationship_type text DEFAULT 'switch'::text,
  safe_mode boolean DEFAULT true,
  couple_mode boolean DEFAULT false,
  theme text DEFAULT 'dark'::text,
  language text DEFAULT 'en'::text,
  notifications_enabled boolean DEFAULT true,
  preferred_role text DEFAULT 'switch'::text,
  CONSTRAINT user_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  age integer,
  location text DEFAULT 'Global'::text,
  member_since timestamp with time zone DEFAULT now(),
  is_verified boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  level integer DEFAULT 1,
  bond_score integer DEFAULT 0,
  bio text,
  is_adult boolean DEFAULT false,
  conversations_count integer DEFAULT 0,
  days_active integer DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE IF NOT EXISTS public.xp_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  source text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT xp_logs_pkey PRIMARY KEY (id),
  CONSTRAINT xp_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_name text,
  admin_email text,
  time_zone text,
  language text,
  bot_name text,
  bot_model text,
  bot_temperature float,
  system_prompt text,
  openai_api_key text,
  webhook_url text,
  two_factor_enabled boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_settings_pkey PRIMARY KEY (id)
);

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

