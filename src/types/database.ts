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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      impact_snapshots: {
        Row: {
          created_at: string
          metrics: Json
          month: string
        }
        Insert: {
          created_at?: string
          metrics: Json
          month: string
        }
        Update: {
          created_at?: string
          metrics?: Json
          month?: string
        }
        Relationships: []
      }
      learning_events: {
        Row: {
          id: string
          learner_id: string
          lesson_id: string
          lesson_version: number
          occurred_at: string
          offline: boolean
          received_at: string
          verb: string
        }
        Insert: {
          id: string
          learner_id: string
          lesson_id: string
          lesson_version: number
          occurred_at: string
          offline?: boolean
          received_at?: string
          verb: string
        }
        Update: {
          id?: string
          learner_id?: string
          lesson_id?: string
          lesson_version?: number
          occurred_at?: string
          offline?: boolean
          received_at?: string
          verb?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_events_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_events_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          active_seconds: number
          attempts: Json
          completed_at: string | null
          learner_id: string
          lesson_id: string
          lesson_version: number
          started_at: string
          status: string
          steps_done: number
          updated_at: string
        }
        Insert: {
          active_seconds?: number
          attempts?: Json
          completed_at?: string | null
          learner_id: string
          lesson_id: string
          lesson_version: number
          started_at?: string
          status: string
          steps_done?: number
          updated_at?: string
        }
        Update: {
          active_seconds?: number
          attempts?: Json
          completed_at?: string | null
          learner_id?: string
          lesson_id?: string
          lesson_version?: number
          started_at?: string
          status?: string
          steps_done?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          bytes: number
          description: string
          free: boolean
          hash: string
          id: string
          lesson: number
          minutes: number
          module: number
          pack_path: string
          published_at: string
          slug: string
          steps: number
          title: string
          track_slug: string
          version: number
        }
        Insert: {
          bytes: number
          description: string
          free?: boolean
          hash: string
          id: string
          lesson: number
          minutes: number
          module: number
          pack_path: string
          published_at?: string
          slug: string
          steps: number
          title: string
          track_slug: string
          version: number
        }
        Update: {
          bytes?: number
          description?: string
          free?: boolean
          hash?: string
          id?: string
          lesson?: number
          minutes?: number
          module?: number
          pack_path?: string
          published_at?: string
          slug?: string
          steps?: number
          title?: string
          track_slug?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_track_slug_fkey"
            columns: ["track_slug"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          country_code: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          position: number
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          position: number
          slug: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          position?: number
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      impact_countries: {
        Args: never
        Returns: {
          active_learners_28d: number
          country_code: string
          learners: number
        }[]
      }
      impact_summary: { Args: never; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      record_progress: {
        Args: {
          p_active_seconds: number
          p_attempts: Json
          p_event_id: string
          p_lesson_id: string
          p_lesson_version: number
          p_occurred_at: string
          p_offline?: boolean
          p_steps_done: number
          p_verb: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
