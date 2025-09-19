'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SERVICES } from '@/lib/data/services'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// 타입 정의
export interface Patient {
  id: string
  chartNumber?: string  // 차트번호
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
  discountRateId?: string  // 할인율 ID
  discountRateName?: string  // 할인율 이름 (표시용)
  discountRate?: number  // 할인율 (%)
  assignedStaffId?: string  // 담당직원 ID
  assignedStaffName?: string  // 담당직원 이름 (표시용)
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
    백옥?: boolean       // 3만원
    백옥더블?: boolean   // 5만원
    가슴샘?: boolean     // 7만원
    강력주사?: boolean   // 5만원
  }
  packageType?: 'single' | '4times' | '8times' // 단건, 4회, 8회
  paymentStatus?: 'pending' | 'paid'
  createdBy?: string // 직원 ID
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

// 전역 데이터 컨텍스트 타입
interface DataContextType {
  // 환자 데이터
  patients: Patient[]
  addPatient: (patient: Omit<Patient, 'id'>) => Patient
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
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
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  completeAppointment: (id: string) => void
  cancelAppointment: (id: string) => void
  getAppointmentsByDate: (date: string) => Appointment[]
  getTodayAppointments: () => Appointment[]

  // 매출 데이터
  revenues: Revenue[]
  addRevenue: (revenue: Revenue) => void
  getRevenueByDate: (date: string) => Revenue | undefined
  getMonthlyRevenue: (year: number, month: number) => Revenue[]
  getTotalRevenueByMonth: (year: number, month: number) => number

  // 일일 서비스 데이터
  dailyServices: DailyServiceData[]
  addDailyService: (data: DailyServiceData) => void
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
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Coupon
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void
  getCoupon: (code: string) => Coupon | undefined
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 로컬 스토리지 키
  const STORAGE_KEY = 'seroumsu_data'

