-- Add image_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for course covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-covers', 'course-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for course-covers
-- 1. Everyone can view covers
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'course-covers');

-- 2. Authenticated users can upload covers (admins only, but we use email check for simplicity as in other policies)
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'course-covers' AND 
  (auth.jwt() ->> 'email') = 'augustocalado@hotmail.com'
);

-- 3. Admin can update/delete
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'course-covers' AND 
  (auth.jwt() ->> 'email') = 'augustocalado@hotmail.com'
);

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'course-covers' AND 
  (auth.jwt() ->> 'email') = 'augustocalado@hotmail.com'
);
