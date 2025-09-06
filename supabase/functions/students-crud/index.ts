import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Student {
  id?: string;
  name: string;
  roll_number: string;
  email: string;
  program_id?: string;
  current_semester: number;
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
    const studentId = url.pathname.split('/').pop();

    switch (method) {
      case 'GET': {
        if (studentId && studentId !== 'students-crud') {
          // Get single student with program details
          const { data, error } = await supabaseClient
            .from('students')
            .select(`
              *,
              programs (
                id, name, code
              )
            `)
            .eq('id', studentId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all students with program details
          const { data, error } = await supabaseClient
            .from('students')
            .select(`
              *,
              programs (
                id, name, code
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
        const student: Student = await req.json();
        
        const { data, error } = await supabaseClient
          .from('students')
          .insert([student])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      case 'PATCH': {
        if (!studentId || studentId === 'students-crud') {
          throw new Error('Student ID is required for update');
        }

        const updates: Partial<Student> = await req.json();
        
        const { data, error } = await supabaseClient
          .from('students')
          .update(updates)
          .eq('id', studentId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        if (!studentId || studentId === 'students-crud') {
          throw new Error('Student ID is required for deletion');
        }

        const { error } = await supabaseClient
          .from('students')
          .delete()
          .eq('id', studentId);

        if (error) throw error;

        return new Response(JSON.stringify({ message: 'Student deleted successfully' }), {
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
    console.error('Error in students-crud function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});