-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light';

-- Update existing records to have default usernames where null
UPDATE public.profiles 
SET username = 'user_' || substring(id::text from 1 for 8)
WHERE username IS NULL;

-- Make username NOT NULL after setting defaults
ALTER TABLE public.profiles 
ALTER COLUMN username SET NOT NULL;

-- Make theme NOT NULL after setting defaults
ALTER TABLE public.profiles 
ALTER COLUMN theme SET NOT NULL;

-- Create function to automatically create profile on user signup if not exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert a new profile for the user with a default username
  INSERT INTO public.profiles (id, email, name, username, theme)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    'light'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recreate trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();