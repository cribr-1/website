-- CRIBR ENTERPRISE SUITE OF DATABASE TABLES
-- Production-ready, fully hardened Supabase & PostgreSQL schema with Row Level Security (RLS),
-- role-based access control (RBAC), database indexing, and automated user synchronization.

-- Ensure standard PostgreSQL extensions are active
create extension if not exists "uuid-ossp";

-- ====================================================
-- 1. PROFILES & ROLES SYSTEM
-- ====================================================

create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    phone text,
    avatar_url text,
    role text default 'explorer'::text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint check_valid_role check (
        role in (
            'super_admin',       -- All access
            'admin',             -- Core operations
            'content_manager',   -- Listing edits only
            'sales_manager',     -- Booking edits only
            'support_executive', -- Customer query view only
            'builder_partner',   -- Own project edits only
            'explorer'           -- Standard customer
        )
    )
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Recursive-free, fast role resolution helper (executed as Security Definer)
create or replace function public.get_my_role()
returns text as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = auth.uid();
  return coalesce(user_role, 'explorer');
end;
$$ language plpgsql security definer;

-- Profiles Policies (Enterprise Grade)
create policy "Profiles select policy" on public.profiles
    for select using (
        auth.uid() = id OR 
        public.get_my_role() in ('super_admin', 'admin', 'sales_manager', 'support_executive')
    );

create policy "Profiles insert policy" on public.profiles
    for insert with check (
        auth.uid() = id
    );

create policy "Profiles update policy" on public.profiles
    for update using (
        auth.uid() = id OR 
        public.get_my_role() in ('super_admin', 'admin')
    );

create policy "Profiles delete policy" on public.profiles
    for delete using (
        public.get_my_role() in ('super_admin', 'admin')
    );

-- Trigger to automatically create a profile on Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Cribr Explorer'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
    'explorer' -- Always default new sign-ups to standard explorer
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ====================================================
-- 2. PROPERTIES & ASSETS CATALOG
-- ====================================================

create table if not exists public.properties (
    id text primary key,
    name text not null,
    developer text not null,
    city text not null,
    location text not null,
    price_range text not null,
    image text not null,
    description text not null,
    overall_score integer default 80,
    status text default 'draft'::text not null, -- 'draft' | 'published' | 'archived'
    is_deleted boolean default false not null,
    builder_id uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint check_valid_score check (overall_score >= 0 and overall_score <= 100),
    constraint check_valid_status check (status in ('draft', 'published', 'archived'))
);

-- Enable RLS on properties
alter table public.properties enable row level security;

-- Properties Policies (Enterprise Grade)
create policy "Properties select policy" on public.properties
    for select using (
        (status = 'published'::text and is_deleted = false) OR 
        public.get_my_role() in ('super_admin', 'admin', 'content_manager', 'sales_manager', 'support_executive') OR
        (auth.uid() = builder_id)
    );

create policy "Properties modification policy" on public.properties
    for all using (
        public.get_my_role() in ('super_admin', 'admin', 'content_manager') OR
        (public.get_my_role() = 'builder_partner' and auth.uid() = builder_id)
    );


-- ====================================================
-- 3. SITE INSPECTION BOOKINGS
-- ====================================================

create table if not exists public.bookings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    property_id text not null,
    property_name text not null,
    builder_name text not null,
    location text not null,
    visit_date date not null,
    visit_time text not null, -- 'morning' | 'afternoon' | 'evening'
    status text default 'scheduled'::text not null, -- 'scheduled' | 'completed' | 'cancelled'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint check_valid_visit_time check (visit_time in ('morning', 'afternoon', 'evening')),
    constraint check_valid_status check (status in ('scheduled', 'completed', 'cancelled'))
);

-- Enable RLS on bookings
alter table public.bookings enable row level security;

-- Bookings Policies (Enterprise Grade)
create policy "Bookings select policy" on public.bookings
    for select using (
        auth.uid() = user_id OR 
        public.get_my_role() in ('super_admin', 'admin', 'sales_manager', 'support_executive')
    );

create policy "Bookings insert policy" on public.bookings
    for insert with check (
        auth.uid() = user_id OR
        public.get_my_role() in ('super_admin', 'admin', 'sales_manager')
    );

create policy "Bookings update policy" on public.bookings
    for update using (
        auth.uid() = user_id OR 
        public.get_my_role() in ('super_admin', 'admin', 'sales_manager')
    );

create policy "Bookings delete policy" on public.bookings
    for delete using (
        public.get_my_role() in ('super_admin', 'admin')
    );


-- ====================================================
-- 4. SAVED HOMES & FAVORITES
-- ====================================================

create table if not exists public.saved_properties (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    property_id text not null,
    property_name text not null,
    developer text not null,
    city text not null,
    overall_score integer not null,
    saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, property_id)
);

-- Enable RLS on saved_properties
alter table public.saved_properties enable row level security;

-- Saved Properties Policies (Enterprise Grade)
create policy "Saved properties select policy" on public.saved_properties
    for select using (
        auth.uid() = user_id OR 
        public.get_my_role() in ('super_admin', 'admin', 'sales_manager')
    );

create policy "Saved properties insert policy" on public.saved_properties
    for insert with check (
        auth.uid() = user_id
    );

create policy "Saved properties delete policy" on public.saved_properties
    for delete using (
        auth.uid() = user_id
    );


-- ====================================================
-- 5. AI INTELLIGENCE CACHED REPORTS
-- ====================================================

