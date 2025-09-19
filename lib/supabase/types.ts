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
      patients: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          birth_date: string | null
          registration_date: string
          last_visit: string | null
          total_visits: number
          total_spent: number
          favorite_services: string[] | null
          notes: string | null
          status: 'active' | 'inactive'
          membership: 'basic' | 'silver' | 'gold' | 'vip'
          visit_source: '검색' | '직원소개' | '원내광고' | '이벤트메세지' | '내시경실' | '진료' | '지인소개' | '기타' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          birth_date?: string | null
          registration_date?: string
          last_visit?: string | null
          total_visits?: number
          total_spent?: number
          favorite_services?: string[] | null
          notes?: string | null
          status?: 'active' | 'inactive'
          membership?: 'basic' | 'silver' | 'gold' | 'vip'
          visit_source?: '검색' | '직원소개' | '원내광고' | '이벤트메세지' | '내시경실' | '진료' | '지인소개' | '기타' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          birth_date?: string | null
          registration_date?: string
          last_visit?: string | null
          total_visits?: number
          total_spent?: number
          favorite_services?: string[] | null
          notes?: string | null
          status?: 'active' | 'inactive'
          membership?: 'basic' | 'silver' | 'gold' | 'vip'
          visit_source?: '검색' | '직원소개' | '원내광고' | '이벤트메세지' | '내시경실' | '진료' | '지인소개' | '기타' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          category: string
          duration: number
          base_price: number
          package_4_price: number | null
          package_8_price: number | null
          package_10_price: number | null
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          duration?: number
          base_price: number
          package_4_price?: number | null
          package_8_price?: number | null
          package_10_price?: number | null
          description?: string | null
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
          package_4_price?: number | null
          package_8_price?: number | null
          package_10_price?: number | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          patient_name: string
          phone: string
          service_id: string
          service_name: string
          appointment_date: string
          appointment_time: string
          duration: number
          price: number
          status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
          notes: string | null
          addon_백옥: boolean
          addon_백옥더블: boolean
          addon_가슴샘: boolean
          addon_강력주사: boolean
          package_type: 'single' | '4times' | '8times' | '10times'
          payment_status: 'pending' | 'paid'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          patient_name: string
          phone: string
          service_id: string
          service_name: string
          appointment_date: string
          appointment_time: string
          duration?: number
          price: number
          status?: 'confirmed' | 'pending' | 'cancelled' | 'completed'
          notes?: string | null
          addon_백옥?: boolean
          addon_백옥더블?: boolean
          addon_가슴샘?: boolean
          addon_강력주사?: boolean
          package_type?: 'single' | '4times' | '8times' | '10times'
          payment_status?: 'pending' | 'paid'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          patient_name?: string
          phone?: string
          service_id?: string
          service_name?: string
          appointment_date?: string
          appointment_time?: string
          duration?: number
          price?: number
          status?: 'confirmed' | 'pending' | 'cancelled' | 'completed'
          notes?: string | null
          addon_백옥?: boolean
          addon_백옥더블?: boolean
          addon_가슴샘?: boolean
          addon_강력주사?: boolean
          package_type?: 'single' | '4times' | '8times' | '10times'
          payment_status?: 'pending' | 'paid'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      packages: {
        Row: {
          id: string
          patient_id: string
          service_id: string
          service_name: string
          total_count: number
          remaining_count: number
          purchase_date: string
          expiry_date: string | null
          purchase_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          service_id: string
          service_name: string
          total_count: number
          remaining_count: number
          purchase_date?: string
          expiry_date?: string | null
          purchase_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          service_id?: string
          service_name?: string
          total_count?: number
          remaining_count?: number
          purchase_date?: string
          expiry_date?: string | null
          purchase_price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      revenues: {
        Row: {
          id: string
          date: string
          iv_revenue: number
          endoscopy_revenue: number
          total_revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          iv_revenue?: number
          endoscopy_revenue?: number
          total_revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          iv_revenue?: number
          endoscopy_revenue?: number
          total_revenue?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      revenue_details: {
        Row: {
          id: string
          revenue_id: string
          service_id: string
          service_name: string
          count: number
          revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          revenue_id: string
          service_id: string
          service_name: string
          count?: number
          revenue?: number
          created_at?: string
        }
        Update: {
          id?: string
          revenue_id?: string
          service_id?: string
          service_name?: string
          count?: number
          revenue?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_details_revenue_id_fkey"
            columns: ["revenue_id"]
            referencedRelation: "revenues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_details_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_services: {
        Row: {
          id: string
          date: string
          service_id: string
          service_name: string
          count: number
          revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          service_id: string
          service_name: string
          count?: number
          revenue?: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          service_id?: string
          service_name?: string
          count?: number
          revenue?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_services_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount: number
          discount_type: 'percentage' | 'fixed'
          min_amount: number | null
          valid_from: string
          valid_until: string
          usage_count: number
          max_usage: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          discount: number
          discount_type?: 'percentage' | 'fixed'
          min_amount?: number | null
          valid_from: string
          valid_until: string
          usage_count?: number
          max_usage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount?: number
          discount_type?: 'percentage' | 'fixed'
          min_amount?: number | null
          valid_from?: string
          valid_until?: string
          usage_count?: number
          max_usage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_performance: {
        Row: {
          id: string
          date: string
          channel: string
          visits: number
          conversions: number
          cost: number
          revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          channel: string
          visits?: number
          conversions?: number
          cost?: number
          revenue?: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          channel?: string
          visits?: number
          conversions?: number
          cost?: number
          revenue?: number
          created_at?: string
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