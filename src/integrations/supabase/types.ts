export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      constraints: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_sections: {
        Row: {
          class_type: Database["public"]["Enums"]["class_type"]
          course_id: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          max_students: number
          section_name: string
          updated_at: string | null
        }
        Insert: {
          class_type?: Database["public"]["Enums"]["class_type"]
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          max_students?: number
          section_name: string
          updated_at?: string | null
        }
        Update: {
          class_type?: Database["public"]["Enums"]["class_type"]
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          max_students?: number
          section_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string | null
          credits: number
          id: string
          name: string
          program_id: string | null
          semester: number
          semester_type: Database["public"]["Enums"]["semester_type"]
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number
          id?: string
          name: string
          program_id?: string | null
          semester: number
          semester_type?: Database["public"]["Enums"]["semester_type"]
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number
          id?: string
          name?: string
          program_id?: string | null
          semester?: number
          semester_type?: Database["public"]["Enums"]["semester_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_section_id: string | null
          enrolled_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          course_section_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          course_section_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_section_id_fkey"
            columns: ["course_section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          created_at: string | null
          department: string
          email: string
          employee_id: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          employee_id: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          employee_id?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faculty_assignments: {
        Row: {
          assigned_at: string | null
          course_section_id: string | null
          faculty_id: string | null
          id: string
        }
        Insert: {
          assigned_at?: string | null
          course_section_id?: string | null
          faculty_id?: string | null
          id?: string
        }
        Update: {
          assigned_at?: string | null
          course_section_id?: string | null
          faculty_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_assignments_course_section_id_fkey"
            columns: ["course_section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          code: string
          created_at: string | null
          duration_years: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          duration_years?: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          duration_years?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number
          code: string
          created_at: string | null
          floor: number | null
          id: string
          name: string
          room_type: string
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          capacity?: number
          code: string
          created_at?: string | null
          floor?: number | null
          id?: string
          name: string
          room_type?: string
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number
          code?: string
          created_at?: string | null
          floor?: number | null
          id?: string
          name?: string
          room_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_classes: {
        Row: {
          academic_year: number
          course_section_id: string | null
          created_at: string | null
          faculty_id: string | null
          id: string
          room_id: string | null
          semester: number
          semester_type: Database["public"]["Enums"]["semester_type"]
          timeslot_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year: number
          course_section_id?: string | null
          created_at?: string | null
          faculty_id?: string | null
          id?: string
          room_id?: string | null
          semester: number
          semester_type: Database["public"]["Enums"]["semester_type"]
          timeslot_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: number
          course_section_id?: string | null
          created_at?: string | null
          faculty_id?: string | null
          id?: string
          room_id?: string | null
          semester?: number
          semester_type?: Database["public"]["Enums"]["semester_type"]
          timeslot_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_classes_course_section_id_fkey"
            columns: ["course_section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_classes_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_classes_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_classes_timeslot_id_fkey"
            columns: ["timeslot_id"]
            isOneToOne: false
            referencedRelation: "timeslots"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          current_semester: number
          email: string
          id: string
          name: string
          program_id: string | null
          roll_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_semester?: number
          email: string
          id?: string
          name: string
          program_id?: string | null
          roll_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_semester?: number
          email?: string
          id?: string
          name?: string
          program_id?: string | null
          roll_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      timeslots: {
        Row: {
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id: string
          slot_number: number
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id?: string
          slot_number: number
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          end_time?: string
          id?: string
          slot_number?: number
          start_time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_faculty: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      class_type: "lecture" | "lab" | "tutorial" | "practical"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      semester_type: "odd" | "even" | "summer"
      user_role: "admin" | "faculty" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_type: ["lecture", "lab", "tutorial", "practical"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      semester_type: ["odd", "even", "summer"],
      user_role: ["admin", "faculty", "student"],
    },
  },
} as const
