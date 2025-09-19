'use client'

import { useState } from 'react'
import { useData } from '@/lib/context/DataContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ArrowUpCircle, Database, Check, X } from 'lucide-react'

export default function SyncDataPage() {
  const { patients, appointments, revenues } = useData()
  const [syncing, setSyncing] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const syncPatients = async () => {
    const results = []
    for (const patient of patients) {
      try {
        // UUID 변환 (localStorage의 timestamp ID를 UUID로)
        const patientData = {
          name: patient.name,
          phone: patient.phone,
          email: patient.email || null,
          birth_date: patient.birthDate || null,
          registration_date: patient.registrationDate,
          last_visit: patient.lastVisit || null,
          total_visits: patient.totalVisits,
          total_spent: patient.totalSpent,
          favorite_services: patient.favoriteServices || [],
          notes: patient.notes || null,
          status: patient.status,
          membership: patient.membership || 'basic',
          visit_source: patient.visitSource || null
        }

        const { data, error } = await supabase
          .from('patients')
          .upsert(patientData, { onConflict: 'phone' })
          .select()

        if (error) {
          results.push({ type: 'patient', name: patient.name, status: 'error', message: error.message })
        } else {
          results.push({ type: 'patient', name: patient.name, status: 'success' })
        }
      } catch (error: any) {
        results.push({ type: 'patient', name: patient.name, status: 'error', message: error.message })
      }
    }
    return results
  }

  const syncAppointments = async () => {
    const results = []

    // 먼저 환자 ID 매핑을 가져오기
    const { data: dbPatients } = await supabase
      .from('patients')
      .select('id, phone')

    const phoneToId = dbPatients?.reduce((acc: any, p: any) => {
      acc[p.phone] = p.id
      return acc
    }, {}) || {}

    for (const apt of appointments) {
      try {
        const patient = patients.find(p => p.id === apt.patientId)
        const patientUuid = patient ? phoneToId[patient.phone] : null

        if (!patientUuid) {
          results.push({
            type: 'appointment',
            name: `${apt.patientName} - ${apt.date}`,
            status: 'error',
            message: '환자를 찾을 수 없습니다'
          })
          continue
        }

        const appointmentData = {
          patient_id: patientUuid,
          patient_name: apt.patientName,
          phone: apt.phone,
          service_id: apt.serviceId,
          service_name: apt.serviceName,
          appointment_date: apt.date,
          appointment_time: apt.time,
          duration: apt.duration,
          price: apt.price,
          status: apt.status,
          notes: apt.notes || null,
          addon_백옥: apt.addOns?.백옥 || false,
          addon_백옥더블: apt.addOns?.백옥더블 || false,
          addon_가슴샘: apt.addOns?.가슴샘 || false,
          addon_강력주사: apt.addOns?.강력주사 || false,
          package_type: apt.packageType || 'single',
          payment_status: apt.paymentStatus || 'pending'
        }

        const { error } = await supabase
          .from('appointments')
          .insert(appointmentData)

        if (error) {
          results.push({
            type: 'appointment',
            name: `${apt.patientName} - ${apt.date}`,
            status: 'error',
            message: error.message
          })
        } else {
          results.push({
            type: 'appointment',
            name: `${apt.patientName} - ${apt.date}`,
            status: 'success'
          })
        }
      } catch (error: any) {
        results.push({
          type: 'appointment',
          name: `${apt.patientName} - ${apt.date}`,
          status: 'error',
          message: error.message
        })
      }
    }
    return results
  }

  const syncRevenues = async () => {
    const results = []
    for (const revenue of revenues) {
      try {
        const revenueData = {
          date: revenue.date,
          iv_revenue: revenue.ivRevenue,
          endoscopy_revenue: revenue.endoscopyRevenue,
          total_revenue: revenue.totalRevenue
        }

        const { error } = await supabase
          .from('revenues')
          .upsert(revenueData, { onConflict: 'date' })

        if (error) {
          results.push({ type: 'revenue', name: revenue.date, status: 'error', message: error.message })
        } else {
          results.push({ type: 'revenue', name: revenue.date, status: 'success' })
        }
      } catch (error: any) {
        results.push({ type: 'revenue', name: revenue.date, status: 'error', message: error.message })
      }
    }
    return results
  }

  const handleSync = async () => {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase가 설정되지 않았습니다')
      return
    }

    setSyncing(true)
    setResults([])

    try {
      const patientResults = await syncPatients()
      const appointmentResults = await syncAppointments()
      const revenueResults = await syncRevenues()

      const allResults = [...patientResults, ...appointmentResults, ...revenueResults]
      setResults(allResults)

      const successCount = allResults.filter(r => r.status === 'success').length
      const errorCount = allResults.filter(r => r.status === 'error').length

      if (errorCount === 0) {
        toast.success(`모든 데이터 동기화 완료! (${successCount}건)`)
      } else {
        toast.error(`일부 오류 발생 - 성공: ${successCount}, 실패: ${errorCount}`)
      }
    } catch (error) {
      toast.error('동기화 중 오류가 발생했습니다')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">데이터 동기화</h1>
              <p className="text-gray-600 mt-2">로컬 데이터를 Supabase로 동기화합니다</p>
            </div>
            <Database className="w-10 h-10 text-primary-600" />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">현재 로컬 데이터</h3>
            <div className="space-y-1 text-sm">
              <p>• 환자: {patients.length}명</p>
              <p>• 예약: {appointments.length}건</p>
              <p>• 매출: {revenues.length}일</p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {syncing ? (
              <>처리 중...</>
            ) : (
              <>
                <ArrowUpCircle className="w-5 h-5" />
                Supabase로 동기화
              </>
            )}
          </button>

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">동기화 결과</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-sm">{result.type}</span>
                      <span className="ml-2 text-sm text-gray-600">{result.name}</span>
                      {result.message && (
                        <p className="text-xs text-red-600 mt-1">{result.message}</p>
                      )}
                    </div>
                    {result.status === 'success' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}