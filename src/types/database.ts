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
      enrollments: {
        Row: {
          enrolled_at: string
          learner_id: string
          track_slug: string
        }
        Insert: {
          enrolled_at?: string
          learner_id: string
          track_slug: string
        }
        Update: {
          enrolled_at?: string
          learner_id?: string
          track_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_track_slug_fkey"
            columns: ["track_slug"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["slug"]
          },
        ]
      }
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
      lesson_cards: {
        Row: {
          back: string
          front: string
          id: string
          lesson_id: string
          position: number
        }
        Insert: {
          back: string
          front: string
          id: string
          lesson_id: string
          position: number
        }
        Update: {
          back?: string
          front?: string
          id?: string
          lesson_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_cards_lesson_id_fkey"
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
      memberships: {
        Row: {
          billing: string | null
          created_at: string
          current_period_end: string | null
          learner_id: string
          plan: string
          provider_customer: string | null
          provider_subscription: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          billing?: string | null
          created_at?: string
          current_period_end?: string | null
          learner_id: string
          plan?: string
          provider_customer?: string | null
          provider_subscription?: string | null
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing?: string | null
          created_at?: string
          current_period_end?: string | null
          learner_id?: string
          plan?: string
          provider_customer?: string | null
          provider_subscription?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          billing: string
          channel: string | null
          created_at: string
          currency: string
          learner_id: string
          paid_at: string
          reference: string
        }
        Insert: {
          amount: number
          billing: string
          channel?: string | null
          created_at?: string
          currency: string
          learner_id: string
          paid_at: string
          reference: string
        }
        Update: {
          amount?: number
          billing?: string
          channel?: string | null
          created_at?: string
          currency?: string
          learner_id?: string
          paid_at?: string
          reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
      project_work: {
        Row: {
          files: Json
          learner_id: string
          passed_at: string | null
          project_id: string
          project_version: number
          results: Json | null
          review: Json | null
          site_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          files?: Json
          learner_id: string
          passed_at?: string | null
          project_id: string
          project_version: number
          results?: Json | null
          review?: Json | null
          site_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          files?: Json
          learner_id?: string
          passed_at?: string | null
          project_id?: string
          project_version?: number
          results?: Json | null
          review?: Json | null
          site_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_work_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_work_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          bytes: number
          checks: number
          description: string
          free: boolean
          hash: string
          id: string
          module: number
          needs_site: boolean
          pack_path: string
          published_at: string
          slug: string
          title: string
          track_slug: string
          version: number
        }
        Insert: {
          bytes: number
          checks: number
          description: string
          free?: boolean
          hash: string
          id: string
          module: number
          needs_site?: boolean
          pack_path: string
          published_at?: string
          slug: string
          title: string
          track_slug: string
          version: number
        }
        Update: {
          bytes?: number
          checks?: number
          description?: string
          free?: boolean
          hash?: string
          id?: string
          module?: number
          needs_site?: boolean
          pack_path?: string
          published_at?: string
          slug?: string
          title?: string
          track_slug?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_track_slug_fkey"
            columns: ["track_slug"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["slug"]
          },
        ]
      }
      review_cards: {
        Row: {
          card_id: string
          created_at: string
          difficulty: number
          due: string
          elapsed_days: number
          lapses: number
          last_review: string | null
          learner_id: string
          learning_steps: number
          reps: number
          scheduled_days: number
          stability: number
          state: number
        }
        Insert: {
          card_id: string
          created_at?: string
          difficulty?: number
          due?: string
          elapsed_days?: number
          lapses?: number
          last_review?: string | null
          learner_id: string
          learning_steps?: number
          reps?: number
          scheduled_days?: number
          stability?: number
          state?: number
        }
        Update: {
          card_id?: string
          created_at?: string
          difficulty?: number
          due?: string
          elapsed_days?: number
          lapses?: number
          last_review?: string | null
          learner_id?: string
          learning_steps?: number
          reps?: number
          scheduled_days?: number
          stability?: number
          state?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "lesson_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_cards_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_log: {
        Row: {
          card_id: string
          id: number
          learner_id: string
          rating: number
          reviewed_at: string
        }
        Insert: {
          card_id: string
          id?: never
          learner_id: string
          rating: number
          reviewed_at?: string
        }
        Update: {
          card_id?: string
          id?: never
          learner_id?: string
          rating?: number
          reviewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_log_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "lesson_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_log_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      tutor_questions: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          learner_id: string
          lesson_id: string
          question: string
          step: number
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          learner_id: string
          lesson_id: string
          question: string
          step: number
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          learner_id?: string
          lesson_id?: string
          question?: string
          step?: number
        }
        Relationships: [
          {
            foreignKeyName: "tutor_questions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      is_pro: { Args: never; Returns: boolean }
      pass_project: {
        Args: { p_project: string; p_results: Json; p_review: Json }
        Returns: undefined
      }
      record_payment: {
        Args: {
          p_amount: number
          p_billing: string
          p_channel: string | null
          p_currency: string
          p_customer: string | null
          p_learner: string
          p_paid_at: string
          p_reference: string
        }
        Returns: string | null
      }
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
      tutor_claim: {
        Args: { p_lesson: string; p_question: string; p_step: number }
        Returns: Json
      }
      tutor_daily_cap: { Args: never; Returns: number }
      tutor_quota: { Args: never; Returns: Json }
      tutor_settle: {
        Args: { p_answer: string | null; p_id: string }
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
