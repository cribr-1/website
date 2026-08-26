-- Create table for storing user search queries and intent
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    extracted_intent JSONB,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Apply Row Level Security
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from API routes)
CREATE POLICY "Allow inserts from anyone" 
ON public.search_logs 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view search logs
CREATE POLICY "Allow admins to read search logs"
ON public.search_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'super_admin' OR profiles.role = 'admin')
  )
);
