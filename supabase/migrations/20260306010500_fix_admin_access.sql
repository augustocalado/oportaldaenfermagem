-- Ensure administrative access for the master user
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'augustocalado@hotmail.com';

-- Just in case the handle_new_user trigger hasn't run for some reason
INSERT INTO public.profiles (user_id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users
WHERE email = 'augustocalado@hotmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
