-- CRIBR Enterprise Real Estate Intelligence DDL Schema
-- Compatible with Supabase PostgreSQL & pgvector extension

-- Enable vector extension for semantic AI search
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. BUILDERS TABLE
CREATE TABLE IF NOT EXISTS builders (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  reliability_score INT NOT NULL CHECK (reliability_score BETWEEN 0 AND 100),
  established_year INT NOT NULL,
  headquarters VARCHAR(255) NOT NULL,
  total_projects_delivered INT DEFAULT 0,
  ongoing_projects_count INT DEFAULT 0,
  complaint_resolution_rate VARCHAR(50) DEFAULT '95%',
  summary TEXT,
  pros TEXT[],
  cons TEXT[],
  top_projects TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(64) PRIMARY KEY,
  locality_name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  avg_price_per_sqft VARCHAR(100),
  price_growth_yoy VARCHAR(50),
  total_active_projects INT DEFAULT 0,
  connectivity_score NUMERIC(3,1) CHECK (connectivity_score BETWEEN 0 AND 10),
  liveability_score NUMERIC(3,1) CHECK (liveability_score BETWEEN 0 AND 10),
  summary TEXT,
  top_builders TEXT[],
  key_infrastructure TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  rank INT,
  name VARCHAR(255) NOT NULL,
  builder VARCHAR(255) NOT NULL,
  builder_id VARCHAR(64) REFERENCES builders(id) ON DELETE SET NULL,
  location VARCHAR(255) NOT NULL,
  locality_name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  rera_number VARCHAR(100) NOT NULL UNIQUE,
  min_price_lakhs NUMERIC(10,2) NOT NULL,
  max_price_lakhs NUMERIC(10,2) NOT NULL,
  price_range VARCHAR(100) NOT NULL,
  price_per_sqft VARCHAR(100) NOT NULL,
  density_value INT NOT NULL, -- u/acre
  density_text VARCHAR(100) NOT NULL,
  commute_score INT CHECK (commute_score BETWEEN 0 AND 10),
  commute_text VARCHAR(255),
  builder_grade VARCHAR(10) NOT NULL,
  reliability_score INT CHECK (reliability_score BETWEEN 0 AND 100),
  construction_progress INT CHECK (construction_progress BETWEEN 0 AND 100),
  cribr_score INT NOT NULL CHECK (cribr_score BETWEEN 0 AND 100),
  possession_date VARCHAR(100) NOT NULL,
  google_rating NUMERIC(2,1) CHECK (google_rating BETWEEN 0 AND 5),
  reviews_count INT DEFAULT 0,
  complaints_count VARCHAR(100),
  active_complaints_num INT DEFAULT 0,
  total_units VARCHAR(100),
  total_acres NUMERIC(8,2),
  status VARCHAR(50) NOT NULL CHECK (status IN ('safe', 'delayed', 'fairPrice', 'ready')),
  status_text VARCHAR(255) NOT NULL,
  delay_months INT DEFAULT 0,
  safe_to_buy BOOLEAN DEFAULT TRUE,
  ai_verdict TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  rating NUMERIC(2,1) CHECK (rating BETWEEN 0 AND 5),
  comment TEXT NOT NULL,
  verified_buyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCUMENTS TABLE (RERA & Legal Clearances)
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  file_size VARCHAR(50),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  year_quarter VARCHAR(50) NOT NULL,
  price_per_sqft INT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MARKET REPORTS TABLE
CREATE TABLE IF NOT EXISTS market_reports (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  publish_date VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  metrics_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SAVED PROJECTS TABLE
CREATE TABLE IF NOT EXISTS saved_projects (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);

-- 10. SAVED SEARCHES TABLE
CREATE TABLE IF NOT EXISTS saved_searches (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. CHAT SESSIONS & MESSAGES (Continuous Conversational AI Memory)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sources_json JSONB,
  citations_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PGVECTOR EMBEDDINGS TABLE (Semantic Vector Search)
CREATE TABLE IF NOT EXISTS pgvector_embeddings (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'project', 'builder', 'review', 'document'
  entity_id VARCHAR(64) NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding vector(1536), -- Standard OpenAI / Gemini vector dimension
  metadata_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. PROFILES TABLE (Supabase Auth Integration)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. PROPERTIES TABLE (Active Catalog Registry)
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  developer VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_range VARCHAR(100) NOT NULL,
  overall_score INT DEFAULT 90,
  image TEXT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. BOOKINGS TABLE (Site Visit Appointments)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id VARCHAR(64) NOT NULL,
  property_name VARCHAR(255) NOT NULL,
  builder_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  visit_date VARCHAR(50) NOT NULL,
  visit_time VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. SAVED PROPERTIES TABLE (User Favorites & Shortlists)
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id VARCHAR(64) NOT NULL,
  property_name VARCHAR(255) NOT NULL,
  developer VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  overall_score INT DEFAULT 90,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);

-- 17. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 18. AI REPORTS CACHE TABLE
CREATE TABLE IF NOT EXISTS ai_reports (
  id VARCHAR(255) PRIMARY KEY,
  query TEXT NOT NULL,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  ip_address VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. CRIBR CHAT SESSIONS & HISTORY
CREATE TABLE IF NOT EXISTS cribr_chats (
  id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_projects_locality ON projects(locality_name);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_cribr_score ON projects(cribr_score DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_cribr_chats_user ON cribr_chats(user_id);
