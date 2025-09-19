import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-anon-key' &&
         !supabaseUrl.includes('your-project-ref') &&
         !supabaseAnonKey.includes('your-anon-key')
}