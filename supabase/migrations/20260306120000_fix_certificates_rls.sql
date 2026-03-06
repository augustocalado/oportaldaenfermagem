-- Fix RLS policy for certificates table
-- Allow authenticated users to insert their own certificates
DROP POLICY IF EXISTS "Users can insert their own certificates" ON public.certificates;
CREATE POLICY "Users can insert their own certificates" ON public.certificates 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure profiles has all necessary columns for the application to function
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name_certificate TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
