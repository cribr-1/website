-- CRIBR Safe Projects Unification Database Schema Setup
-- Idempotent, RLS-hardened, and index-optimized schema configurations.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'explorer' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role constraint validation checks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_role'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT check_valid_role CHECK (
            role IN ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive', 'builder_partner', 'explorer')
        );
    END IF;
END $$;

-- 2. Projects Table (Master Listings Source of Truth)
CREATE TABLE IF NOT EXISTS public.projects (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rera_number VARCHAR(100) UNIQUE,
    builder_id VARCHAR(64), 
    city VARCHAR(255),
    location TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    possession_date TEXT,
    construction_progress INTEGER CHECK (construction_progress BETWEEN 0 AND 100),
    min_price_lakhs NUMERIC(10, 2),
    max_price_lakhs NUMERIC(10, 2),
    price_per_sqft NUMERIC(10, 2),
    price_range VARCHAR(255),
    total_units INTEGER,
    commute_score NUMERIC(5, 2),
    builder_grade VARCHAR(50),
    google_rating NUMERIC(3, 2),
    reviews_count INTEGER,
    complaints_count INTEGER,
    cribr_score INTEGER,
    ai_verdict TEXT,
    amenities TEXT[],
    pros TEXT[],
    cons TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id VARCHAR(64) REFERENCES public.projects(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    builder_name VARCHAR(255),
    location TEXT,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Saved Properties Table
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id VARCHAR(64) REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    developer VARCHAR(255),
    city VARCHAR(255),
    overall_score INTEGER,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- 5. AI Reports Table
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id VARCHAR(255) PRIMARY KEY,
    query TEXT NOT NULL,
    report_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    rera_progress BOOLEAN DEFAULT FALSE,
    price_drops BOOLEAN DEFAULT FALSE,
    legal_updates BOOLEAN DEFAULT FALSE,
    noise_fluctuation BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_name)
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cribr Chats Table
CREATE TABLE IF NOT EXISTS public.cribr_chats (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes configuration
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_cribr_chats_user ON public.cribr_chats(user_id);

-- RLS Enforcement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cribr_chats ENABLE ROW LEVEL SECURITY;

-- Non-recursive Security Definer role resolver
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(user_role, 'explorer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Safe trigger for profiles creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Cribr Explorer'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
    'explorer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Triggers configuration
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END $$;

-- Policy creation blocks
DO $$
BEGIN
    -- 1. Profiles Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles select policy') THEN
        CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager', 'support_executive'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles insert policy') THEN
        CREATE POLICY "Profiles insert policy" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles update policy') THEN
        CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.get_my_role() IN ('super_admin', 'admin'));
    END IF;

    -- 2. Projects Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Projects select policy') THEN
        CREATE POLICY "Projects select policy" ON public.projects FOR SELECT USING (
            (status = 'published'::text) OR 
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive') OR
            (auth.uid()::text = builder_id)
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Projects modification policy') THEN
        CREATE POLICY "Projects modification policy" ON public.projects FOR ALL USING (
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager') OR
            (public.get_my_role() = 'builder_partner' AND auth.uid()::text = builder_id)
        );
    END IF;

    -- 3. Bookings Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Bookings select policy') THEN
        CREATE POLICY "Bookings select policy" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager', 'support_executive'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Bookings insert policy') THEN
        CREATE POLICY "Bookings insert policy" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Bookings update policy') THEN
        CREATE POLICY "Bookings update policy" ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager'));
    END IF;

    -- 4. Saved Properties Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Saved properties select policy') THEN
        CREATE POLICY "Saved properties select policy" ON public.saved_properties FOR SELECT USING (auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Saved properties insert policy') THEN
        CREATE POLICY "Saved properties insert policy" ON public.saved_properties FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Saved properties delete policy') THEN
        CREATE POLICY "Saved properties delete policy" ON public.saved_properties FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- 5. AI Reports Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'AI Reports authenticated select') THEN
        CREATE POLICY "AI Reports authenticated select" ON public.ai_reports FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'AI Reports authenticated insert') THEN
        CREATE POLICY "AI Reports authenticated insert" ON public.ai_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'AI Reports admin modification') THEN
        CREATE POLICY "AI Reports admin modification" ON public.ai_reports FOR ALL USING (public.get_my_role() IN ('super_admin', 'admin'));
    END IF;

    -- 6. Notifications Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Notifications select policy') THEN
        CREATE POLICY "Notifications select policy" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Notifications insert policy') THEN
        CREATE POLICY "Notifications insert policy" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Notifications update policy') THEN
        CREATE POLICY "Notifications update policy" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Notifications delete policy') THEN
        CREATE POLICY "Notifications delete policy" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- 7. Audit Logs Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Audit logs select policy') THEN
        CREATE POLICY "Audit logs select policy" ON public.audit_logs FOR SELECT USING (public.get_my_role() IN ('super_admin', 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Audit logs insert policy') THEN
        CREATE POLICY "Audit logs insert policy" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
    END IF;

    -- 8. Chats Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Chats select policy') THEN
        CREATE POLICY "Chats select policy" ON public.cribr_chats FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Chats insert policy') THEN
        CREATE POLICY "Chats insert policy" ON public.cribr_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Chats update policy') THEN
        CREATE POLICY "Chats update policy" ON public.cribr_chats FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Chats delete policy') THEN
        CREATE POLICY "Chats delete policy" ON public.cribr_chats FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
