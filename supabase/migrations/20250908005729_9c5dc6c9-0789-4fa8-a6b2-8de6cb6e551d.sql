-- Create user roles enum and table for proper role-based access control (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');
    END IF;
END $$;

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT get_current_user_role() = 'admin';
$$;

-- Function to check if current user is faculty
CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT get_current_user_role() IN ('admin', 'faculty');
$$;

-- Drop existing overly permissive policies across all tables
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT t.table_name 
        FROM information_schema.tables t 
        WHERE t.table_schema = 'public' 
        AND t.table_name IN ('programs', 'courses', 'course_sections', 'faculty', 'students', 'rooms', 'timeslots', 'scheduled_classes', 'faculty_assignments', 'enrollments', 'constraints')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.' || table_name;
        EXECUTE 'DROP POLICY IF EXISTS "Enable read access for all users" ON public.' || table_name;
    END LOOP;
END $$;

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (is_admin());

-- Programs table - role-based policies
CREATE POLICY "Anyone can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Only admins can insert programs" ON public.programs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update programs" ON public.programs FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete programs" ON public.programs FOR DELETE USING (is_admin());

-- Courses table - role-based policies  
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Only admins can insert courses" ON public.courses FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update courses" ON public.courses FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete courses" ON public.courses FOR DELETE USING (is_admin());

-- Course sections - role-based policies
CREATE POLICY "Anyone can view course sections" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can insert course sections" ON public.course_sections FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update course sections" ON public.course_sections FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete course sections" ON public.course_sections FOR DELETE USING (is_admin());

-- Faculty - role-based policies with faculty self-edit
CREATE POLICY "Anyone can view faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Only admins can insert faculty" ON public.faculty FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Faculty and admins can update faculty" ON public.faculty FOR UPDATE USING (is_faculty());
CREATE POLICY "Only admins can delete faculty" ON public.faculty FOR DELETE USING (is_admin());

-- Students - role-based policies
CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Only admins can insert students" ON public.students FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Faculty and admins can update students" ON public.students FOR UPDATE USING (is_faculty());
CREATE POLICY "Only admins can delete students" ON public.students FOR DELETE USING (is_admin());

-- All other tables - admin-only modifications, public read
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Only admins can insert rooms" ON public.rooms FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update rooms" ON public.rooms FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete rooms" ON public.rooms FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can view timeslots" ON public.timeslots FOR SELECT USING (true);
CREATE POLICY "Only admins can insert timeslots" ON public.timeslots FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update timeslots" ON public.timeslots FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete timeslots" ON public.timeslots FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can view scheduled classes" ON public.scheduled_classes FOR SELECT USING (true);
CREATE POLICY "Only admins can insert scheduled classes" ON public.scheduled_classes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update scheduled classes" ON public.scheduled_classes FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete scheduled classes" ON public.scheduled_classes FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can view faculty assignments" ON public.faculty_assignments FOR SELECT USING (true);
CREATE POLICY "Only admins can insert faculty assignments" ON public.faculty_assignments FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update faculty assignments" ON public.faculty_assignments FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete faculty assignments" ON public.faculty_assignments FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can view enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Only admins can insert enrollments" ON public.enrollments FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update enrollments" ON public.enrollments FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete enrollments" ON public.enrollments FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can view constraints" ON public.constraints FOR SELECT USING (true);
CREATE POLICY "Only admins can insert constraints" ON public.constraints FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update constraints" ON public.constraints FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete constraints" ON public.constraints FOR DELETE USING (is_admin());

-- Add trigger for profiles updated_at (if not exists)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();