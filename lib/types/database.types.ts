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
      services: {
        Row: {
          id: string
          name: string
          category: string
          duration: number
          base_price: number
          description: string
          effects: string
          package_4_price: number
          package_8_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          duration: number
          base_price: number
          description?: string
          effects?: string
          package_4_price?: number
          package_8_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          duration?: number
          base_price?: number
          description?: string
          effects?: string
          package_4_price?: number
          package_8_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      daily_usage: {
        Row: {
          id: string
          date: string
          service_id: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          service_id: string
          count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          service_id?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
      }
      revenue: {
        Row: {
          id: string
          date: string
          iv_center_revenue: number
          endoscopy_revenue: number
          total_revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          iv_center_revenue: number
          endoscopy_revenue: number
          total_revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          iv_center_revenue?: number
          endoscopy_revenue?: number
          total_revenue?: number
          created_at?: string
          updated_at?: string
        }
      }
      marketing_sources: {
        Row: {
          id: string
          date: string
          source: string
          customer_count: number
          revenue_contribution: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          source: string
          customer_count: number
          revenue_contribution?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          source?: string
          customer_count?: number
          revenue_contribution?: number
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          type: 'vip' | 'birthday' | 'free'
          issuer_name: string
          issued_to: string
          patient_id: string | null
          service_id: string | null
          discount_percentage: number
          is_used: boolean
          used_at: string | null
          valid_until: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'vip' | 'birthday' | 'free'
          issuer_name: string
          issued_to: string
          patient_id?: string | null
          service_id?: string | null
          discount_percentage: number
          is_used?: boolean
          used_at?: string | null
          valid_until: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'vip' | 'birthday' | 'free'
          issuer_name?: string
          issued_to?: string
          patient_id?: string | null
          service_id?: string | null
          discount_percentage?: number
          is_used?: boolean
          used_at?: string | null
          valid_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          phone: string
          birth_date: string | null
          email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          birth_date?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          birth_date?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          service_id: string
          appointment_date: string
          status: 'scheduled' | 'completed' | 'cancelled'
          package_type: 'single' | '4_sessions' | '8_sessions' | null
          add_ons: Json | null
          final_price: number
          discount_amount: number
          coupon_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          service_id: string
          appointment_date: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          package_type?: 'single' | '4_sessions' | '8_sessions' | null
          add_ons?: Json | null
          final_price: number
          discount_amount?: number
          coupon_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          service_id?: string
          appointment_date?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          package_type?: 'single' | '4_sessions' | '8_sessions' | null
          add_ons?: Json | null
          final_price?: number
          discount_amount?: number
          coupon_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'manager' | 'staff'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: 'admin' | 'manager' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'manager' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
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