import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Room {
  id?: string;
  name: string;
  code: string;
  capacity: number;
  room_type: string;
  building?: string;
  floor?: number;
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
    const roomId = url.pathname.split('/').pop();

    switch (method) {
      case 'GET': {
        if (roomId && roomId !== 'rooms-crud') {
          // Get single room
          const { data, error } = await supabaseClient
            .from('rooms')
            .select('*')
            .eq('id', roomId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all rooms
          const { data, error } = await supabaseClient
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'POST': {
        const room: Room = await req.json();
        
        const { data, error } = await supabaseClient
          .from('rooms')
          .insert([room])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      case 'PATCH': {
        if (!roomId || roomId === 'rooms-crud') {
          throw new Error('Room ID is required for update');
        }

        const updates: Partial<Room> = await req.json();
        
        const { data, error } = await supabaseClient
          .from('rooms')
          .update(updates)
          .eq('id', roomId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        if (!roomId || roomId === 'rooms-crud') {
          throw new Error('Room ID is required for deletion');
        }

        const { error } = await supabaseClient
          .from('rooms')
          .delete()
          .eq('id', roomId);

        if (error) throw error;

        return new Response(JSON.stringify({ message: 'Room deleted successfully' }), {
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
    console.error('Error in rooms-crud function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});