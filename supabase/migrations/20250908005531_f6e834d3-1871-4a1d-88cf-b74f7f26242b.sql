-- Create user roles enum and table for proper role-based access control
CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');

-- Create profiles table to store user information and roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Profiles table policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (is_admin());

-- Drop existing overly permissive policies and create proper ones
-- Programs table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.programs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.programs;

CREATE POLICY "Anyone can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Only admins can manage programs" ON public.programs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update programs" ON public.programs FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete programs" ON public.programs FOR DELETE USING (is_admin());

-- Courses table policies  
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.courses;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;

CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Only admins can manage courses" ON public.courses FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update courses" ON public.courses FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete courses" ON public.courses FOR DELETE USING (is_admin());

-- Course sections table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.course_sections;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.course_sections;

CREATE POLICY "Anyone can view course sections" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can manage course sections" ON public.course_sections FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update course sections" ON public.course_sections FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete course sections" ON public.course_sections FOR DELETE USING (is_admin());

-- Faculty table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.faculty;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.faculty;

CREATE POLICY "Anyone can view faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Only admins can manage faculty" ON public.faculty FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins and faculty can update faculty" ON public.faculty FOR UPDATE USING (is_faculty());
CREATE POLICY "Only admins can delete faculty" ON public.faculty FOR DELETE USING (is_admin());

-- Students table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.students;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.students;

CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Only admins can manage students" ON public.students FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins and faculty can update students" ON public.students FOR UPDATE USING (is_faculty());
CREATE POLICY "Only admins can delete students" ON public.students FOR DELETE USING (is_admin());

-- Rooms table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rooms;

CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Only admins can manage rooms" ON public.rooms FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update rooms" ON public.rooms FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete rooms" ON public.rooms FOR DELETE USING (is_admin());

-- Timeslots table policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.timeslots;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.timeslots;

CREATE POLICY "Anyone can view timeslots" ON public.timeslots FOR SELECT USING (true);
CREATE POLICY "Only admins can manage timeslots" ON public.timeslots FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update timeslots" ON public.timeslots FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete timeslots" ON public.timeslots FOR DELETE USING (is_admin());

-- Scheduled classes policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.scheduled_classes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.scheduled_classes;

CREATE POLICY "Anyone can view scheduled classes" ON public.scheduled_classes FOR SELECT USING (true);
CREATE POLICY "Only admins can manage scheduled classes" ON public.scheduled_classes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update scheduled classes" ON public.scheduled_classes FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete scheduled classes" ON public.scheduled_classes FOR DELETE USING (is_admin());

-- Faculty assignments policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.faculty_assignments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.faculty_assignments;

CREATE POLICY "Anyone can view faculty assignments" ON public.faculty_assignments FOR SELECT USING (true);
CREATE POLICY "Only admins can manage faculty assignments" ON public.faculty_assignments FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update faculty assignments" ON public.faculty_assignments FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete faculty assignments" ON public.faculty_assignments FOR DELETE USING (is_admin());

-- Enrollments policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.enrollments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.enrollments;

CREATE POLICY "Anyone can view enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Only admins can manage enrollments" ON public.enrollments FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update enrollments" ON public.enrollments FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete enrollments" ON public.enrollments FOR DELETE USING (is_admin());

-- Constraints policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.constraints;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.constraints;

CREATE POLICY "Anyone can view constraints" ON public.constraints FOR SELECT USING (true);
CREATE POLICY "Only admins can manage constraints" ON public.constraints FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update constraints" ON public.constraints FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete constraints" ON public.constraints FOR DELETE USING (is_admin());

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();