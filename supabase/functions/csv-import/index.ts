import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportResult {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      if (values[index]) {
        // Convert numeric values
        if (!isNaN(Number(values[index])) && values[index] !== '') {
          row[header] = Number(values[index]);
        } else {
          row[header] = values[index];
        }
      }
    });
    
    rows.push(row);
  }
  
  return rows;
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

    const url = new URL(req.url);
    const importType = url.pathname.split('/').pop(); // students, faculty, or courses

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Only POST method allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const csvText = await file.text();
    const rows = parseCSV(csvText);

    const result: ImportResult = {
      success: true,
      total: rows.length,
      created: 0,
      failed: 0,
      errors: []
    };

    // Process each row based on import type
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        let tableName = '';
        let processedRow = { ...row };

        switch (importType) {
          case 'students':
            tableName = 'students';
            // Ensure required fields for students
            if (!processedRow.name || !processedRow.roll_number || !processedRow.email) {
              throw new Error('Missing required fields: name, roll_number, email');
            }
            break;

          case 'faculty':
            tableName = 'faculty';
            // Ensure required fields for faculty
            if (!processedRow.name || !processedRow.employee_id || !processedRow.email || !processedRow.department) {
              throw new Error('Missing required fields: name, employee_id, email, department');
            }
            break;

          case 'courses':
            tableName = 'courses';
            // Ensure required fields for courses
            if (!processedRow.name || !processedRow.code) {
              throw new Error('Missing required fields: name, code');
            }
            // Set defaults
            processedRow.credits = processedRow.credits || 3;
            processedRow.semester = processedRow.semester || 1;
            processedRow.semester_type = processedRow.semester_type || 'odd';
            break;

          default:
            throw new Error(`Invalid import type: ${importType}`);
        }

        const { error } = await supabaseClient
          .from(tableName)
          .insert([processedRow]);

        if (error) {
          throw error;
        }

        result.created++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          data: row,
          error: error.message
        });
      }
    }

    result.success = result.failed === 0;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in csv-import function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});