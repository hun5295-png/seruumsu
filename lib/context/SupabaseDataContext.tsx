'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase, subscribeToTable } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { SERVICES } from '@/lib/data/services'
import toast from 'react-hot-toast'

// 기존 DataContext와 동일한 타입 정의 (호환성 유지)
export interface Patient {
  id: string
  name: string
  phone: string
  email: string
  birthDate: string
  registrationDate: string
  lastVisit: string
  totalVisits: number
  totalSpent: number
  favoriteServices: string[]
  notes?: string
  status: 'active' | 'inactive'
  membership?: 'basic' | 'silver' | 'gold' | 'vip'
  visitSource?: '검색' | '직원소개' | '원내광고' | '이벤트메세지' | '내시경실' | '진료' | '지인소개' | '기타'
  packages?: {
    serviceId: string
    serviceName: string
    totalCount: number
    remainingCount: number
    purchaseDate: string
    expiryDate?: string
  }[]
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  phone: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  duration: number
  price: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
  addOns?: {
    백옥?: boolean
    백옥더블?: boolean
    가슴샘?: boolean
    강력주사?: boolean
  }
  packageType?: 'single' | '4times' | '8times'
  paymentStatus?: 'pending' | 'paid'
  createdBy?: string
  createdAt?: string
}

export interface DailyServiceData {
  date: string
  serviceId: string
  count: number
  revenue: number
}

export interface Revenue {
  date: string
  ivRevenue: number
  endoscopyRevenue: number
  totalRevenue: number
  serviceDetails: {
    serviceId: string
    count: number
    revenue: number
  }[]
}

export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minAmount?: number
  validFrom: string
  validUntil: string
  usageCount: number
  maxUsage: number
  isActive: boolean
}

// 캐시 상태 타입
interface CacheState {
  patients: Patient[]
  appointments: Appointment[]
  revenues: Revenue[]
  dailyServices: DailyServiceData[]
  coupons: Coupon[]
  lastSync: Date | null
  isOnline: boolean
}

// 전역 데이터 컨텍스트 타입 (기존과 동일한 인터페이스 유지)
interface SupabaseDataContextType {
  // 환자 데이터
  patients: Patient[]
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<Patient>
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  getPatient: (id: string) => Patient | undefined
  getPatientAppointments: (patientId: string) => Appointment[]
  getPatientStats: (patientId: string) => {
    totalAppointments: number
    completedAppointments: number
    totalSpent: number
    averageSpent: number
  }

  // 예약 데이터
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>
  completeAppointment: (id: string) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
  getAppointmentsByDate: (date: string) => Appointment[]
  getTodayAppointments: () => Appointment[]

  // 매출 데이터
  revenues: Revenue[]
  addRevenue: (revenue: Revenue) => Promise<void>
  getRevenueByDate: (date: string) => Revenue | undefined
  getMonthlyRevenue: (year: number, month: number) => Revenue[]
  getTotalRevenueByMonth: (year: number, month: number) => number

  // 일일 서비스 데이터
  dailyServices: DailyServiceData[]
  addDailyService: (data: DailyServiceData) => Promise<void>
  getDailyServicesByDate: (date: string) => DailyServiceData[]

  // 통계
  getTodayStats: () => {
    appointments: number
    completedServices: number
    revenue: number
    newPatients: number
  }
  getWeekStats: () => {
    appointments: number
    completedServices: number
    revenue: number
    newPatients: number
  }

  // 가격 계산
  calculateServicePrice: (
    serviceId: string,
    packageType?: 'single' | '4times' | '8times',
    addOns?: Appointment['addOns']
  ) => number

  // 쿠폰 데이터
  coupons: Coupon[]
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<Coupon>
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>
  deleteCoupon: (id: string) => Promise<void>
  getCoupon: (code: string) => Coupon | undefined
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number }

  // 추가 기능
  isOnline: boolean
  lastSync: Date | null
  syncToSupabase: () => Promise<void>
  clearCache: () => void
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined)

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext)
  if (!context) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider')
  }
  return context
}