  // 상태 관리
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [dailyServices, setDailyServices] = useState<DailyServiceData[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])

  // 로컬 스토리지에서 데이터 로드 (데이터가 없으면 빈 상태로 시작)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY)

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          // 저장된 데이터가 있으면 로드
          setPatients(parsed.patients || [])
          setAppointments(parsed.appointments || [])
          setRevenues(parsed.revenues || [])
          setDailyServices(parsed.dailyServices || [])
          setCoupons(parsed.coupons || [])
        } catch (error) {
          // 파싱 오류 시 빈 상태로 시작
          console.error('Failed to load data:', error)
          setPatients([])
          setAppointments([])
          setRevenues([])
          setDailyServices([])
          setCoupons([])
        }
      } else {
        // 저장된 데이터가 없으면 빈 상태로 시작
        setPatients([])
        setAppointments([])
        setRevenues([])
        setDailyServices([])
        setCoupons([])
      }
    }
  }, [])

  // 데이터 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataToSave = { patients, appointments, revenues, dailyServices, coupons }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [patients, appointments, revenues, dailyServices, coupons])

  // 샘플 데이터 초기화 - 모든 샘플 데이터 제거
  const initializeSampleData = () => {
    // 빈 데이터로 시작 - 실제 운영 데이터만 사용
    setPatients([])
    setAppointments([])
    setRevenues([])
    setDailyServices([])
    setCoupons([])
  }

  // 환자 관리 함수들
  const addPatient = (patient: Omit<Patient, 'id'>): Patient => {
    const newPatient = {
      ...patient,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalVisits: 0,
      totalSpent: 0,
      packages: patient.packages || [], // packages 필드 초기화
      status: 'active' as const
    }
    setPatients(prev => [...prev, newPatient])

    // Supabase에도 저장 (비동기로 처리)
    if (isSupabaseConfigured()) {
      const saveToSupabase = async () => {
        try {
          const { error } = await supabase
            .from('patients')
            .upsert({
              name: newPatient.name,
              phone: newPatient.phone,
              email: newPatient.email || null,
              birth_date: newPatient.birthDate || null,
              registration_date: newPatient.registrationDate,
              last_visit: newPatient.lastVisit || null,
              total_visits: newPatient.totalVisits,
              total_spent: newPatient.totalSpent,
              favorite_services: newPatient.favoriteServices || [],
              notes: newPatient.notes || null,
              status: newPatient.status,
              membership: newPatient.membership || 'basic',
              visit_source: newPatient.visitSource || null
            }, { onConflict: 'phone' })

          if (error) {
            console.error('Failed to save patient to Supabase:', error)
          }
        } catch (error) {
          console.error('Error saving to Supabase:', error)
        }
      }
      saveToSupabase()
    }

    return newPatient
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))

    // Supabase에도 업데이트 (비동기로 처리)
    if (isSupabaseConfigured()) {
      const updateSupabase = async () => {
        try {
          const patient = patients.find(p => p.id === id)
          if (patient) {
            const { error } = await supabase
              .from('patients')
              .update({
                name: updates.name || patient.name,
                email: updates.email !== undefined ? updates.email : patient.email,
                notes: updates.notes !== undefined ? updates.notes : patient.notes,
                status: updates.status || patient.status,
                membership: updates.membership || patient.membership,
                last_visit: updates.lastVisit || patient.lastVisit,
                total_visits: updates.totalVisits !== undefined ? updates.totalVisits : patient.totalVisits,
                total_spent: updates.totalSpent !== undefined ? updates.totalSpent : patient.totalSpent
              })
              .eq('phone', patient.phone)

            if (error) {
              console.error('Failed to update patient in Supabase:', error)
            }
          }
        } catch (error) {
          console.error('Error updating patient in Supabase:', error)
        }
      }
      updateSupabase()
    }
  }

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id))
  }

  const getPatient = (id: string) => patients.find(p => p.id === id)

  // 예약 관리 함수들
  const addAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paymentStatus: appointment.paymentStatus || 'pending'
    }
    setAppointments(prev => [...prev, newAppointment])

    // Supabase에도 저장 (비동기로 처리)
    if (isSupabaseConfigured()) {
      const saveToSupabase = async () => {
        try {
          // 먼저 환자 ID 찾기
          const patient = patients.find(p => p.id === appointment.patientId)
          if (patient) {
            const { data: dbPatients } = await supabase
              .from('patients')
              .select('id')
              .eq('phone', patient.phone)
              .single()

            if (dbPatients) {
              const { error } = await supabase
                .from('appointments')
                .insert({
                  patient_id: dbPatients.id,
                  patient_name: newAppointment.patientName,
                  phone: newAppointment.phone,
                  service_id: newAppointment.serviceId,
                  service_name: newAppointment.serviceName,
                  appointment_date: newAppointment.date,
                  appointment_time: newAppointment.time,
                  duration: newAppointment.duration,
                  price: newAppointment.price,
                  status: newAppointment.status,
                  notes: newAppointment.notes || null,
                  addon_백옥: newAppointment.addOns?.백옥 || false,
                  addon_백옥더블: newAppointment.addOns?.백옥더블 || false,
                  addon_가슴샘: newAppointment.addOns?.가슴샘 || false,
                  addon_강력주사: newAppointment.addOns?.강력주사 || false,
                  package_type: newAppointment.packageType || 'single',
                  payment_status: newAppointment.paymentStatus || 'pending'
                })

              if (error) {
                console.error('Failed to save appointment to Supabase:', error)
              }
            }
          }
        } catch (error) {
          console.error('Error saving appointment to Supabase:', error)
        }
      }
      saveToSupabase()
    }

    return newAppointment
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))

    // Supabase에도 업데이트 (비동기로 처리)
    if (isSupabaseConfigured()) {
      const updateSupabase = async () => {
        try {
          const appointment = appointments.find(a => a.id === id)
          if (appointment) {
            // 환자 정보로 Supabase appointment 찾기
            const patient = patients.find(p => p.id === appointment.patientId)
            if (patient) {
              const { data: dbPatient } = await supabase
                .from('patients')
                .select('id')
                .eq('phone', patient.phone)
                .single()

              if (dbPatient) {
                const { error } = await supabase
                  .from('appointments')
                  .update({
                    status: updates.status || appointment.status,
                    payment_status: updates.paymentStatus || appointment.paymentStatus,
                    notes: updates.notes !== undefined ? updates.notes : appointment.notes
                  })
                  .eq('patient_id', dbPatient.id)
                  .eq('appointment_date', appointment.date)
                  .eq('appointment_time', appointment.time)

                if (error) {
                  console.error('Failed to update appointment in Supabase:', error)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error updating appointment in Supabase:', error)
        }
      }
      updateSupabase()
    }
  }

  const completeAppointment = (id: string) => {
    const appointment = appointments.find(a => a.id === id)
    if (appointment) {
      // 예약 완료 처리
      updateAppointment(id, {
        status: 'completed',
        paymentStatus: 'paid'
      })

      // 매출 자동 추가 - 로컬 날짜 사용
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const today = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const existingRevenue = revenues.find(r => r.date === today)

      if (existingRevenue) {
        // 오늘 매출에 추가
        const serviceDetail = existingRevenue.serviceDetails.find(d => d.serviceId === appointment.serviceId)
        if (serviceDetail) {
          serviceDetail.count += 1
          serviceDetail.revenue += appointment.price
        } else {
          existingRevenue.serviceDetails.push({
            serviceId: appointment.serviceId,
            count: 1,
            revenue: appointment.price
          })
        }
        existingRevenue.ivRevenue += appointment.price
        existingRevenue.totalRevenue += appointment.price
        setRevenues([...revenues])
      } else {
        // 새로운 날짜 매출 생성
        addRevenue({
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
      }

      // 환자 방문 기록 업데이트 및 패키지 차감
      const patient = patients.find(p => p.id === appointment.patientId)
      if (patient) {
        const updatedData: Partial<Patient> = {
          lastVisit: today,
          totalVisits: patient.totalVisits + 1,
          totalSpent: patient.totalSpent + appointment.price
        }

        // 패키지 횟수 차감 처리
        if (appointment.packageType && appointment.packageType !== 'single' && patient.packages) {
          const packageIndex = patient.packages.findIndex(
            pkg => pkg.serviceId === appointment.serviceId && pkg.remainingCount > 0
          )

          if (packageIndex !== -1) {
            const updatedPackages = [...patient.packages]
            updatedPackages[packageIndex] = {
              ...updatedPackages[packageIndex],
              remainingCount: updatedPackages[packageIndex].remainingCount - 1
            }
            updatedData.packages = updatedPackages
          }
        }

        updatePatient(patient.id, updatedData)
      }
    }
  }

  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' })
  }

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(a => a.date === date)
  }

  const getTodayAppointments = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const today = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return getAppointmentsByDate(today)
  }

  // 매출 관리 함수들
  const addRevenue = (revenue: Revenue) => {
    setRevenues(prev => {
      const existingIndex = prev.findIndex(r => r.date === revenue.date)
      if (existingIndex >= 0) {
        // 같은 날짜의 매출이 있으면 합산
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          ivRevenue: updated[existingIndex].ivRevenue + revenue.ivRevenue,
          endoscopyRevenue: updated[existingIndex].endoscopyRevenue + revenue.endoscopyRevenue,
          totalRevenue: updated[existingIndex].totalRevenue + revenue.totalRevenue,
          serviceDetails: [
            ...updated[existingIndex].serviceDetails,
            ...revenue.serviceDetails
          ]
        }
        return updated
      } else {
        // 새로운 날짜의 매출
        return [...prev, revenue]
      }
    })

    // Supabase에도 저장 (비동기로 처리)
    if (isSupabaseConfigured()) {
      const saveToSupabase = async () => {
        try {
          const { error } = await supabase
            .from('revenues')
            .upsert({
              date: revenue.date,
              iv_revenue: revenue.ivRevenue,
              endoscopy_revenue: revenue.endoscopyRevenue,
              total_revenue: revenue.totalRevenue
            }, { onConflict: 'date' })

          if (error) {
            console.error('Failed to save revenue to Supabase:', error)
          }
        } catch (error) {
          console.error('Error saving revenue to Supabase:', error)
        }
      }
      saveToSupabase()
    }
  }

  const getRevenueByDate = (date: string) => {
    return revenues.find(r => r.date === date)
  }

  const getMonthlyRevenue = (year: number, month: number) => {
    return revenues.filter(r => {
      const date = new Date(r.date)
      return date.getFullYear() === year && date.getMonth() + 1 === month
    })
  }

  const getTotalRevenueByMonth = (year: number, month: number) => {
    return getMonthlyRevenue(year, month).reduce((sum, r) => sum + r.totalRevenue, 0)
  }

  // 일일 서비스 관리
  const addDailyService = (data: DailyServiceData) => {
    setDailyServices(prev => [...prev, data])
  }

  const getDailyServicesByDate = (date: string) => {
    return dailyServices.filter(d => d.date === date)
  }

  // 가격 계산 함수
  const calculateServicePrice = (
    serviceId: string,
    packageType: 'single' | '4times' | '8times' = 'single',
    addOns?: Appointment['addOns']
  ) => {
    const service = SERVICES.find(s => s.id === serviceId)
    if (!service) return 0

    let basePrice = service.basePrice

    // 패키지 할인 적용
    if (packageType === '4times' && service.package4Price) {
      basePrice = service.package4Price
    } else if (packageType === '8times' && service.package8Price) {
      basePrice = service.package8Price
    }

    // 추가 옵션 가격
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
    return appointments.filter(a => a.patientId === patientId)
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
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const today = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const todayAppointments = getAppointmentsByDate(today).filter(a => a.status !== 'cancelled')
    const todayRevenue = getRevenueByDate(today)
    const todayNewPatients = patients.filter(p => p.registrationDate === today)

    // revenues 테이블의 오늘 매출 (이미 기록된 매출)
    const recordedRevenue = todayRevenue?.totalRevenue || 0

    // 오늘 날짜의 완료된 예약들의 매출 계산
    const appointmentRevenue = todayAppointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.price || 0), 0)

    // 두 값 중 큰 값을 사용 (중복 방지)
    // revenues 테이블에 이미 기록된 경우 그 값을 사용,
    // 아직 기록되지 않은 경우 appointment에서 계산
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

    // 주간 날짜 범위 생성
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`

    const weekAppointments = appointments.filter(a => {
      return a.date >= weekAgoStr && a.date <= todayStr && a.status !== 'cancelled'
    })

    const weekRevenues = revenues.filter(r => {
      return r.date >= weekAgoStr && r.date <= todayStr
    })

    const weekNewPatients = patients.filter(p => {
      return p.registrationDate >= weekAgoStr && p.registrationDate <= todayStr
    })

    // 이번 주의 완료된 예약들의 매출 계산
    const appointmentRevenue = weekAppointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.price || 0), 0)

    // 매출 테이블의 매출
    const revenueTableTotal = weekRevenues.reduce((sum, r) => sum + r.totalRevenue, 0)

    // 두 값 중 큰 값을 사용 (중복 방지)
    const totalRevenue = Math.max(appointmentRevenue, revenueTableTotal)

    return {
      appointments: weekAppointments.length,
      completedServices: weekAppointments.filter(a => a.status === 'completed').length,
      revenue: totalRevenue,
      newPatients: weekNewPatients.length
    }
  }

  // 쿠폰 관리 함수들
  const addCoupon = (coupon: Omit<Coupon, 'id'>): Coupon => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString()
    }
    setCoupons(prev => [...prev, newCoupon])
    return newCoupon
  }

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  const getCoupon = (code: string) => {
    return coupons.find(c => c.code === code && c.isActive)
  }

  const validateCoupon = (code: string, amount: number) => {
    const coupon = getCoupon(code)
    if (!coupon) {
      return { valid: false, discount: 0 }
    }

    // 유효기간 확인
    const today = new Date().toISOString().split('T')[0]
    if (today < coupon.validFrom || today > coupon.validUntil) {
      return { valid: false, discount: 0 }
    }

    // 사용횟수 확인
    if (coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, discount: 0 }
    }

    // 최소 금액 확인
    if (coupon.minAmount && amount < coupon.minAmount) {
      return { valid: false, discount: 0 }
    }

    // 할인 금액 계산
    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = Math.round(amount * (coupon.discount / 100))
    } else {
      discount = coupon.discount
    }

    return { valid: true, discount }
  }

  const value: DataContextType = {
    // 환자 데이터
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    getPatientAppointments,
    getPatientStats,

    // 예약 데이터
    appointments,
    addAppointment,
    updateAppointment,
    completeAppointment,
    cancelAppointment,
    getAppointmentsByDate,
    getTodayAppointments,

    // 매출 데이터
    revenues,
    addRevenue,
    getRevenueByDate,
    getMonthlyRevenue,
    getTotalRevenueByMonth,

    // 일일 서비스 데이터
    dailyServices,
    addDailyService,
    getDailyServicesByDate,

    // 통계
    getTodayStats,
    getWeekStats,

    // 가격 계산
    calculateServicePrice,

    // 쿠폰 데이터
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    validateCoupon
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}