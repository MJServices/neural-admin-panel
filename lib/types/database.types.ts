export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            admin_settings: {
                Row: {
                    id: string
                    organization_name: string | null
                    admin_email: string | null
                    time_zone: string | null
                    language: string | null
                    bot_name: string | null
                    bot_model: string | null
                    bot_temperature: number | null
                    system_prompt: string | null
                    openai_api_key: string | null
                    webhook_url: string | null
                    two_factor_enabled: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    organization_name?: string | null
                    admin_email?: string | null
                    time_zone?: string | null
                    language?: string | null
                    bot_name?: string | null
                    bot_model?: string | null
                    bot_temperature?: number | null
                    system_prompt?: string | null
                    openai_api_key?: string | null
                    webhook_url?: string | null
                    two_factor_enabled?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    organization_name?: string | null
                    admin_email?: string | null
                    time_zone?: string | null
                    language?: string | null
                    bot_name?: string | null
                    bot_model?: string | null
                    bot_temperature?: number | null
                    system_prompt?: string | null
                    openai_api_key?: string | null
                    webhook_url?: string | null
                    two_factor_enabled?: boolean | null
                    updated_at?: string | null
                }
            }
            achievements: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    xp_reward: number
                    icon_key: string | null
                }
                Insert: {
                    id: string
                    title: string
                    description?: string | null
                    xp_reward?: number
                    icon_key?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    xp_reward?: number
                    icon_key?: string | null
                }
            }
            ai_models: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    personality_prompt: string
                    bonding_multiplier: number
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    personality_prompt: string
                    bonding_multiplier?: number
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    personality_prompt?: string
                    bonding_multiplier?: number
                    image_url?: string | null
                    created_at?: string
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string | null
                    excerpt: string | null
                    cover_image: string | null
                    author_id: string | null
                    status: string | null
                    published_at: string | null
                    created_at: string | null
                    updated_at: string | null
                    tags: string[] | null
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    content?: string | null
                    excerpt?: string | null
                    cover_image?: string | null
                    author_id?: string | null
                    status?: string | null
                    published_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    tags?: string[] | null
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string | null
                    excerpt?: string | null
                    cover_image?: string | null
                    author_id?: string | null
                    status?: string | null
                    published_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    tags?: string[] | null
                }
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: string | null
                    level: string | null
                    icon_key: string | null
                    total_xp: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    category?: string | null
                    level?: string | null
                    icon_key?: string | null
                    total_xp?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    category?: string | null
                    level?: string | null
                    icon_key?: string | null
                    total_xp?: number | null
                    created_at?: string | null
                }
            }
            lessons: {
                Row: {
                    id: string
                    course_id: string | null
                    title: string
                    description: string | null
                    content: string | null
                    category: string | null
                    level: string | null
                    duration_min: number | null
                    xp_reward: number | null
                    icon_key: string | null
                    order_index: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    course_id?: string | null
                    title: string
                    description?: string | null
                    content?: string | null
                    category?: string | null
                    level?: string | null
                    duration_min?: number | null
                    xp_reward?: number | null
                    icon_key?: string | null
                    order_index?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    course_id?: string | null
                    title?: string
                    description?: string | null
                    content?: string | null
                    category?: string | null
                    level?: string | null
                    duration_min?: number | null
                    xp_reward?: number | null
                    icon_key?: string | null
                    order_index?: number | null
                    created_at?: string | null
                }
            }
            messages: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    role: 'user' | 'assistant'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    role: 'user' | 'assistant'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    role?: 'user' | 'assistant'
                    created_at?: string
                }
            }
            missions: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    xp_reward: number | null
                    target_value: number
                    mission_type: 'message_count' | 'xp_earned' | 'streak'
                    icon_key: string | null
                }
                Insert: {
                    id: string
                    title: string
                    description?: string | null
                    xp_reward?: number | null
                    target_value: number
                    mission_type: 'message_count' | 'xp_earned' | 'streak'
                    icon_key?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    xp_reward?: number | null
                    target_value?: number
                    mission_type?: 'message_count' | 'xp_earned' | 'streak'
                    icon_key?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    selected_model_id: string | null
                    updated_at: string | null
                    age: number | null
                    location: string | null
                    bio: string | null
                    member_since: string | null
                    conversations_count: number | null
                    days_active: number | null
                    level: number | null
                    bond_score: number | null
                    last_active_at: string | null
                    current_streak: number | null
                    total_xp: number | null
                    last_streak_date: string | null
                    last_weekly_bonus_claimed_at: string | null
                    streak: number | null
                    settings: Json | null
                    xp: number | null
                    last_reward_claim: string | null
                    subscription_tier: string | null // Using string instead of 'free' | enum for now
                    daily_image_count: number | null
                    daily_video_count: number | null
                    last_usage_reset: string | null
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    selected_model_id?: string | null
                    updated_at?: string | null
                    age?: number | null
                    location?: string | null
                    bio?: string | null
                    member_since?: string | null
                    conversations_count?: number | null
                    days_active?: number | null
                    level?: number | null
                    bond_score?: number | null
                    last_active_at?: string | null
                    current_streak?: number | null
                    total_xp?: number | null
                    last_streak_date?: string | null
                    last_weekly_bonus_claimed_at?: string | null
                    streak?: number | null
                    settings?: Json | null
                    xp?: number | null
                    last_reward_claim?: string | null
                    subscription_tier?: string | null
                    daily_image_count?: number | null
                    daily_video_count?: number | null
                    last_usage_reset?: string | null
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    selected_model_id?: string | null
                    updated_at?: string | null
                    age?: number | null
                    location?: string | null
                    bio?: string | null
                    member_since?: string | null
                    conversations_count?: number | null
                    days_active?: number | null
                    level?: number | null
                    bond_score?: number | null
                    last_active_at?: string | null
                    current_streak?: number | null
                    total_xp?: number | null
                    last_streak_date?: string | null
                    last_weekly_bonus_claimed_at?: string | null
                    streak?: number | null
                    settings?: Json | null
                    xp?: number | null
                    last_reward_claim?: string | null
                    subscription_tier?: string | null
                    daily_image_count?: number | null
                    daily_video_count?: number | null
                    last_usage_reset?: string | null
                }
            }
            subscribers: {
                Row: {
                    id: string
                    email: string
                    status: string | null
                    source: string | null
                    subscribed_at: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    email: string
                    status?: string | null
                    source?: string | null
                    subscribed_at?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    status?: string | null
                    source?: string | null
                    subscribed_at?: string | null
                    created_at?: string | null
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    status: string | null
                    price_id: string | null
                    cancel_at_period_end: boolean | null
                    current_period_end: string | null
                    created_at: string | null
                }
                Insert: {
                    id: string
                    user_id: string
                    status?: string | null
                    price_id?: string | null
                    cancel_at_period_end?: boolean | null
                    current_period_end?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: string | null
                    price_id?: string | null
                    cancel_at_period_end?: boolean | null
                    current_period_end?: string | null
                    created_at?: string | null
                }
            }
            user_achievements: {
                Row: {
                    user_id: string
                    achievement_id: string
                    unlocked_at: string | null
                }
                Insert: {
                    user_id: string
                    achievement_id: string
                    unlocked_at?: string | null
                }
                Update: {
                    user_id?: string
                    achievement_id?: string
                    unlocked_at?: string | null
                }
            }
            user_course_enrollments: {
                Row: {
                    user_id: string
                    course_id: string
                    enrolled_at: string | null
                }
                Insert: {
                    user_id: string
                    course_id: string
                    enrolled_at?: string | null
                }
                Update: {
                    user_id?: string
                    course_id?: string
                    enrolled_at?: string | null
                }
            }
            user_course_progress: {
                Row: {
                    id: string
                    user_id: string | null
                    course_id: string | null
                    progress: number | null
                    is_completed: boolean | null
                    last_accessed_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    course_id?: string | null
                    progress?: number | null
                    is_completed?: boolean | null
                    last_accessed_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    course_id?: string | null
                    progress?: number | null
                    is_completed?: boolean | null
                    last_accessed_at?: string | null
                }
            }
            user_daily_activity: {
                Row: {
                    user_id: string
                    activity_date: string
                    xp_earned: number | null
                    message_count: number | null
                }
                Insert: {
                    user_id: string
                    activity_date?: string
                    xp_earned?: number | null
                    message_count?: number | null
                }
                Update: {
                    user_id?: string
                    activity_date?: string
                    xp_earned?: number | null
                    message_count?: number | null
                }
            }
            user_lesson_progress: {
                Row: {
                    id: string
                    user_id: string | null
                    lesson_id: string | null
                    completed: boolean | null
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    lesson_id?: string | null
                    completed?: boolean | null
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    lesson_id?: string | null
                    completed?: boolean | null
                    completed_at?: string | null
                }
            }
            user_missions: {
                Row: {
                    id: string
                    user_id: string | null
                    mission_id: string | null
                    progress: number | null
                    completed: boolean | null
                    claimed: boolean | null
                    mission_date: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    mission_id?: string | null
                    progress?: number | null
                    completed?: boolean | null
                    claimed?: boolean | null
                    mission_date?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    mission_id?: string | null
                    progress?: number | null
                    completed?: boolean | null
                    claimed?: boolean | null
                    mission_date?: string | null
                    updated_at?: string | null
                }
            }
            user_settings: {
                Row: {
                    user_id: string
                    selected_personality_id: string | null
                    relationship_type: string | null
                    safe_mode: boolean | null
                    couple_mode: boolean | null
                    theme: string | null
                    language: string | null
                    notifications_enabled: boolean | null
                    preferred_role: string | null
                }
                Insert: {
                    user_id: string
                    selected_personality_id?: string | null
                    relationship_type?: string | null
                    safe_mode?: boolean | null
                    couple_mode?: boolean | null
                    theme?: string | null
                    language?: string | null
                    notifications_enabled?: boolean | null
                    preferred_role?: string | null
                }
                Update: {
                    user_id?: string
                    selected_personality_id?: string | null
                    relationship_type?: string | null
                    safe_mode?: boolean | null
                    couple_mode?: boolean | null
                    theme?: string | null
                    language?: string | null
                    notifications_enabled?: boolean | null
                    preferred_role?: string | null
                }
            }
            users: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    age: number | null
                    location: string | null
                    member_since: string | null
                    is_verified: boolean | null
                    is_premium: boolean | null
                    level: number | null
                    bond_score: number | null
                    bio: string | null
                    is_adult: boolean | null
                    conversations_count: number | null
                    days_active: number | null
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    age?: number | null
                    location?: string | null
                    member_since?: string | null
                    is_verified?: boolean | null
                    is_premium?: boolean | null
                    level?: number | null
                    bond_score?: number | null
                    bio?: string | null
                    is_adult?: boolean | null
                    conversations_count?: number | null
                    days_active?: number | null
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    age?: number | null
                    location?: string | null
                    member_since?: string | null
                    is_verified?: boolean | null
                    is_premium?: boolean | null
                    level?: number | null
                    bond_score?: number | null
                    bio?: string | null
                    is_adult?: boolean | null
                    conversations_count?: number | null
                    days_active?: number | null
                }
            }
            xp_logs: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    source: string
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    source: string
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    source?: string
                    metadata?: Json | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
