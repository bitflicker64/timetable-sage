import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Course {
  id?: string;
  name: string;
  code: string;
  credits: number;
  program_id: string;
  semester: number;
  semester_type: 'odd' | 'even' | 'summer';
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

    const { method } = req;
    const url = new URL(req.url);
    const courseId = url.pathname.split('/').pop();

    switch (method) {
      case 'GET': {
        if (courseId && courseId !== 'courses-crud') {
          // Get single course with program details
          const { data, error } = await supabaseClient
            .from('courses')
            .select(`
              *,
              programs (
                id, name, code
              ),
              course_sections (
                id, section_name, max_students, class_type, duration_minutes
              )
            `)
            .eq('id', courseId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all courses with program details
          const { data, error } = await supabaseClient
            .from('courses')
            .select(`
              *,
              programs (
                id, name, code
              ),
              course_sections (
                id, section_name, max_students, class_type, duration_minutes
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'POST': {
        const course: Course = await req.json();
        
        const { data, error } = await supabaseClient
          .from('courses')
          .insert([course])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      case 'PATCH': {
        if (!courseId || courseId === 'courses-crud') {
          throw new Error('Course ID is required for update');
        }

        const updates: Partial<Course> = await req.json();
        
        const { data, error } = await supabaseClient
          .from('courses')
          .update(updates)
          .eq('id', courseId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        if (!courseId || courseId === 'courses-crud') {
          throw new Error('Course ID is required for deletion');
        }

        const { error } = await supabaseClient
          .from('courses')
          .delete()
          .eq('id', courseId);

        if (error) throw error;

        return new Response(JSON.stringify({ message: 'Course deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in courses-crud function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});