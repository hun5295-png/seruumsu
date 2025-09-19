import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Supabase 연결 테스트
    const dbResult = await testConnection()

    // 시스템 상태 체크
    const status = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      database: dbResult.success ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      }
    }

    return NextResponse.json(status, {
      status: dbResult.success ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}