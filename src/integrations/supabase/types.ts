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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          profile_image_url: string | null
          resume_url: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          admin_id: string
          certificate_image_url: string | null
          certificate_name: string
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          featured: boolean | null
          id: string
          issue_date: string
          issuing_organization: string
          order_index: number | null
          skills_demonstrated: string[] | null
          updated_at: string
        }
        Insert: {
          admin_id: string
          certificate_image_url?: string | null
          certificate_name: string
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          issue_date: string
          issuing_organization: string
          order_index?: number | null
          skills_demonstrated?: string[] | null
          updated_at?: string
        }
        Update: {
          admin_id?: string
          certificate_image_url?: string | null
          certificate_name?: string
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          issue_date?: string
          issuing_organization?: string
          order_index?: number | null
          skills_demonstrated?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          responded_at: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          subject?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          admin_id: string
          created_at: string
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution_name: string
          order_index: number | null
          start_date: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name: string
          order_index?: number | null
          start_date: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name?: string
          order_index?: number | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_admin_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      media_gallery: {
        Row: {
          admin_id: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          media_type: string
          media_url: string
          order_index: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          media_type: string
          media_url: string
          order_index?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          media_type?: string
          media_url?: string
          order_index?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string | null
          id: string
          service_description: string | null
          service_type: string
          status: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          id?: string
          service_description?: string | null
          service_type: string
          status: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          id?: string
          service_description?: string | null
          service_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          admin_id: string
          created_at: string
          demo_link: string | null
          description: string
          end_date: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          order_index: number | null
          repo_link: string | null
          start_date: string | null
          status: string | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          demo_link?: string | null
          description: string
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          repo_link?: string | null
          start_date?: string | null
          status?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          demo_link?: string | null
          description?: string
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          repo_link?: string | null
          start_date?: string | null
          status?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_projects_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_admin_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          demo_link: string | null
          description: string
          id: string
          image_url: string | null
          published_at: string | null
          repo_link: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          technologies: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          demo_link?: string | null
          description: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          repo_link?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          technologies?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          demo_link?: string | null
          description?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          repo_link?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          admin_id: string
          category: string
          created_at: string
          id: string
          order_index: number | null
          proficiency_level: number | null
          skill_name: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          category: string
          created_at?: string
          id?: string
          order_index?: number | null
          proficiency_level?: number | null
          skill_name: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          category?: string
          created_at?: string
          id?: string
          order_index?: number | null
          proficiency_level?: number | null
          skill_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skills_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_admin_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          admin_id: string
          client_company: string | null
          client_image_url: string | null
          client_name: string
          client_title: string | null
          created_at: string
          featured: boolean | null
          id: string
          order_index: number | null
          rating: number | null
          testimonial_text: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          client_company?: string | null
          client_image_url?: string | null
          client_name: string
          client_title?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          order_index?: number | null
          rating?: number | null
          testimonial_text: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          client_company?: string | null
          client_image_url?: string | null
          client_name?: string
          client_title?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          order_index?: number | null
          rating?: number | null
          testimonial_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      work_experiences: {
        Row: {
          admin_id: string
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          order_index: number | null
          position: string
          start_date: string
          technologies: string[] | null
          updated_at: string
        }
        Insert: {
          admin_id: string
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_index?: number | null
          position: string
          start_date: string
          technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          admin_id?: string
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_index?: number | null
          position?: string
          start_date?: string
          technologies?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_experiences_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_experiences_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_admin_profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_admin_profile: {
        Row: {
          bio: string | null
          created_at: string | null
          full_name: string | null
          github_url: string | null
          id: string | null
          linkedin_url: string | null
          location: string | null
          profile_image_url: string | null
          title: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_image_url?: string | null
          title?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_image_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      contact_status: "unread" | "read" | "responded"
      project_status: "draft" | "published"
      user_role: "admin" | "user"
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
      contact_status: ["unread", "read", "responded"],
      project_status: ["draft", "published"],
      user_role: ["admin", "user"],
    },
  },
} as const
