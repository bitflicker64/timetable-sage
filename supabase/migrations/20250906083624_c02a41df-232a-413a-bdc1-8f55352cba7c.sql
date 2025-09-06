-- Create enum types first
CREATE TYPE public.semester_type AS ENUM ('odd', 'even', 'summer');
CREATE TYPE public.class_type AS ENUM ('lecture', 'lab', 'tutorial', 'practical');
CREATE TYPE public.day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- Programs table
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    duration_years INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    semester_type public.semester_type NOT NULL DEFAULT 'odd',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course sections table
CREATE TABLE public.course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 60,
    class_type public.class_type NOT NULL DEFAULT 'lecture',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(course_id, section_name)
);

-- Students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    current_semester INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    course_section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, course_section_id)
);

-- Faculty table
CREATE TABLE public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Faculty assignments table
CREATE TABLE public.faculty_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
    course_section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(faculty_id, course_section_id)
);

-- Rooms table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    room_type TEXT NOT NULL DEFAULT 'classroom',
    building TEXT,
    floor INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Timeslots table
CREATE TABLE public.timeslots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week public.day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(day_of_week, slot_number)
);

-- Scheduled classes table
CREATE TABLE public.scheduled_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    timeslot_id UUID REFERENCES public.timeslots(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    semester_type public.semester_type NOT NULL,
    academic_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(room_id, timeslot_id, semester, semester_type, academic_year),
    UNIQUE(faculty_id, timeslot_id, semester, semester_type, academic_year)
);

-- Constraints table for scheduling rules
CREATE TABLE public.constraints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'hard' or 'soft'
    description TEXT,
    parameters JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constraints ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an educational management system)
CREATE POLICY "Enable read access for all users" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.students FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.faculty_assignments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.timeslots FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.scheduled_classes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.constraints FOR SELECT USING (true);

-- Create policies for write access (admin functionality)
CREATE POLICY "Enable all operations for authenticated users" ON public.programs FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.courses FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.course_sections FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.students FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.enrollments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.faculty FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.faculty_assignments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.rooms FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.timeslots FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.scheduled_classes FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.constraints FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_courses_program_id ON public.courses(program_id);
CREATE INDEX idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course_section_id ON public.enrollments(course_section_id);
CREATE INDEX idx_faculty_assignments_faculty_id ON public.faculty_assignments(faculty_id);
CREATE INDEX idx_faculty_assignments_course_section_id ON public.faculty_assignments(course_section_id);
CREATE INDEX idx_scheduled_classes_timeslot_id ON public.scheduled_classes(timeslot_id);
CREATE INDEX idx_scheduled_classes_room_id ON public.scheduled_classes(room_id);
CREATE INDEX idx_scheduled_classes_faculty_id ON public.scheduled_classes(faculty_id);
CREATE INDEX idx_scheduled_classes_semester ON public.scheduled_classes(semester, semester_type, academic_year);

-- Insert sample data
-- Insert sample program
INSERT INTO public.programs (name, code, duration_years) VALUES 
('Computer Science Engineering', 'CSE', 4);

-- Insert sample courses
INSERT INTO public.courses (name, code, credits, program_id, semester, semester_type) 
SELECT 
    'Data Structures and Algorithms', 'CSE201', 4, p.id, 3, 'odd'
FROM public.programs p WHERE p.code = 'CSE';

INSERT INTO public.courses (name, code, credits, program_id, semester, semester_type) 
SELECT 
    'Database Management Systems', 'CSE301', 3, p.id, 5, 'odd'
FROM public.programs p WHERE p.code = 'CSE';

-- Insert course sections
INSERT INTO public.course_sections (course_id, section_name, max_students, class_type, duration_minutes)
SELECT c.id, 'A', 60, 'lecture', 60 FROM public.courses c WHERE c.code = 'CSE201';

INSERT INTO public.course_sections (course_id, section_name, max_students, class_type, duration_minutes)
SELECT c.id, 'B', 30, 'lab', 120 FROM public.courses c WHERE c.code = 'CSE201';

INSERT INTO public.course_sections (course_id, section_name, max_students, class_type, duration_minutes)
SELECT c.id, 'A', 60, 'lecture', 60 FROM public.courses c WHERE c.code = 'CSE301';

INSERT INTO public.course_sections (course_id, section_name, max_students, class_type, duration_minutes)
SELECT c.id, 'B', 30, 'lab', 120 FROM public.courses c WHERE c.code = 'CSE301';

-- Insert sample students
INSERT INTO public.students (name, roll_number, email, program_id, current_semester)
SELECT 'John Doe', '2021CSE001', 'john.doe@example.com', p.id, 3 FROM public.programs p WHERE p.code = 'CSE';

INSERT INTO public.students (name, roll_number, email, program_id, current_semester)
SELECT 'Jane Smith', '2021CSE002', 'jane.smith@example.com', p.id, 3 FROM public.programs p WHERE p.code = 'CSE';

-- Insert sample faculty
INSERT INTO public.faculty (name, employee_id, email, department) VALUES 
('Dr. Alice Johnson', 'FAC001', 'alice.johnson@university.edu', 'Computer Science'),
('Prof. Bob Wilson', 'FAC002', 'bob.wilson@university.edu', 'Computer Science');

-- Insert sample rooms
INSERT INTO public.rooms (name, code, capacity, room_type, building, floor) VALUES 
('Lecture Hall 1', 'LH001', 80, 'lecture_hall', 'Academic Block A', 1),
('Computer Lab 1', 'CL001', 30, 'computer_lab', 'Academic Block B', 2);

-- Insert sample timeslots
INSERT INTO public.timeslots (day_of_week, start_time, end_time, slot_number) VALUES 
('monday', '09:00:00', '10:00:00', 1),
('monday', '10:00:00', '11:00:00', 2),
('tuesday', '09:00:00', '10:00:00', 1),
('tuesday', '10:00:00', '11:00:00', 2);

-- Insert sample constraints
INSERT INTO public.constraints (name, type, description, parameters) VALUES 
('No Faculty Overlap', 'hard', 'Faculty cannot be assigned to multiple classes at the same time', '{}'),
('Room Capacity', 'hard', 'Number of enrolled students should not exceed room capacity', '{}'),
('Student Schedule Conflict', 'hard', 'Students should not have overlapping classes', '{}'),
('Lunch Break', 'soft', 'Prefer to have a lunch break between 12:00-13:00', '{"preferred_break_start": "12:00", "preferred_break_end": "13:00"}');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_sections_updated_at BEFORE UPDATE ON public.course_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_classes_updated_at BEFORE UPDATE ON public.scheduled_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_constraints_updated_at BEFORE UPDATE ON public.constraints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();