// 타입 변환 헬퍼 함수들
const convertDbPatientToPatient = (dbPatient: Database['public']['Tables']['patients']['Row'], packages: any[] = []): Patient => ({
  id: dbPatient.id,
  name: dbPatient.name,
  phone: dbPatient.phone,
  email: dbPatient.email || '',
  birthDate: dbPatient.birth_date || '',
  registrationDate: dbPatient.registration_date,
  lastVisit: dbPatient.last_visit || '',
  totalVisits: dbPatient.total_visits,
  totalSpent: dbPatient.total_spent,
  favoriteServices: dbPatient.favorite_services || [],
  notes: dbPatient.notes || '',
  status: dbPatient.status,
  membership: dbPatient.membership,
  visitSource: dbPatient.visit_source || undefined,
  packages: packages.map(pkg => ({
    serviceId: pkg.service_id,
    serviceName: pkg.service_name,
    totalCount: pkg.total_count,
    remainingCount: pkg.remaining_count,
    purchaseDate: pkg.purchase_date,
    expiryDate: pkg.expiry_date
  }))
})

const convertDbAppointmentToAppointment = (dbAppointment: Database['public']['Tables']['appointments']['Row']): Appointment => ({
  id: dbAppointment.id,
  patientId: dbAppointment.patient_id,
  patientName: dbAppointment.patient_name,
  phone: dbAppointment.phone,
  serviceId: dbAppointment.service_id,
  serviceName: dbAppointment.service_name,
  date: dbAppointment.appointment_date,
  time: dbAppointment.appointment_time,
  duration: dbAppointment.duration,
  price: dbAppointment.price,
  status: dbAppointment.status,
  notes: dbAppointment.notes || undefined,
  addOns: {
    백옥: dbAppointment.addon_백옥,
    백옥더블: dbAppointment.addon_백옥더블,
    가슴샘: dbAppointment.addon_가슴샘,
    강력주사: dbAppointment.addon_강력주사
  },
  packageType: dbAppointment.package_type as 'single' | '4times' | '8times',
  paymentStatus: dbAppointment.payment_status,
  createdBy: dbAppointment.created_by || undefined,
  createdAt: dbAppointment.created_at
})

