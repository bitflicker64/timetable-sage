import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SchedulingRequest {
  semester: number;
  semester_type: 'odd' | 'even' | 'summer';
  academic_year: number;
  dry_run?: boolean;
}

interface SchedulingResult {
  success: boolean;
  job_id: string;
  message: string;
  scheduled_classes?: any[];
  conflicts?: any[];
  diagnostics?: string[];
}

// Simple constraint checking for scheduling
class TimetableScheduler {
  private supabase: any;
  private conflicts: any[] = [];
  private diagnostics: string[] = [];

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async generateSchedule(request: SchedulingRequest): Promise<SchedulingResult> {
    const { semester, semester_type, academic_year } = request;
    
    // Clear existing scheduled classes for this semester
    if (!request.dry_run) {
      await this.supabase
        .from('scheduled_classes')
        .delete()
        .eq('semester', semester)
        .eq('semester_type', semester_type)
        .eq('academic_year', academic_year);
    }

    // Get all course sections for this semester
    const { data: courseSections, error: sectionsError } = await this.supabase
      .from('course_sections')
      .select(`
        *,
        courses (
          id, name, code, semester, semester_type
        ),
        faculty_assignments (
          faculty_id,
          faculty (
            id, name
          )
        )
      `);

    if (sectionsError) {
      throw sectionsError;
    }

    // Filter sections for the requested semester
    const relevantSections = courseSections.filter((section: any) => 
      section.courses?.semester === semester && 
      section.courses?.semester_type === semester_type
    );

    // Get available timeslots and rooms
    const [{ data: timeslots }, { data: rooms }] = await Promise.all([
      this.supabase.from('timeslots').select('*').order('day_of_week').order('slot_number'),
      this.supabase.from('rooms').select('*')
    ]);

    const scheduledClasses: any[] = [];
    this.conflicts = [];
    this.diagnostics = [];

    // Simple scheduling algorithm: try to assign each section to an available slot
    for (const section of relevantSections) {
      const assigned = await this.assignSection(
        section,
        timeslots,
        rooms,
        scheduledClasses,
        semester,
        semester_type,
        academic_year,
        request.dry_run
      );

      if (!assigned) {
        this.diagnostics.push(
          `Could not schedule ${section.courses?.name} (${section.section_name}) - no available slots`
        );
      }
    }

    const jobId = crypto.randomUUID();
    
    return {
      success: this.conflicts.length === 0,
      job_id: jobId,
      message: this.conflicts.length === 0 
        ? `Successfully scheduled ${scheduledClasses.length} classes` 
        : `Scheduled with ${this.conflicts.length} conflicts`,
      scheduled_classes: scheduledClasses,
      conflicts: this.conflicts,
      diagnostics: this.diagnostics
    };
  }

  private async assignSection(
    section: any,
    timeslots: any[],
    rooms: any[],
    scheduledClasses: any[],
    semester: number,
    semester_type: string,
    academic_year: number,
    dryRun: boolean = true
  ): Promise<boolean> {
    const facultyId = section.faculty_assignments?.[0]?.faculty_id;
    
    // Find suitable room based on capacity and type
    const suitableRooms = rooms.filter(room => 
      room.capacity >= section.max_students &&
      (section.class_type === 'lab' ? room.room_type.includes('lab') : true)
    );

    if (suitableRooms.length === 0) {
      this.diagnostics.push(
        `No suitable room found for ${section.courses?.name} (${section.section_name})`
      );
      return false;
    }

    // Try to find available timeslot
    for (const timeslot of timeslots) {
      for (const room of suitableRooms) {
        // Check for conflicts
        const hasRoomConflict = scheduledClasses.some(sc => 
          sc.room_id === room.id && sc.timeslot_id === timeslot.id
        );

        const hasFacultyConflict = facultyId && scheduledClasses.some(sc => 
          sc.faculty_id === facultyId && sc.timeslot_id === timeslot.id
        );

        if (!hasRoomConflict && !hasFacultyConflict) {
          // Schedule this class
          const scheduledClass = {
            course_section_id: section.id,
            faculty_id: facultyId,
            room_id: room.id,
            timeslot_id: timeslot.id,
            semester,
            semester_type,
            academic_year
          };

          scheduledClasses.push(scheduledClass);

          // Insert into database if not dry run
          if (!dryRun) {
            await this.supabase
              .from('scheduled_classes')
              .insert([scheduledClass]);
          }

          return true;
        }
      }
    }

    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Only POST method allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData: SchedulingRequest = await req.json();
    
    // Default to dry run
    if (requestData.dry_run === undefined) {
      requestData.dry_run = true;
    }

    const scheduler = new TimetableScheduler(supabaseClient);
    const result = await scheduler.generateSchedule(requestData);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-timetable function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      job_id: crypto.randomUUID()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});