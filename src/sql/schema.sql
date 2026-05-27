-- CampusWhop Database Schema
-- Run this in Supabase SQL Editor (Part A then Part B)

-- ============================================
-- PART A: TABLES AND DATA
-- ============================================

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Universities table
CREATE TABLE universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbr TEXT NOT NULL,
  state TEXT NOT NULL,
  logo_url TEXT,
  student_count INTEGER DEFAULT 0,
  creator_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  university_id TEXT REFERENCES universities(id),
  department TEXT,
  level TEXT,
  is_creator BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  total_sales INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  university_id TEXT REFERENCES universities(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT NOT NULL DEFAULT 'Study Group',
  price INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  university_id TEXT REFERENCES universities(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_urls TEXT[],
  file_url TEXT,
  file_size TEXT,
  file_type TEXT,
  preview_url TEXT,
  sales_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  is_published BOOLEAN DEFAULT FALSE,
  university_id TEXT REFERENCES universities(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(user_id, creator_id)
);

-- Insert Nigerian universities
INSERT INTO universities (id, name, abbr, state) VALUES
  ('unilag', 'University of Lagos', 'UNILAG', 'Lagos'),
  ('ui', 'University of Ibadan', 'UI', 'Oyo'),
  ('oau', 'Obafemi Awolowo University', 'OAU', 'Osun'),
  ('uniben', 'University of Benin', 'UNIBEN', 'Edo'),
  ('unn', 'University of Nigeria, Nsukka', 'UNN', 'Enugu'),
  ('abu', 'Ahmadu Bello University', 'ABU', 'Kaduna'),
  ('unilorin', 'University of Ilorin', 'UNILORIN', 'Kwara'),
  ('lautech', 'Ladoke Akintola University', 'LAUTECH', 'Oyo'),
  ('futa', 'Federal University of Technology Akure', 'FUTA', 'Ondo'),
  ('covenant', 'Covenant University', 'CU', 'Ogun'),
  ('babcock', 'Babcock University', 'BU', 'Ogun'),
  ('unizik', 'Nnamdi Azikiwe University', 'UNIZIK', 'Anambra'),
  ('futo', 'Federal University of Technology Owerri', 'FUTO', 'Imo'),
  ('unical', 'University of Calabar', 'UNICAL', 'Cross River'),
  ('uniport', 'University of Port Harcourt', 'UNIPORT', 'Rivers'),
  ('biu', 'Benson Idahosa University', 'BIU', 'Edo'),
  ('eksu', 'Ekiti State University', 'EKSU', 'Ekiti'),
  ('tasued', 'Tai Solarin University', 'TASUED', 'Ogun'),
  ('run', 'Redeemer''s University', 'RUN', 'Osun'),
  ('aau', 'Ambrose Alli University', 'AAU', 'Edo'),
  ('funai', 'Federal University Ndufu-Alike Ikwo', 'FUNAI', 'Ebonyi');

-- ============================================
-- PART B: RLS POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Creators
CREATE POLICY "creators_select" ON creators FOR SELECT USING (true);
CREATE POLICY "creators_update" ON creators FOR UPDATE USING (profile_id = auth.uid());

-- Communities
CREATE POLICY "communities_select" ON communities FOR SELECT USING (true);
CREATE POLICY "communities_insert" ON communities FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM creators WHERE profile_id = auth.uid() AND id = creator_id));
CREATE POLICY "communities_update" ON communities FOR UPDATE USING (EXISTS (SELECT 1 FROM creators WHERE profile_id = auth.uid() AND id = creator_id));

-- Products
CREATE POLICY "products_select" ON products FOR SELECT USING (is_published = true OR EXISTS (SELECT 1 FROM creators WHERE profile_id = auth.uid() AND id = creator_id));
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM creators WHERE profile_id = auth.uid() AND id = creator_id));
CREATE POLICY "products_update" ON products FOR UPDATE USING (EXISTS (SELECT 1 FROM creators WHERE profile_id = auth.uid() AND id = creator_id));

-- Posts
CREATE POLICY "posts_select" ON posts FOR SELECT USING (EXISTS (SELECT 1 FROM memberships WHERE user_id = auth.uid() AND community_id = posts.community_id AND status = 'active') OR NOT EXISTS (SELECT 1 FROM communities WHERE id = posts.community_id AND is_paid = true));
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (author_id = auth.uid());

-- Comments
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (author_id = auth.uid());

-- Purchases
CREATE POLICY "purchases_select" ON purchases FOR SELECT USING (user_id = auth.uid());

-- Memberships
CREATE POLICY "memberships_select" ON memberships FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "memberships_insert" ON memberships FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reports
CREATE POLICY "reports_select" ON reports FOR SELECT USING (reporter_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "reports_update" ON reports FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Reviews
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (user_id = auth.uid());
