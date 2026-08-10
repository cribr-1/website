-- CRIBR Client Spreadsheet Schema Synchronization Migration
-- Source of Truth: qubit_project_comparison Final.xlsx
-- Non-destructive, idempotent, and RLS-hardened migration.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper date parsing function to safely cast text date formats ('YYYY-MM-DD', 'DD-MM-YYYY') to DATE
CREATE OR REPLACE FUNCTION public.try_cast_date(val text)
RETURNS date AS $$
BEGIN
    IF val IS NULL OR trim(val) = '' THEN
        RETURN NULL;
    END IF;
    -- Try YYYY-MM-DD format
    IF val ~ '^\d{4}-\d{2}-\d{2}$' THEN
        RETURN val::date;
    -- Try DD-MM-YYYY format
    ELSIF val ~ '^\d{2}-\d{2}-\d{4}$' THEN
        RETURN to_date(val, 'DD-MM-YYYY');
    ELSE
        RETURN NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 1. NORMALIZED ENTITY TABLES
-- ============================================================================

-- A. Builders Registry Table
CREATE TABLE IF NOT EXISTS public.builders (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    grade VARCHAR(10) CHECK (grade IN ('A+', 'A', 'B', 'C', 'D')),
    reliability_score NUMERIC(3, 2) CHECK (reliability_score BETWEEN 0 AND 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. Localities Registry Table
CREATE TABLE IF NOT EXISTS public.localities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    taluk VARCHAR(255),
    city VARCHAR(255) DEFAULT 'Bangalore',
    nearest_office_hub VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- C. Office Hubs Reference Table
CREATE TABLE IF NOT EXISTS public.office_hubs (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial office hubs from spreadsheet Legend
INSERT INTO public.office_hubs (id, name, latitude, longitude) VALUES
    ('hub-manyata', 'Manyata Tech Park', 13.0478000, 77.6266000),
    ('hub-sarjapur', 'Sarjapur Road', 12.8777000, 77.6766000),
    ('hub-itpl', 'ITPL / Whitefield', 12.9698000, 77.7499000),
    ('hub-kadubeesanahalli', 'Kadubeesanahalli', 12.9311000, 77.6878000),
    ('hub-ecity', 'Electronic City', 12.8394000, 77.6770000)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. ALTER MASTER PROJECTS TABLE TO MATCH SPREADSHEET FIELDS
-- ============================================================================

-- Safe column additions
ALTER TABLE public.projects 
    ADD COLUMN IF NOT EXISTS rera_project_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS builder_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS locality TEXT,
    ADD COLUMN IF NOT EXISTS taluk VARCHAR(255),
    ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
    ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7),
    ADD COLUMN IF NOT EXISTS project_start_date TEXT,
    ADD COLUMN IF NOT EXISTS land_area_sqm NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS land_litigation BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS unit_types TEXT[],
    ADD COLUMN IF NOT EXISTS min_price NUMERIC(14, 2),
    ADD COLUMN IF NOT EXISTS max_price NUMERIC(14, 2),
    ADD COLUMN IF NOT EXISTS nearest_office_hub VARCHAR(255),
    ADD COLUMN IF NOT EXISTS distance_to_hub_km NUMERIC(6, 2),
    ADD COLUMN IF NOT EXISTS google_review_summary TEXT;

-- Foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects_builder') THEN
        ALTER TABLE public.projects 
            ADD CONSTRAINT fk_projects_builder 
            FOREIGN KEY (builder_id) REFERENCES public.builders(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- 3. RECOMMENDED INDEXES FOR PRODUCTION QUERY PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_rera_project_name ON public.projects(rera_project_name);
CREATE INDEX IF NOT EXISTS idx_projects_builder_id ON public.projects(builder_id);
CREATE INDEX IF NOT EXISTS idx_projects_builder_name ON public.projects(builder_name);
CREATE INDEX IF NOT EXISTS idx_projects_city_locality ON public.projects(city, locality);
CREATE INDEX IF NOT EXISTS idx_projects_coords ON public.projects(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_projects_pricing ON public.projects(min_price, max_price, price_per_sqft);
CREATE INDEX IF NOT EXISTS idx_projects_litigation ON public.projects(land_litigation);

-- ============================================================================
-- 4. COMPUTED DERIVED FIELDS VIEW (SAFE TYPE CASTING FOR ALL DATE FORMATS)
-- ============================================================================

CREATE OR REPLACE VIEW public.v_projects_analysis AS
SELECT 
    p.*,
    -- 1. Land Area (acres): sqm / 4046.8564
    ROUND(COALESCE(p.land_area_sqm, 0) / 4046.8564224, 2) AS land_area_acres,
    
    -- 2. Unit Density (units/acre): Total Units / Land Area Acres
    CASE 
        WHEN COALESCE(p.land_area_sqm, 0) > 0 THEN ROUND(p.total_units / (p.land_area_sqm / 4046.8564224), 1)
        ELSE NULL 
    END AS unit_density_per_acre,
    
    -- 3. Years to Possession: (Possession Date - Current Date) / 365.25
    CASE 
        WHEN public.try_cast_date(p.possession_date::text) IS NOT NULL THEN 
            ROUND((public.try_cast_date(p.possession_date::text) - CURRENT_DATE)::NUMERIC / 365.25, 2)
        ELSE NULL 
    END AS years_to_possession,
    
    -- 4. Timeline Reliability Ratio: Construction Progress % / Time Elapsed %
    CASE 
        WHEN public.try_cast_date(p.project_start_date::text) IS NOT NULL 
             AND public.try_cast_date(p.possession_date::text) IS NOT NULL 
             AND (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text)) > 0 THEN
            ROUND(
                (COALESCE(p.construction_progress, 0)::NUMERIC) / 
                NULLIF(((CURRENT_DATE - public.try_cast_date(p.project_start_date::text))::NUMERIC / (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text))::NUMERIC * 100), 0),
                2
            )
        ELSE NULL 
    END AS timeline_reliability_ratio,

    -- 5. Timeline Reliability Display Status
    CASE 
        WHEN public.try_cast_date(p.project_start_date::text) IS NOT NULL 
             AND public.try_cast_date(p.possession_date::text) IS NOT NULL 
             AND (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text)) > 0 THEN
            CASE 
                WHEN (COALESCE(p.construction_progress, 0)::NUMERIC / NULLIF(((CURRENT_DATE - public.try_cast_date(p.project_start_date::text))::NUMERIC / (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text))::NUMERIC * 100), 0)) >= 1.10 THEN 'Ahead'
                WHEN (COALESCE(p.construction_progress, 0)::NUMERIC / NULLIF(((CURRENT_DATE - public.try_cast_date(p.project_start_date::text))::NUMERIC / (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text))::NUMERIC * 100), 0)) >= 0.90 THEN 'On Track'
                WHEN (COALESCE(p.construction_progress, 0)::NUMERIC / NULLIF(((CURRENT_DATE - public.try_cast_date(p.project_start_date::text))::NUMERIC / (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text))::NUMERIC * 100), 0)) >= 0.75 THEN 'Slight Delay'
                WHEN (COALESCE(p.construction_progress, 0)::NUMERIC / NULLIF(((CURRENT_DATE - public.try_cast_date(p.project_start_date::text))::NUMERIC / (public.try_cast_date(p.possession_date::text) - public.try_cast_date(p.project_start_date::text))::NUMERIC * 100), 0)) >= 0.60 THEN 'Major Delay'
                ELSE 'Extreme Delay'
            END
        ELSE 'On Track'
    END AS timeline_reliability_status,

    -- 6. Commute Rating Display
    CASE 
        WHEN p.distance_to_hub_km IS NULL THEN 'N/A'
        WHEN p.distance_to_hub_km <= 5.0 THEN '0–5 km: Very good'
        WHEN p.distance_to_hub_km <= 10.0 THEN '5–10 km: Good'
        WHEN p.distance_to_hub_km <= 15.0 THEN '10–15 km: Fair'
        WHEN p.distance_to_hub_km <= 20.0 THEN '15–20 km: Poor'
        ELSE '20+ km: Very poor'
    END AS commute_score_display

FROM public.projects p;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES & VIEWS
-- ============================================================================

ALTER TABLE public.builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_hubs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Public read policy for entities
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Builders public select policy') THEN
        CREATE POLICY "Builders public select policy" ON public.builders FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Localities public select policy') THEN
        CREATE POLICY "Localities public select policy" ON public.localities FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Office hubs public select policy') THEN
        CREATE POLICY "Office hubs public select policy" ON public.office_hubs FOR SELECT USING (true);
    END IF;
    
    -- Admin modifications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Builders admin modify policy') THEN
        CREATE POLICY "Builders admin modify policy" ON public.builders FOR ALL USING (
            public.get_my_role() IN ('super_admin', 'admin', 'content_manager')
        );
    END IF;
END $$;