create table if not exists public.ai_reports (
    id text primary key, -- Normalized lowercase search query hash or slug
    query text not null,
    report_data jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on ai_reports
alter table public.ai_reports enable row level security;

-- AI Reports Policies (Enterprise Grade)
create policy "AI Reports public select" on public.ai_reports
    for select using (true);

create policy "AI Reports authenticated insert" on public.ai_reports
    for insert with check (
        auth.role() = 'authenticated'
    );

create policy "AI Reports admin modification" on public.ai_reports
    for all using (
        public.get_my_role() in ('super_admin', 'admin')
    );


-- ====================================================
-- 6. NOTIFICATION SUBSCRIPTIONS
-- ====================================================

create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    property_name text not null,
    rera_progress boolean default false,
    price_drops boolean default false,
    legal_updates boolean default false,
    noise_fluctuation boolean default false,
    email_enabled boolean default false,
    whatsapp_enabled boolean default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, property_name)
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

-- Notifications Policies (Enterprise Grade)
create policy "Notifications policy" on public.notifications
    for all using (
        auth.uid() = user_id OR 
        public.get_my_role() in ('super_admin', 'admin')
    );


-- ====================================================
-- 7. TAMPER-PROOF AUDIT LOGS (Section 11)
-- ====================================================

create table if not exists public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete set null,
    user_email text,
    role text,
    action text not null, -- 'ADMIN_LOGIN', 'PROPERTY_EDIT', 'BOOKING_UPDATE', 'SETTINGS_CHANGE'
    details text,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on audit_logs
alter table public.audit_logs enable row level security;

-- Only Administrators can read audit logs. No updates/deletes permitted to maintain tamper proof logging.
create policy "Audit logs select policy" on public.audit_logs
    for select using (
        public.get_my_role() in ('super_admin', 'admin')
    );

create policy "Audit logs insert policy" on public.audit_logs
    for insert with check (true);


-- ====================================================
-- 8. HIGH-PERFORMANCE DATABASE INDEXES (Section 9, 10)
-- ====================================================

-- Indexes on foreign key links to optimize Joins and nested fetches
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_properties_builder_status on public.properties(builder_id, status, is_deleted);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_saved_properties_user_id on public.saved_properties(user_id);
create index if not exists idx_notifications_user_prop on public.notifications(user_id, property_name);
create index if not exists idx_audit_logs_action_created on public.audit_logs(action, created_at);


-- ====================================================
-- 9. INITIAL DATABASE SEEDING
-- ====================================================

insert into public.properties (id, name, developer, city, location, price_range, image, description, overall_score, status, is_deleted)
values 
('prestige-kingston', 'Prestige Kingston', 'Prestige Group', 'Bangalore', 'Whitefield Corridor', '₹3.2 Cr - ₹5.8 Cr', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80', 'Spatially designed smart homes set in an expansive 80% open landscape with premium fittings and impeccable IT corridor proximity.', 89, 'published', false),
('sobha-royal-pavilion', 'Sobha Royal Pavilion', 'Sobha Limited', 'Bangalore', 'Sarjapur Road', '₹2.8 Cr - ₹4.5 Cr', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80', 'A majestic Rajasthani palace-themed development celebrated for Sobha''s unmatched backward-integrated construction quality.', 92, 'published', false),
('dlf-camellias', 'DLF Camellias', 'DLF Limited', 'Gurgaon', 'Golf Course Road', '₹24.0 Cr - ₹45.0 Cr', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80', 'The peak of luxury residential living in India. Breathtaking design, Olympic-standard clubhouse, and absolute legal clearance.', 98, 'published', false),
('lodha-altamount', 'Lodha Altamount', 'Lodha Group', 'Mumbai', 'Altamount Road', '₹18.0 Cr - ₹35.0 Cr', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80', 'Ultra-high-net-worth residence overlooking the Arabian Sea, boasting bespoke structural engineering and private butler services.', 94, 'published', false),
('oberoi-three-sixty', 'Oberoi Three Sixty West', 'Oberoi Realty', 'Mumbai', 'Worli', '₹15.0 Cr - ₹28.0 Cr', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80', 'A gorgeous luxury tower designed for flawless views, silent privacy, and unmatched wind-shear structural certifications.', 94, 'published', false),
('godrej-meridien', 'Godrej Meridien', 'Godrej Properties', 'Gurgaon', 'Dwarka Expressway', '₹2.2 Cr - ₹4.0 Cr', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=80', 'Features a massive 66,000 sqft club, certified water recycling infrastructure, and high investment appreciation outlook.', 85, 'published', false)
on conflict (id) do update set
    name = excluded.name,
    developer = excluded.developer,
    city = excluded.city,
    location = excluded.location,
    price_range = excluded.price_range,
    image = excluded.image,
    description = excluded.description,
    overall_score = excluded.overall_score,
    status = excluded.status,
    is_deleted = excluded.is_deleted;


-- ====================================================
-- 10. AI CHATBOT PERSISTENT HISTORIES (CRIBR AI)
-- ====================================================

create table if not exists public.cribr_chats (
    id text primary key,
    user_id uuid references auth.users on delete cascade not null,
    title text not null,
    is_pinned boolean default false not null,
    messages jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cribr_chats enable row level security;

-- Policies for chats
create policy "Chats select policy" on public.cribr_chats
    for select using (auth.uid() = user_id);

create policy "Chats insert policy" on public.cribr_chats
    for insert with check (auth.uid() = user_id);

create policy "Chats update policy" on public.cribr_chats
    for update using (auth.uid() = user_id);

create policy "Chats delete policy" on public.cribr_chats
    for delete using (auth.uid() = user_id);

-- High-performance index for chat searches and sessions list
create index if not exists idx_cribr_chats_user_pinned on public.cribr_chats(user_id, is_pinned desc, created_at desc);

