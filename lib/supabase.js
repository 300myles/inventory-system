import { createClient } from "@supabase/supabase-js"

// Verificar se estamos em ambiente de desenvolvimento/preview
const isDevelopment = process.env.NODE_ENV === "development"
const isPreview = typeof window !== "undefined" && isDevelopment

// Função para validar URL
function validateUrl(url) {
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
function validateKey(key) {
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

// The database schema types have been removed as they're not needed in JavaScript
// The Supabase client will still work with the same database structure
