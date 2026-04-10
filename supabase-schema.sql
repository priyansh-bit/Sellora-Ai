-- ==========================================
-- Supabase Schema for Sellora
-- ==========================================

-- 1. Create Logon Table (Users/Authentication details)
CREATE TABLE IF NOT EXISTS logon (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Subscription Table
CREATE TABLE IF NOT EXISTS subscription (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES logon(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Store Table
CREATE TABLE IF NOT EXISTS store (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES logon(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  domain TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Security: Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE logon ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE store ENABLE ROW LEVEL SECURITY;

-- Secure Policies (Production Ready)
-- Logon Table Policies
CREATE POLICY "Users can view own logon data" ON logon FOR SELECT USING (auth.uid() = id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert own logon data" ON logon FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own logon data" ON logon FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');

-- Subscription Table Policies
CREATE POLICY "Users can view own subscriptions" ON subscription FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert own subscriptions" ON subscription FOR INSERT WITH CHECK (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can update own subscriptions" ON subscription FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');

-- Store Table Policies
CREATE POLICY "Users can view own store" ON store FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert own store" ON store FOR INSERT WITH CHECK (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can update own store" ON store FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM logon WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Public can view store by domain" ON store FOR SELECT USING (true); -- Allow public to view store details for storefront

-- ==========================================
-- Enable Realtime for all tables
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE logon;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription;
ALTER PUBLICATION supabase_realtime ADD TABLE store;
