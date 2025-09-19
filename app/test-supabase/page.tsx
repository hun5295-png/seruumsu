'use client'

import React, { useState, useEffect } from 'react'
import { supabase, testConnection } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { SupabaseDataProvider, useSupabaseData } from '@/lib/context/SupabaseDataContext'
import { DataMigrationService, MigrationProgress, MigrationResult } from '@/lib/migration/migrate'
import toast, { Toaster } from 'react-hot-toast'

interface TestResult {
  test: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

// 테스트 컴포넌트 (SupabaseDataProvider 내부)
const TestSupabaseInner: React.FC = () => {
  const {
    patients,
    appointments,
    revenues,
    coupons,
    addPatient,
    addAppointment,
    addRevenue,
    addCoupon,
    isOnline,
    lastSync,
    syncToSupabase,
    clearCache
  } = useSupabaseData()

  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)

  const updateTestResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.test === test)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.data = data
        return [...prev]
      } else {
        return [...prev, { test, status, message, data }]
      }
    })
  }

  const runConnectionTest = async () => {
    updateTestResult('연결 테스트', 'pending', '테스트 중...')
    try {
      const result = await testConnection()
      if (result.success) {
        updateTestResult('연결 테스트', 'success', result.message)
      } else {
        updateTestResult('연결 테스트', 'error', result.message)
      }
    } catch (error) {
      updateTestResult('연결 테스트', 'error', `연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  const runCRUDTests = async () => {
    updateTestResult('CRUD 테스트', 'pending', '테스트 중...')

    try {
      // 1. 환자 추가 테스트
      const testPatient = await addPatient({
        name: '테스트 환자',
        phone: `010-test-${Date.now()}`,
        email: 'test@example.com',
        birthDate: '1990-01-01',
        registrationDate: new Date().toISOString().split('T')[0],
        lastVisit: '',
        totalVisits: 0,
        totalSpent: 0,
        favoriteServices: [],
        status: 'active',
        membership: 'basic'
      })

      // 2. 예약 추가 테스트
      const testAppointment = await addAppointment({
        patientId: testPatient.id,
        patientName: testPatient.name,
        phone: testPatient.phone,
        serviceId: 'vita-basic',
        serviceName: '비타민 기본',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: 30,
        price: 15000,
        status: 'confirmed',
        packageType: 'single',
        paymentStatus: 'pending'
      })

      // 3. 매출 추가 테스트
      await addRevenue({
        date: new Date().toISOString().split('T')[0],
        ivRevenue: 15000,
        endoscopyRevenue: 0,
        totalRevenue: 15000,
        serviceDetails: [{
          serviceId: 'vita-basic',
          count: 1,
          revenue: 15000
        }]
      })

      // 4. 쿠폰 추가 테스트
      const testCoupon = await addCoupon({
        code: `TEST${Date.now()}`,
        discount: 10,
        discountType: 'percentage',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageCount: 0,
        maxUsage: 100,
        isActive: true
      })

      updateTestResult('CRUD 테스트', 'success', `모든 CRUD 작업 성공. 환자: ${testPatient.name}, 예약: ${testAppointment.id}, 쿠폰: ${testCoupon.code}`)

    } catch (error) {
      updateTestResult('CRUD 테스트', 'error', `CRUD 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  const runRealtimeTest = async () => {
    updateTestResult('실시간 구독 테스트', 'pending', '구독 설정 중...')

    try {
      const channel = supabase
        .channel('test-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'patients'
          },
          (payload) => {
            updateTestResult('실시간 구독 테스트', 'success', `실시간 데이터 수신 성공: ${payload.new?.name}`, payload)
          }
        )
        .subscribe()

      // 3초 후 구독 해제
      setTimeout(() => {
        channel.unsubscribe()
        updateTestResult('실시간 구독 테스트', 'success', '실시간 구독 테스트 완료')
      }, 3000)

    } catch (error) {
      updateTestResult('실시간 구독 테스트', 'error', `실시간 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  const runDataMigrationTest = async () => {
    setMigrationProgress(null)
    setMigrationResult(null)

    try {
      const migration = new DataMigrationService((progress) => {
        setMigrationProgress(progress)
      })

      const result = await migration.migrateToSupabase()
      setMigrationResult(result)

      if (result.success) {
        toast.success('마이그레이션이 성공적으로 완료되었습니다!')
      } else {
        toast.error('마이그레이션 중 오류가 발생했습니다.')
      }

    } catch (error) {
      toast.error(`마이그레이션 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])

    await runConnectionTest()
    await runCRUDTests()
    await runRealtimeTest()

    setIsLoading(false)
  }

  const renderTestResult = (result: TestResult) => {
    const statusColor = {
      pending: 'text-yellow-600 bg-yellow-50',
      success: 'text-green-600 bg-green-50',
      error: 'text-red-600 bg-red-50'
    }[result.status]

    const statusIcon = {
      pending: '⏳',
      success: '✅',
      error: '❌'
    }[result.status]

    return (
      <div key={result.test} className={`p-4 rounded-lg border ${statusColor}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {statusIcon} {result.test}
          </h3>
          <span className="text-sm font-medium uppercase">{result.status}</span>
        </div>
        <p className="mt-2 text-sm">{result.message}</p>
        {result.data && (
          <details className="mt-2">
            <summary className="text-sm font-medium cursor-pointer">데이터 보기</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase 연결 테스트</h1>
        <p className="text-gray-600">
          Supabase 데이터베이스 연결, CRUD 작업, 실시간 구독을 테스트합니다.
        </p>
      </div>

      {/* 연결 상태 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">연결 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 온라인' : '🔴 오프라인'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">마지막 동기화</div>
            <div className="font-medium">
              {lastSync ? new Date(lastSync).toLocaleString() : '없음'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">캐시된 데이터</div>
            <div className="font-medium">
              환자 {patients.length}, 예약 {appointments.length}, 매출 {revenues.length}
            </div>
          </div>
        </div>
      </div>

      {/* 테스트 실행 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">테스트 실행</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '테스트 중...' : '모든 테스트 실행'}
          </button>
          <button
            onClick={runConnectionTest}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            연결 테스트
          </button>
          <button
            onClick={runCRUDTests}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            CRUD 테스트
          </button>
          <button
            onClick={runRealtimeTest}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            실시간 테스트
          </button>
          <button
            onClick={syncToSupabase}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            수동 동기화
          </button>
          <button
            onClick={clearCache}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            캐시 클리어
          </button>
        </div>
      </div>

      {/* 테스트 결과 */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">테스트 결과</h2>
          <div className="space-y-4">
            {testResults.map(renderTestResult)}
          </div>
        </div>
      )}

      {/* 마이그레이션 도구 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">데이터 마이그레이션</h2>
        <p className="text-gray-600 mb-4">
          localStorage의 기존 데이터를 Supabase로 마이그레이션합니다.
        </p>

        <button
          onClick={runDataMigrationTest}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 mb-4"
        >
          마이그레이션 실행
        </button>

        {migrationProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>진행상황: {migrationProgress.current}</span>
              <span>{migrationProgress.completed}/{migrationProgress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${migrationProgress.total > 0 ? (migrationProgress.completed / migrationProgress.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {migrationResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">마이그레이션 결과</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>환자: {migrationResult.migrated.patients}</div>
              <div>예약: {migrationResult.migrated.appointments}</div>
              <div>매출: {migrationResult.migrated.revenues}</div>
              <div>일일서비스: {migrationResult.migrated.dailyServices}</div>
              <div>쿠폰: {migrationResult.migrated.coupons}</div>
              <div>패키지: {migrationResult.migrated.packages}</div>
            </div>
            {migrationResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-600">오류:</h4>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {migrationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 직접 SQL 테스트 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">직접 쿼리 테스트</h2>
        <div className="space-y-4">
          <button
            onClick={async () => {
              try {
                const { data, error } = await supabase
                  .from('services')
                  .select('*')
                  .limit(5)

                if (error) throw error

                updateTestResult('서비스 조회', 'success', `${data.length}개 서비스 조회 성공`, data)
              } catch (error) {
                updateTestResult('서비스 조회', 'error', `서비스 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            서비스 목록 조회
          </button>

          <button
            onClick={async () => {
              try {
                const { data, error } = await supabase
                  .from('patients')
                  .select('count')

                if (error) throw error

                updateTestResult('환자 수 조회', 'success', `총 환자 수: ${data[0]?.count || 0}`, data)
              } catch (error) {
                updateTestResult('환자 수 조회', 'error', `환자 수 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            환자 수 조회
          </button>
        </div>
      </div>

      {/* 환경 변수 확인 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">환경 설정 확인</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Supabase URL:</div>
            <div className="text-gray-600 break-all">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 미설정'}
            </div>
          </div>
          <div>
            <div className="font-medium">Anon Key:</div>
            <div className="text-gray-600">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 미설정'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 메인 테스트 페이지 컴포넌트
const TestSupabasePage: React.FC = () => {
  return (
    <SupabaseDataProvider>
      <TestSupabaseInner />
      <Toaster position="top-right" />
    </SupabaseDataProvider>
  )
}

export default TestSupabasePage