export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      case_studies_en: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          content: string
          image_url: string
          slug: string
          tags: string[]
          published: boolean
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          content: string
          image_url: string
          slug: string
          tags?: string[]
          published?: boolean
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          content?: string
          image_url?: string
          slug?: string
          tags?: string[]
          published?: boolean
          order?: number
        }
      }
      case_studies_pl: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          content: string
          image_url: string
          slug: string
          tags: string[]
          published: boolean
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          content: string
          image_url: string
          slug: string
          tags?: string[]
          published?: boolean
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          content?: string
          image_url?: string
          slug?: string
          tags?: string[]
          published?: boolean
          order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 