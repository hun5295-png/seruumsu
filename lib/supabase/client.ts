import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// 관리자용 클라이언트 (서버 사이드에서만 사용)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 데이터베이스 연결 테스트 함수
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('count(*)')
      .limit(1)

    if (error) {
      throw error
    }

    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    return {
      success: false,
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// 실시간 구독을 위한 헬퍼 함수
export function subscribeToTable(
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: string
) {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      callback
    )
    .subscribe()

  return channel
}

// 페이지네이션 헬퍼
export interface PaginationOptions {
  page: number
  pageSize: number
  orderBy?: string
  ascending?: boolean
}

export async function paginatedQuery<T>(
  query: any,
  options: PaginationOptions
) {
  const { page, pageSize, orderBy, ascending = true } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let modifiedQuery = query.range(from, to)

  if (orderBy) {
    modifiedQuery = modifiedQuery.order(orderBy, { ascending })
  }

  const { data, error, count } = await modifiedQuery

  if (error) {
    throw error
  }

  return {
    data: data as T[],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    pageSize
  }
}

export default supabase