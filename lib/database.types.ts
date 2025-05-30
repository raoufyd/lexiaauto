export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          year: number
          price: number
          description: string
          phone_number: string
          condition: string
          mileage: number
          created_at: string | null
          updated_at: string | null
          category: string
          fuel_type: string
          transmission: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          model: string
          year: number
          price: number
          description: string
          phone_number: string
          condition: string
          mileage?: number
          created_at?: string | null
          updated_at?: string | null
          category?: string
          fuel_type?: string
          transmission?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          model?: string
          year?: number
          price?: number
          description?: string
          phone_number?: string
          condition?: string
          mileage?: number
          created_at?: string | null
          updated_at?: string | null
          category?: string
          fuel_type?: string
          transmission?: string
        }
        Relationships: []
      }
      car_images: {
        Row: {
          id: string
          car_id: string
          url: string
          created_at: string | null
        }
        Insert: {
          id?: string
          car_id: string
          url: string
          created_at?: string | null
        }
        Update: {
          id?: string
          car_id?: string
          url?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
