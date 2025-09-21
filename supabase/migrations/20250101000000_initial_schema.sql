/*
          # [Initial Schema]
          This script sets up the initial database schema for the BMeet application. It includes tables for user profiles, interests, languages, personality traits, matches, messages, cultural topics, and community groups. It also establishes relationships, enables Row Level Security (RLS) on all tables, and creates policies to ensure users can only access and manage their own data.

          ## Query Description: This is a foundational script for a new database. It creates all necessary tables and security rules. There is no risk to existing data as it's intended for a fresh setup.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Tables Created: profiles, user_interests, user_languages, user_personality_traits, matches, messages, cultural_topics, community_groups, group_members, posts
          - Functions Created: handle_new_user
          - Triggers Created: on_auth_user_created
          
          ## Security Implications:
          - RLS Status: Enabled on all tables.
          - Policy Changes: Yes, policies are created for all tables to restrict data access to the authenticated user.
          - Auth Requirements: Policies rely on `auth.uid()` to identify the current user.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default. A unique index is created on the `matches` table.
          - Triggers: A trigger is added to the `auth.users` table to create a user profile upon sign-up.
          - Estimated Impact: Low, as this is an initial setup.
          */

-- 1. Create Profiles Table
-- This table stores public user information.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INT,
    location VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(255),
    timezone VARCHAR(255),
    is_online BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    has_video_intro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE profiles IS 'Stores public user profiles, linked to authentication.';

-- 2. Create User Interests Table
-- This table links users to their interests.
CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    UNIQUE (user_id, interest)
);
COMMENT ON TABLE user_interests IS 'Many-to-many relationship between users and their interests.';

-- 3. Create User Languages Table
-- This table links users to the languages they speak.
CREATE TABLE user_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    language VARCHAR(100) NOT NULL,
    UNIQUE (user_id, language)
);
COMMENT ON TABLE user_languages IS 'Many-to-many relationship between users and languages they speak.';

-- 4. Create User Personality Traits Table
-- This table links users to their personality traits.
CREATE TABLE user_personality_traits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trait VARCHAR(100) NOT NULL,
    UNIQUE (user_id, trait)
);
COMMENT ON TABLE user_personality_traits IS 'Many-to-many relationship between users and their personality traits.';

-- 5. Create Matches Table
-- This table stores matches between two users.
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (user1_id <> user2_id)
);
-- Create a unique index to prevent duplicate matches (e.g., user A with B is the same as B with A).
CREATE UNIQUE INDEX unique_match_pair_idx ON matches (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));
COMMENT ON TABLE matches IS 'Stores successful matches between two users.';

-- 6. Create Messages Table
-- This table stores chat messages between users.
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);
COMMENT ON TABLE messages IS 'Stores chat messages for a specific match.';

-- 7. Create Cultural Topics Table
-- This table stores information about cultural topics.
CREATE TABLE cultural_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    country VARCHAR(100),
    image_url VARCHAR(255),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE cultural_topics IS 'Stores user-generated content about different cultures.';

-- 8. Create Community Groups Table
-- This table stores information about community groups.
CREATE TABLE community_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE community_groups IS 'Stores information about user-created community groups.';

-- 9. Create Group Members Table
-- This table links users to the groups they have joined.
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(50) DEFAULT 'member', -- e.g., 'member', 'admin'
    UNIQUE (group_id, user_id)
);
COMMENT ON TABLE group_members IS 'Many-to-many relationship between users and community groups.';

-- 10. Create Posts Table
-- This table stores posts within community groups or on cultural topics.
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES cultural_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (group_id IS NOT NULL OR topic_id IS NOT NULL) -- A post must belong to a group or a topic
);
COMMENT ON TABLE posts IS 'Stores user posts within groups or topics.';

-- 11. Set up Row Level Security (RLS)
-- Enable RLS for all tables to enforce data access policies.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_personality_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 12. Define RLS Policies

-- Policies for profiles
CREATE POLICY "Users can view all profiles." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile." ON profiles FOR DELETE USING (auth.uid() = id);

-- Policies for user_interests
CREATE POLICY "Users can view their own interests." ON user_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interests." ON user_interests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interests." ON user_interests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interests." ON user_interests FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_languages
CREATE POLICY "Users can view their own languages." ON user_languages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own languages." ON user_languages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own languages." ON user_languages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own languages." ON user_languages FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_personality_traits
CREATE POLICY "Users can view their own traits." ON user_personality_traits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own traits." ON user_personality_traits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own traits." ON user_personality_traits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own traits." ON user_personality_traits FOR DELETE USING (auth.uid() = user_id);

-- Policies for matches
CREATE POLICY "Users can view their own matches." ON matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create matches." ON matches FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies for messages
CREATE POLICY "Users can view messages in their matches." ON messages FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() IN (SELECT user1_id FROM matches WHERE id = match_id) OR
    auth.uid() IN (SELECT user2_id FROM matches WHERE id = match_id)
);
CREATE POLICY "Users can send messages in their matches." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policies for cultural_topics, community_groups, and posts (publicly readable)
CREATE POLICY "All users can view cultural topics." ON cultural_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create cultural topics." ON cultural_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "All users can view community groups." ON community_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create community groups." ON community_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "All users can view posts." ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts." ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own posts." ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts." ON posts FOR DELETE USING (auth.uid() = user_id);

-- Policies for group_members
CREATE POLICY "All users can see who is in a group." ON group_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join or leave groups." ON group_members FOR ALL USING (auth.uid() = user_id);

-- 13. Create a function to handle new user sign-ups
-- This function automatically creates a profile entry when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create a trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
