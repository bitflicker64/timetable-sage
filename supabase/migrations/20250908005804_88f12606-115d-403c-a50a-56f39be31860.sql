-- Fix security issues by restricting public access to sensitive data
-- Update faculty table policies - require authentication for personal info
DROP POLICY IF EXISTS "Anyone can view faculty" ON public.faculty;
CREATE POLICY "Authenticated users can view faculty" ON public.faculty 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Update students table policies - require authentication for personal info  
DROP POLICY IF EXISTS "Anyone can view students" ON public.students;
CREATE POLICY "Authenticated users can view students" ON public.students
  FOR SELECT USING (auth.role() = 'authenticated');

-- Update enrollments - require authentication
DROP POLICY IF EXISTS "Anyone can view enrollments" ON public.enrollments;
CREATE POLICY "Authenticated users can view enrollments" ON public.enrollments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Faculty assignments should also be auth-only for privacy
DROP POLICY IF EXISTS "Anyone can view faculty assignments" ON public.faculty_assignments;
CREATE POLICY "Authenticated users can view faculty assignments" ON public.faculty_assignments
  FOR SELECT USING (auth.role() = 'authenticated');