export const SupabaseDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 캐시 상태
  const [cache, setCache] = useState<CacheState>({
    patients: [],
    appointments: [],
    revenues: [],
    dailyServices: [],
    coupons: [],
    lastSync: null,
    isOnline: true
  })

  const [isLoading, setIsLoading] = useState(true)

  // 네트워크 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      setCache(prev => ({ ...prev, isOnline: true }))
      syncFromSupabase() // 온라인 시 자동 동기화
    }

    const handleOffline = () => {
      setCache(prev => ({ ...prev, isOnline: false }))
      toast.error('오프라인 모드입니다. 데이터는 로컬에 저장됩니다.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 초기 네트워크 상태 확인
    setCache(prev => ({ ...prev, isOnline: navigator.onLine }))

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Supabase에서 데이터 로드
  const syncFromSupabase = useCallback(async () => {
    try {
      setIsLoading(true)

      // 병렬로 모든 데이터 로드
      const [patientsResult, appointmentsResult, revenuesResult, dailyServicesResult, couponsResult, packagesResult] = await Promise.all([
        supabase.from('patients').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('revenues').select(`
          *,
          revenue_details (
            service_id,
            service_name,
            count,
            revenue
          )
        `).order('date', { ascending: false }),
        supabase.from('daily_services').select('*').order('date', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('packages').select('*')
      ])

      if (patientsResult.error) throw patientsResult.error
      if (appointmentsResult.error) throw appointmentsResult.error
      if (revenuesResult.error) throw revenuesResult.error
      if (dailyServicesResult.error) throw dailyServicesResult.error
      if (couponsResult.error) throw couponsResult.error
      if (packagesResult.error) throw packagesResult.error

      // 패키지 데이터를 환자별로 그룹화
      const packagesByPatient = packagesResult.data?.reduce((acc, pkg) => {
        if (!acc[pkg.patient_id]) acc[pkg.patient_id] = []
        acc[pkg.patient_id].push(pkg)
        return acc
      }, {} as Record<string, any[]>) || {}

      // 데이터 변환
      const patients = patientsResult.data?.map(p =>
        convertDbPatientToPatient(p, packagesByPatient[p.id] || [])
      ) || []

      const appointments = appointmentsResult.data?.map(convertDbAppointmentToAppointment) || []

      const revenues = revenuesResult.data?.map(r => ({
        date: r.date,
        ivRevenue: r.iv_revenue,
        endoscopyRevenue: r.endoscopy_revenue,
        totalRevenue: r.total_revenue,
        serviceDetails: (r.revenue_details as any[])?.map(rd => ({
          serviceId: rd.service_id,
          count: rd.count,
          revenue: rd.revenue
        })) || []
      })) || []

      const dailyServices = dailyServicesResult.data?.map(ds => ({
        date: ds.date,
        serviceId: ds.service_id,
        count: ds.count,
        revenue: ds.revenue
      })) || []

      const coupons = couponsResult.data?.map(c => ({
        id: c.id,
        code: c.code,
        discount: c.discount,
        discountType: c.discount_type as 'percentage' | 'fixed',
        minAmount: c.min_amount || undefined,
        validFrom: c.valid_from,
        validUntil: c.valid_until,
        usageCount: c.usage_count,
        maxUsage: c.max_usage,
        isActive: c.is_active
      })) || []

      setCache({
        patients,
        appointments,
        revenues,
        dailyServices,
        coupons,
        lastSync: new Date(),
        isOnline: navigator.onLine
      })

      // 로컬 스토리지에도 캐시 저장
      localStorage.setItem('supabase_cache', JSON.stringify({
        patients,
        appointments,
        revenues,
        dailyServices,
        coupons,
        lastSync: new Date().toISOString()
      }))

    } catch (error) {
      console.error('Failed to sync from Supabase:', error)

      // 오프라인이거나 오류 시 로컬 스토리지에서 로드
      const cachedData = localStorage.getItem('supabase_cache')
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData)
          setCache({
            patients: parsed.patients || [],
            appointments: parsed.appointments || [],
            revenues: parsed.revenues || [],
            dailyServices: parsed.dailyServices || [],
            coupons: parsed.coupons || [],
            lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
            isOnline: false
          })
          toast.error('서버 연결 실패. 캐시된 데이터를 사용합니다.')
        } catch (parseError) {
          console.error('Failed to parse cached data:', parseError)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 초기 데이터 로드
  useEffect(() => {
    syncFromSupabase()
  }, [syncFromSupabase])

  // 실시간 구독 설정
  useEffect(() => {
    if (!cache.isOnline) return

    const subscriptions = [
      subscribeToTable('patients', () => syncFromSupabase()),
      subscribeToTable('appointments', () => syncFromSupabase()),
      subscribeToTable('revenues', () => syncFromSupabase()),
      subscribeToTable('daily_services', () => syncFromSupabase()),
      subscribeToTable('coupons', () => syncFromSupabase()),
      subscribeToTable('packages', () => syncFromSupabase())
    ]

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [cache.isOnline, syncFromSupabase])

  // 환자 관리 함수들
  const addPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    try {
      const dbPatient: Database['public']['Tables']['patients']['Insert'] = {
        name: patient.name,
        phone: patient.phone,
        email: patient.email || null,
        birth_date: patient.birthDate || null,
        registration_date: patient.registrationDate || new Date().toISOString().split('T')[0],
        last_visit: patient.lastVisit || null,
        total_visits: patient.totalVisits || 0,
        total_spent: patient.totalSpent || 0,
        favorite_services: patient.favoriteServices || null,
        notes: patient.notes || null,
        status: patient.status || 'active',
        membership: patient.membership || 'basic',
        visit_source: patient.visitSource || null
      }

      const { data, error } = await supabase
        .from('patients')
        .insert(dbPatient)
        .select()
        .single()

      if (error) throw error

      const newPatient = convertDbPatientToPatient(data, [])

      // 패키지가 있다면 별도로 추가
      if (patient.packages?.length) {
        const packageInserts = patient.packages.map(pkg => ({
          patient_id: data.id,
          service_id: pkg.serviceId,
          service_name: pkg.serviceName,
          total_count: pkg.totalCount,
          remaining_count: pkg.remainingCount,
          purchase_date: pkg.purchaseDate,
          expiry_date: pkg.expiryDate || null,
          purchase_price: 0 // 기본값
        }))

        await supabase.from('packages').insert(packageInserts)
      }

      return newPatient
    } catch (error) {
      console.error('Failed to add patient:', error)

      if (!cache.isOnline) {
        // 오프라인 시 로컬에만 추가
        const newPatient: Patient = {
          ...patient,
          id: `offline_${Date.now()}`,
          registrationDate: patient.registrationDate || new Date().toISOString().split('T')[0],
          totalVisits: patient.totalVisits || 0,
          totalSpent: patient.totalSpent || 0,
          status: patient.status || 'active'
        }

        setCache(prev => ({
          ...prev,
          patients: [newPatient, ...prev.patients]
        }))

        toast.success('환자가 오프라인으로 추가되었습니다. 온라인 시 동기화됩니다.')
        return newPatient
      }

      throw error
    }
  }

  const updatePatient = async (id: string, updates: Partial<Patient>): Promise<void> => {
    try {
      const dbUpdates: Database['public']['Tables']['patients']['Update'] = {
        name: updates.name,
        phone: updates.phone,
        email: updates.email || null,
        birth_date: updates.birthDate || null,
        last_visit: updates.lastVisit || null,
        total_visits: updates.totalVisits,
        total_spent: updates.totalSpent,
        favorite_services: updates.favoriteServices || null,
        notes: updates.notes || null,
        status: updates.status,
        membership: updates.membership,
        visit_source: updates.visitSource || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('patients')
        .update(dbUpdates)
        .eq('id', id)

      if (error) throw error

      // 패키지 업데이트가 있다면 처리
      if (updates.packages) {
        // 기존 패키지 삭제 후 새로 추가
        await supabase.from('packages').delete().eq('patient_id', id)

        if (updates.packages.length > 0) {
          const packageInserts = updates.packages.map(pkg => ({
            patient_id: id,
            service_id: pkg.serviceId,
            service_name: pkg.serviceName,
            total_count: pkg.totalCount,
            remaining_count: pkg.remainingCount,
            purchase_date: pkg.purchaseDate,
            expiry_date: pkg.expiryDate || null,
            purchase_price: 0
          }))

          await supabase.from('packages').insert(packageInserts)
        }
      }

    } catch (error) {
      console.error('Failed to update patient:', error)

      if (!cache.isOnline) {
        // 오프라인 시 로컬에만 업데이트
        setCache(prev => ({
          ...prev,
          patients: prev.patients.map(p => p.id === id ? { ...p, ...updates } : p)
        }))
        toast.success('환자 정보가 오프라인으로 업데이트되었습니다.')
        return
      }

      throw error
    }
  }

  const deletePatient = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)

      if (error) throw error

    } catch (error) {
      console.error('Failed to delete patient:', error)

      if (!cache.isOnline) {
        setCache(prev => ({
          ...prev,
          patients: prev.patients.filter(p => p.id !== id)
        }))
        toast.success('환자가 오프라인으로 삭제되었습니다.')
        return
      }

      throw error
    }
  }

  const getPatient = (id: string) => cache.patients.find(p => p.id === id)

  // 예약 관리 함수들
  const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    try {
      const dbAppointment: Database['public']['Tables']['appointments']['Insert'] = {
        patient_id: appointment.patientId,
        patient_name: appointment.patientName,
        phone: appointment.phone,
        service_id: appointment.serviceId,
        service_name: appointment.serviceName,
        appointment_date: appointment.date,
        appointment_time: appointment.time,
        duration: appointment.duration,
        price: appointment.price,
        status: appointment.status || 'pending',
        notes: appointment.notes || null,
        addon_백옥: appointment.addOns?.백옥 || false,
        addon_백옥더블: appointment.addOns?.백옥더블 || false,
        addon_가슴샘: appointment.addOns?.가슴샘 || false,
        addon_강력주사: appointment.addOns?.강력주사 || false,
        package_type: appointment.packageType || 'single',
        payment_status: appointment.paymentStatus || 'pending',
        created_by: appointment.createdBy || null
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert(dbAppointment)
        .select()
        .single()

      if (error) throw error

      return convertDbAppointmentToAppointment(data)
    } catch (error) {
      console.error('Failed to add appointment:', error)

      if (!cache.isOnline) {
        const newAppointment: Appointment = {
          ...appointment,
          id: `offline_${Date.now()}`,
          status: appointment.status || 'pending',
          paymentStatus: appointment.paymentStatus || 'pending',
          createdAt: new Date().toISOString()
        }

        setCache(prev => ({
          ...prev,
          appointments: [newAppointment, ...prev.appointments]
        }))

        toast.success('예약이 오프라인으로 추가되었습니다.')
        return newAppointment
      }

      throw error
    }
  }

  const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<void> => {
    try {
      const dbUpdates: Database['public']['Tables']['appointments']['Update'] = {
        patient_name: updates.patientName,
        phone: updates.phone,
        service_id: updates.serviceId,
        service_name: updates.serviceName,
        appointment_date: updates.date,
        appointment_time: updates.time,
        duration: updates.duration,
        price: updates.price,
        status: updates.status,
        notes: updates.notes || null,
        addon_백옥: updates.addOns?.백옥,
        addon_백옥더블: updates.addOns?.백옥더블,
        addon_가슴샘: updates.addOns?.가슴샘,
        addon_강력주사: updates.addOns?.강력주사,
        package_type: updates.packageType,
        payment_status: updates.paymentStatus,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('appointments')
        .update(dbUpdates)
        .eq('id', id)

      if (error) throw error

    } catch (error) {
      console.error('Failed to update appointment:', error)

      if (!cache.isOnline) {
        setCache(prev => ({
          ...prev,
          appointments: prev.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
        }))
        toast.success('예약이 오프라인으로 업데이트되었습니다.')
        return
      }

      throw error
    }
  }

  const completeAppointment = async (id: string): Promise<void> => {
    const appointment = cache.appointments.find(a => a.id === id)
    if (!appointment) return

    try {
      // 예약 완료 처리
      await updateAppointment(id, {
        status: 'completed',
        paymentStatus: 'paid'
      })

      // 매출 자동 추가
      const today = new Date().toISOString().split('T')[0]
      await addRevenue({
        date: today,
        ivRevenue: appointment.price,
        endoscopyRevenue: 0,
        totalRevenue: appointment.price,
        serviceDetails: [{
          serviceId: appointment.serviceId,
          count: 1,
          revenue: appointment.price
        }]
      })

      // 환자 방문 기록 업데이트
      const patient = getPatient(appointment.patientId)
      if (patient) {
        await updatePatient(patient.id, {
          lastVisit: today,
          totalVisits: patient.totalVisits + 1,
          totalSpent: patient.totalSpent + appointment.price
        })
      }

    } catch (error) {
      console.error('Failed to complete appointment:', error)
      throw error
    }
  }

  const cancelAppointment = async (id: string): Promise<void> => {
    await updateAppointment(id, { status: 'cancelled' })
  }

  const getAppointmentsByDate = (date: string) => {
    return cache.appointments.filter(a => a.date === date)
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return getAppointmentsByDate(today)
  }

  // 매출 관리 함수들
  const addRevenue = async (revenue: Revenue): Promise<void> => {
    try {
      // 기존 매출이 있는지 확인
      const { data: existingRevenue } = await supabase
        .from('revenues')
        .select('id')
        .eq('date', revenue.date)
        .single()

      if (existingRevenue) {
        // 기존 매출 업데이트
        const { error: updateError } = await supabase
          .from('revenues')
          .update({
            iv_revenue: revenue.ivRevenue,
            endoscopy_revenue: revenue.endoscopyRevenue,
            total_revenue: revenue.totalRevenue,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRevenue.id)

        if (updateError) throw updateError

        // 기존 세부 내역 삭제 후 새로 추가
        await supabase
          .from('revenue_details')
          .delete()
          .eq('revenue_id', existingRevenue.id)

        if (revenue.serviceDetails.length > 0) {
          const details = revenue.serviceDetails.map(detail => ({
            revenue_id: existingRevenue.id,
            service_id: detail.serviceId,
            service_name: detail.serviceId, // 서비스 이름은 서비스 ID로 대체
            count: detail.count,
            revenue: detail.revenue
          }))

          await supabase.from('revenue_details').insert(details)
        }
      } else {
        // 새 매출 생성
        const { data: newRevenue, error: insertError } = await supabase
          .from('revenues')
          .insert({
            date: revenue.date,
            iv_revenue: revenue.ivRevenue,
            endoscopy_revenue: revenue.endoscopyRevenue,
            total_revenue: revenue.totalRevenue
          })
          .select()
          .single()

        if (insertError) throw insertError

        if (revenue.serviceDetails.length > 0) {
          const details = revenue.serviceDetails.map(detail => ({
            revenue_id: newRevenue.id,
            service_id: detail.serviceId,
            service_name: detail.serviceId,
            count: detail.count,
            revenue: detail.revenue
          }))

          await supabase.from('revenue_details').insert(details)
        }
      }

    } catch (error) {
      console.error('Failed to add revenue:', error)

      if (!cache.isOnline) {
        setCache(prev => {
          const existingIndex = prev.revenues.findIndex(r => r.date === revenue.date)
          if (existingIndex >= 0) {
            const updated = [...prev.revenues]
            updated[existingIndex] = revenue
            return { ...prev, revenues: updated }
          } else {
            return { ...prev, revenues: [revenue, ...prev.revenues] }
          }
        })
        toast.success('매출이 오프라인으로 저장되었습니다.')
        return
      }

      throw error
    }
  }

  const getRevenueByDate = (date: string) => {
    return cache.revenues.find(r => r.date === date)
  }

  const getMonthlyRevenue = (year: number, month: number) => {
    return cache.revenues.filter(r => {
      const date = new Date(r.date)
      return date.getFullYear() === year && date.getMonth() + 1 === month
    })
  }

  const getTotalRevenueByMonth = (year: number, month: number) => {
    return getMonthlyRevenue(year, month).reduce((sum, r) => sum + r.totalRevenue, 0)
  }

  // 일일 서비스 관리
  const addDailyService = async (data: DailyServiceData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('daily_services')
        .insert({
          date: data.date,
          service_id: data.serviceId,
          service_name: data.serviceId,
          count: data.count,
          revenue: data.revenue
        })

      if (error) throw error

    } catch (error) {
      console.error('Failed to add daily service:', error)

      if (!cache.isOnline) {
        setCache(prev => ({
          ...prev,
          dailyServices: [data, ...prev.dailyServices]
        }))
        toast.success('일일 서비스가 오프라인으로 저장되었습니다.')
        return
      }

      throw error
    }
  }

  const getDailyServicesByDate = (date: string) => {
    return cache.dailyServices.filter(d => d.date === date)
  }

  // 가격 계산 함수 (기존과 동일)
  const calculateServicePrice = (
    serviceId: string,
    packageType: 'single' | '4times' | '8times' = 'single',
    addOns?: Appointment['addOns']
  ) => {
    const service = SERVICES.find(s => s.id === serviceId)
    if (!service) return 0

    let basePrice = service.basePrice

    if (packageType === '4times' && service.package4Price) {
      basePrice = service.package4Price
    } else if (packageType === '8times' && service.package8Price) {
      basePrice = service.package8Price
    }

    let addOnPrice = 0
    if (addOns) {
      if (addOns.백옥) addOnPrice += 30000
      if (addOns.백옥더블) addOnPrice += 50000
      if (addOns.가슴샘) addOnPrice += 70000
      if (addOns.강력주사) addOnPrice += 50000
    }

    return basePrice + addOnPrice
  }

  // 환자별 예약 내역 조회
  const getPatientAppointments = (patientId: string): Appointment[] => {
    return cache.appointments
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // 환자별 통계
  const getPatientStats = (patientId: string) => {
    const patientAppointments = getPatientAppointments(patientId)
    const completedAppointments = patientAppointments.filter(a => a.status === 'completed')
    const totalSpent = completedAppointments.reduce((sum, a) => sum + a.price, 0)

    return {
      totalAppointments: patientAppointments.length,
      completedAppointments: completedAppointments.length,
      totalSpent,
      averageSpent: completedAppointments.length > 0 ? totalSpent / completedAppointments.length : 0
    }
  }

  // 통계 함수들
  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayAppointments = getAppointmentsByDate(today).filter(a => a.status !== 'cancelled')
    const todayRevenue = getRevenueByDate(today)
    const todayNewPatients = cache.patients.filter(p => p.registrationDate === today)

    const recordedRevenue = todayRevenue?.totalRevenue || 0
    const appointmentRevenue = todayAppointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.price || 0), 0)

    const totalRevenue = Math.max(recordedRevenue, appointmentRevenue)

    return {
      appointments: todayAppointments.length,
      completedServices: todayAppointments.filter(a => a.status === 'completed').length,
      revenue: totalRevenue,
      newPatients: todayNewPatients.length
    }
  }

  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)

    const todayStr = today.toISOString().split('T')[0]
    const weekAgoStr = weekAgo.toISOString().split('T')[0]

    const weekAppointments = cache.appointments.filter(a => {
      return a.date >= weekAgoStr && a.date <= todayStr && a.status !== 'cancelled'
    })

    const weekRevenues = cache.revenues.filter(r => {
      return r.date >= weekAgoStr && r.date <= todayStr
    })

    const weekNewPatients = cache.patients.filter(p => {
      return p.registrationDate >= weekAgoStr && p.registrationDate <= todayStr
    })

    const appointmentRevenue = weekAppointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.price || 0), 0)

    const revenueTableTotal = weekRevenues.reduce((sum, r) => sum + r.totalRevenue, 0)
    const totalRevenue = Math.max(appointmentRevenue, revenueTableTotal)

    return {
      appointments: weekAppointments.length,
      completedServices: weekAppointments.filter(a => a.status === 'completed').length,
      revenue: totalRevenue,
      newPatients: weekNewPatients.length
    }
  }

  // 쿠폰 관리 함수들
  const addCoupon = async (coupon: Omit<Coupon, 'id'>): Promise<Coupon> => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          code: coupon.code,
          discount: coupon.discount,
          discount_type: coupon.discountType,
          min_amount: coupon.minAmount || null,
          valid_from: coupon.validFrom,
          valid_until: coupon.validUntil,
          usage_count: coupon.usageCount,
          max_usage: coupon.maxUsage,
          is_active: coupon.isActive
        })
        .select()
        .single()

      if (error) throw error

      const newCoupon: Coupon = {
        id: data.id,
        code: data.code,
        discount: data.discount,
        discountType: data.discount_type as 'percentage' | 'fixed',
        minAmount: data.min_amount || undefined,
        validFrom: data.valid_from,
        validUntil: data.valid_until,
        usageCount: data.usage_count,
        maxUsage: data.max_usage,
        isActive: data.is_active
      }

      return newCoupon
    } catch (error) {
      console.error('Failed to add coupon:', error)

      if (!cache.isOnline) {
        const newCoupon: Coupon = {
          ...coupon,
          id: `offline_${Date.now()}`
        }

        setCache(prev => ({
          ...prev,
          coupons: [newCoupon, ...prev.coupons]
        }))

        toast.success('쿠폰이 오프라인으로 추가되었습니다.')
        return newCoupon
      }

      throw error
    }
  }

  const updateCoupon = async (id: string, updates: Partial<Coupon>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({
          code: updates.code,
          discount: updates.discount,
          discount_type: updates.discountType,
          min_amount: updates.minAmount || null,
          valid_from: updates.validFrom,
          valid_until: updates.validUntil,
          usage_count: updates.usageCount,
          max_usage: updates.maxUsage,
          is_active: updates.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

    } catch (error) {
      console.error('Failed to update coupon:', error)

      if (!cache.isOnline) {
        setCache(prev => ({
          ...prev,
          coupons: prev.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
        }))
        toast.success('쿠폰이 오프라인으로 업데이트되었습니다.')
        return
      }

      throw error
    }
  }

  const deleteCoupon = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

      if (error) throw error

    } catch (error) {
      console.error('Failed to delete coupon:', error)

      if (!cache.isOnline) {
        setCache(prev => ({
          ...prev,
          coupons: prev.coupons.filter(c => c.id !== id)
        }))
        toast.success('쿠폰이 오프라인으로 삭제되었습니다.')
        return
      }

      throw error
    }
  }

  const getCoupon = (code: string) => {
    return cache.coupons.find(c => c.code === code && c.isActive)
  }

  const validateCoupon = (code: string, amount: number) => {
    const coupon = getCoupon(code)
    if (!coupon) {
      return { valid: false, discount: 0 }
    }

    const today = new Date().toISOString().split('T')[0]
    if (today < coupon.validFrom || today > coupon.validUntil) {
      return { valid: false, discount: 0 }
    }

    if (coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, discount: 0 }
    }

    if (coupon.minAmount && amount < coupon.minAmount) {
      return { valid: false, discount: 0 }
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = Math.round(amount * (coupon.discount / 100))
    } else {
      discount = coupon.discount
    }

    return { valid: true, discount }
  }

  // 추가 기능들
  const syncToSupabase = async (): Promise<void> => {
    if (!cache.isOnline) {
      toast.error('오프라인 상태에서는 동기화할 수 없습니다.')
      return
    }

    try {
      await syncFromSupabase()
      toast.success('데이터가 성공적으로 동기화되었습니다.')
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('동기화에 실패했습니다.')
    }
  }

  const clearCache = () => {
    setCache({
      patients: [],
      appointments: [],
      revenues: [],
      dailyServices: [],
      coupons: [],
      lastSync: null,
      isOnline: navigator.onLine
    })
    localStorage.removeItem('supabase_cache')
    toast.success('캐시가 클리어되었습니다.')
  }

  const value: SupabaseDataContextType = {
    // 환자 데이터
    patients: cache.patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    getPatientAppointments,
    getPatientStats,

    // 예약 데이터
    appointments: cache.appointments,
    addAppointment,
    updateAppointment,
    completeAppointment,
    cancelAppointment,
    getAppointmentsByDate,
    getTodayAppointments,

    // 매출 데이터
    revenues: cache.revenues,
    addRevenue,
    getRevenueByDate,
    getMonthlyRevenue,
    getTotalRevenueByMonth,

    // 일일 서비스 데이터
    dailyServices: cache.dailyServices,
    addDailyService,
    getDailyServicesByDate,

    // 통계
    getTodayStats,
    getWeekStats,

    // 가격 계산
    calculateServicePrice,

    // 쿠폰 데이터
    coupons: cache.coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    validateCoupon,

    // 추가 기능
    isOnline: cache.isOnline,
    lastSync: cache.lastSync,
    syncToSupabase,
    clearCache
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 로드하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <SupabaseDataContext.Provider value={value}>
      {children}
    </SupabaseDataContext.Provider>
  )
}