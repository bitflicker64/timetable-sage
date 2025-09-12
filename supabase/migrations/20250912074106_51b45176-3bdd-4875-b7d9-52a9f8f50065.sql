-- Fix security vulnerability: Restrict access to student and faculty personal information
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can view faculty" ON public.faculty;

-- Create secure policies for students table
-- Students can only view their own record (matched by email)
CREATE POLICY "Students can view their own record" 
ON public.students 
FOR SELECT 
USING (
  email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student'
);

-- Faculty and admins can view all student records (for academic purposes)
CREATE POLICY "Faculty and admins can view all students" 
ON public.students 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('faculty', 'admin')
);

-- Create secure policies for faculty table  
-- Faculty members can only view their own record (matched by email)
CREATE POLICY "Faculty can view their own record" 
ON public.faculty 
FOR SELECT 
USING (
  email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'faculty'
);

-- Admins can view all faculty records
CREATE POLICY "Admins can view all faculty" 
ON public.faculty 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);