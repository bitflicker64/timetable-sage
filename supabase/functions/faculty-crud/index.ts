import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Faculty {
  id?: string;
  name: string;
  employee_id: string;
  email: string;
  department: string;
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
    const facultyId = url.pathname.split('/').pop();

    switch (method) {
      case 'GET': {
        if (facultyId && facultyId !== 'faculty-crud') {
          // Get single faculty with assignments
          const { data, error } = await supabaseClient
            .from('faculty')
            .select(`
              *,
              faculty_assignments (
                id,
                course_sections (
                  id, section_name,
                  courses (
                    id, name, code
                  )
                )
              )
            `)
            .eq('id', facultyId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all faculty with assignments
          const { data, error } = await supabaseClient
            .from('faculty')
            .select(`
              *,
              faculty_assignments (
                id,
                course_sections (
                  id, section_name,
                  courses (
                    id, name, code
                  )
                )
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
        const faculty: Faculty = await req.json();
        
        const { data, error } = await supabaseClient
          .from('faculty')
          .insert([faculty])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      case 'PATCH': {
        if (!facultyId || facultyId === 'faculty-crud') {
          throw new Error('Faculty ID is required for update');
        }

        const updates: Partial<Faculty> = await req.json();
        
        const { data, error } = await supabaseClient
          .from('faculty')
          .update(updates)
          .eq('id', facultyId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        if (!facultyId || facultyId === 'faculty-crud') {
          throw new Error('Faculty ID is required for deletion');
        }

        const { error } = await supabaseClient
          .from('faculty')
          .delete()
          .eq('id', facultyId);

        if (error) throw error;

        return new Response(JSON.stringify({ message: 'Faculty deleted successfully' }), {
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
    console.error('Error in faculty-crud function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});