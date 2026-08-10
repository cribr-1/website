-- CRIBR Production Database Completion Migration
-- Adds enquiries, search_queries, project_views, and comparisons tables with RLS and Indexes.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enquiries / Leads Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    user_phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Search Queries Telemetry Table
CREATE TABLE IF NOT EXISTS public.search_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query_text TEXT NOT NULL,
    normalized_query TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    intent JSONB DEFAULT '{}'::jsonb,
    results_count INTEGER DEFAULT 0 NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Views Telemetry Table
CREATE TABLE IF NOT EXISTS public.project_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Property Comparisons Telemetry Table
CREATE TABLE IF NOT EXISTS public.comparisons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_ids TEXT[] NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    compared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes configuration
CREATE INDEX IF NOT EXISTS idx_enquiries_project ON public.enquiries(project_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_user ON public.enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

CREATE INDEX IF NOT EXISTS idx_search_queries_normalized ON public.search_queries(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_queries_results ON public.search_queries(results_count);
CREATE INDEX IF NOT EXISTS idx_search_queries_searched_at ON public.search_queries(searched_at);

CREATE INDEX IF NOT EXISTS idx_project_views_project ON public.project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_viewed_at ON public.project_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_comparisons_compared_at ON public.comparisons(compared_at);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- Policy creation blocks
DO $$
BEGIN
    -- 1. Enquiries Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enquiries public insert policy') THEN
        CREATE POLICY "Enquiries public insert policy" ON public.enquiries FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enquiries admin select policy') THEN
        CREATE POLICY "Enquiries admin select policy" ON public.enquiries FOR SELECT USING (
            auth.uid() = user_id OR public.get_my_role() IN ('super_admin', 'admin', 'sales_manager', 'support_executive')
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enquiries admin update policy') THEN
        CREATE POLICY "Enquiries admin update policy" ON public.enquiries FOR UPDATE USING (
            public.get_my_role() IN ('super_admin', 'admin', 'sales_manager', 'support_executive')
        );
    END IF;

    -- 2. Search Queries Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Search queries public insert policy') THEN
        CREATE POLICY "Search queries public insert policy" ON public.search_queries FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Search queries admin select policy') THEN
        CREATE POLICY "Search queries admin select policy" ON public.search_queries FOR SELECT USING (
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive')
        );
    END IF;

    -- 3. Project Views Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Project views public insert policy') THEN
        CREATE POLICY "Project views public insert policy" ON public.project_views FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Project views admin select policy') THEN
        CREATE POLICY "Project views admin select policy" ON public.project_views FOR SELECT USING (
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive')
        );
    END IF;

    -- 4. Comparisons Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Comparisons public insert policy') THEN
        CREATE POLICY "Comparisons public insert policy" ON public.comparisons FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Comparisons admin select policy') THEN
        CREATE POLICY "Comparisons admin select policy" ON public.comparisons FOR SELECT USING (
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive')
        );
    END IF;
END $$;
