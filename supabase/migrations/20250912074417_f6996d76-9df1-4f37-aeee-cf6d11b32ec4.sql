-- First, let's check if we have the admin account
SELECT email FROM auth.users WHERE email = 'admin@timegenix.com';

-- We need to use the proper Supabase method to create users
-- Since we can't directly insert into auth.users in SQL, let's ensure
-- the trigger function works properly for when the admin signs up

-- Also let's make sure the profiles table is properly set up
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;