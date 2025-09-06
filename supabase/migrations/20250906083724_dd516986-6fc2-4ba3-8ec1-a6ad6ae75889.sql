-- Fix function search path security warning by dropping dependent triggers first
DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
DROP TRIGGER IF EXISTS update_course_sections_updated_at ON public.course_sections;
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
DROP TRIGGER IF EXISTS update_faculty_updated_at ON public.faculty;
DROP TRIGGER IF EXISTS update_rooms_updated_at ON public.rooms;
DROP TRIGGER IF EXISTS update_scheduled_classes_updated_at ON public.scheduled_classes;
DROP TRIGGER IF EXISTS update_constraints_updated_at ON public.constraints;

-- Drop and recreate function with secure search path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate all triggers
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_sections_updated_at BEFORE UPDATE ON public.course_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_classes_updated_at BEFORE UPDATE ON public.scheduled_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_constraints_updated_at BEFORE UPDATE ON public.constraints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();