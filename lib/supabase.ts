import { createClient } from "@supabase/supabase-js"

// Verificar se estamos em ambiente de desenvolvimento/preview
const isDevelopment = process.env.NODE_ENV === "development"
const isPreview = typeof window !== "undefined" && isDevelopment

// Função para validar URL
function validateUrl(url?: string): string | null {
  if (!url || url.startsWith("your_") || url === "https://your-project-ref.supabase.co") {
    return null
  }
  try {
    new URL(url)
    return url
  } catch {
    return null
  }
}

// Função para validar chave
function validateKey(key?: string): string | null {
  if (!key || key.startsWith("your_") || key.length < 20) {
    return null
  }
  return key
}

// Obter variáveis de ambiente
const supabaseUrl = validateUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = validateKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Criar cliente Supabase ou null se não configurado
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Flag para indicar se Supabase está configurado
export const isSupabaseConfigured = supabase !== null

// Log de status
if (isPreview) {
  if (isSupabaseConfigured) {
    console.log("✅ Supabase configurado e conectado")
  } else {
    console.log("⚠️ Supabase não configurado - usando dados simulados")
  }
}

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          current_stock: number
          min_stock: number
          max_stock: number
          unit: string
          cost_per_unit: number
          supplier: string
          last_restocked: string
          expiry_date: string | null
          sku: string
          location: string
          barcode: string | null
          description: string | null
          image: string | null
          reorder_point: number
          lead_time: number
          avg_daily_usage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          current_stock: number
          min_stock: number
          max_stock: number
          unit: string
          cost_per_unit: number
          supplier: string
          last_restocked: string
          expiry_date?: string | null
          sku: string
          location: string
          barcode?: string | null
          description?: string | null
          image?: string | null
          reorder_point: number
          lead_time: number
          avg_daily_usage: number
        }
        Update: {
          id?: string
          name?: string
          category?: string
          current_stock?: number
          min_stock?: number
          max_stock?: number
          unit?: string
          cost_per_unit?: number
          supplier?: string
          last_restocked?: string
          expiry_date?: string | null
          sku?: string
          location?: string
          barcode?: string | null
          description?: string | null
          image?: string | null
          reorder_point?: number
          lead_time?: number
          avg_daily_usage?: number
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact: string
          email: string
          phone: string
          address: string
          rating: number
          total_orders: number
          last_order_date: string
          payment_terms: string
          delivery_time: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact: string
          email: string
          phone: string
          address: string
          rating?: number
          total_orders?: number
          last_order_date?: string
          payment_terms: string
          delivery_time: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          contact?: string
          email?: string
          phone?: string
          address?: string
          rating?: number
          total_orders?: number
          last_order_date?: string
          payment_terms?: string
          delivery_time?: number
          is_active?: boolean
        }
      }
      purchase_orders: {
        Row: {
          id: string
          supplier: string
          items: any
          total_amount: number
          status: string
          order_date: string
          expected_delivery: string
          actual_delivery: string | null
          notes: string | null
          priority: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier: string
          items: any
          total_amount: number
          status: string
          order_date: string
          expected_delivery: string
          actual_delivery?: string | null
          notes?: string | null
          priority: string
          created_by: string
        }
        Update: {
          id?: string
          supplier?: string
          items?: any
          total_amount?: number
          status?: string
          order_date?: string
          expected_delivery?: string
          actual_delivery?: string | null
          notes?: string | null
          priority?: string
          created_by?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          item_id: string
          item_name: string
          type: string
          quantity: number
          reason: string
          date: string
          user: string
          reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          item_name: string
          type: string
          quantity: number
          reason: string
          date: string
          user: string
          reference?: string | null
        }
        Update: {
          id?: string
          item_id?: string
          item_name?: string
          type?: string
          quantity?: number
          reason?: string
          date?: string
          user?: string
          reference?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          date: string
          read: boolean
          priority: string
          action_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          message: string
          date: string
          read?: boolean
          priority: string
          action_required?: boolean
        }
        Update: {
          id?: string
          type?: string
          title?: string
          message?: string
          date?: string
          read?: boolean
          priority?: string
          action_required?: boolean
        }
      }
    }
  }
}
