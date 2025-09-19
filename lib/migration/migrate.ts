import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Patient, Appointment, Revenue, DailyServiceData, Coupon } from '@/lib/context/DataContext'

export interface MigrationProgress {
  total: number
  completed: number
  current: string
  errors: string[]
}

export interface MigrationResult {
  success: boolean
  migrated: {
    patients: number
    appointments: number
    revenues: number
    dailyServices: number
    coupons: number
    packages: number
  }
  errors: string[]
  backupData?: any
}

export class DataMigrationService {
  private progress: MigrationProgress = {
    total: 0,
    completed: 0,
    current: '',
    errors: []
  }

  private onProgress?: (progress: MigrationProgress) => void

  constructor(onProgress?: (progress: MigrationProgress) => void) {
    this.onProgress = onProgress
  }

  /**
   * localStorage에서 데이터를 백업합니다
   */
  public async backupLocalData(): Promise<any> {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        data: {} as Record<string, any>
      }

      // localStorage에서 기존 데이터 가져오기
      const keys = ['seroumsu_data', 'supabase_cache']

      for (const key of keys) {
        const data = localStorage.getItem(key)
        if (data) {
          try {
            backupData.data[key] = JSON.parse(data)
          } catch (error) {
            console.warn(`Failed to parse ${key}:`, error)
            backupData.data[key] = data // 원본 문자열로 저장
          }
        }
      }

      // 백업 파일로 저장
      const backupString = JSON.stringify(backupData, null, 2)
      const blob = new Blob([backupString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `seroumsu_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return backupData
    } catch (error) {
      console.error('Failed to backup local data:', error)
      throw new Error(`백업 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  /**
   * 백업 파일에서 데이터를 복원합니다
   */
  public async restoreFromBackup(file: File): Promise<void> {
    try {
      const text = await file.text()
      const backupData = JSON.parse(text)

      if (!backupData.data) {
        throw new Error('올바르지 않은 백업 파일 형식입니다.')
      }

      // localStorage에 데이터 복원
      for (const [key, data] of Object.entries(backupData.data)) {
        if (typeof data === 'string') {
          localStorage.setItem(key, data)
        } else {
          localStorage.setItem(key, JSON.stringify(data))
        }
      }

      console.log('Data restored from backup successfully')
    } catch (error) {
      console.error('Failed to restore from backup:', error)
      throw new Error(`복원 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  /**
   * localStorage 데이터를 Supabase로 마이그레이션합니다
   */
  public async migrateToSupabase(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migrated: {
        patients: 0,
        appointments: 0,
        revenues: 0,
        dailyServices: 0,
        coupons: 0,
        packages: 0
      },
      errors: []
    }

    try {
      // 백업 생성
      result.backupData = await this.backupLocalData()

      // localStorage에서 데이터 로드
      const localData = this.loadLocalData()
      if (!localData) {
        throw new Error('마이그레이션할 데이터가 없습니다.')
      }

      const { patients, appointments, revenues, dailyServices, coupons } = localData

      // 전체 작업 수 계산
      this.progress.total =
        (patients?.length || 0) +
        (appointments?.length || 0) +
        (revenues?.length || 0) +
        (dailyServices?.length || 0) +
        (coupons?.length || 0)

      this.progress.completed = 0
      this.progress.errors = []

      // 데이터베이스 연결 테스트
      await this.testDatabaseConnection()

      // 순차적으로 마이그레이션 실행
      if (patients?.length) {
        result.migrated.patients = await this.migratePatients(patients)
      }

      if (appointments?.length) {
        result.migrated.appointments = await this.migrateAppointments(appointments)
      }

      if (revenues?.length) {
        result.migrated.revenues = await this.migrateRevenues(revenues)
      }

      if (dailyServices?.length) {
        result.migrated.dailyServices = await this.migrateDailyServices(dailyServices)
      }

      if (coupons?.length) {
        result.migrated.coupons = await this.migrateCoupons(coupons)
      }

      // 패키지 데이터 마이그레이션
      result.migrated.packages = await this.migratePackages(patients || [])

      result.success = true
      result.errors = this.progress.errors

      console.log('Migration completed successfully:', result)
      return result

    } catch (error) {
      console.error('Migration failed:', error)
      result.success = false
      result.errors.push(error instanceof Error ? error.message : '알 수 없는 오류')
      return result
    }
  }

  private async testDatabaseConnection(): Promise<void> {
    try {
      const { error } = await supabase.from('patients').select('count').limit(1)
      if (error) throw error
    } catch (error) {
      throw new Error('데이터베이스 연결에 실패했습니다. Supabase 설정을 확인해주세요.')
    }
  }

  private loadLocalData(): any {
    try {
      const seroumsuData = localStorage.getItem('seroumsu_data')
      const cacheData = localStorage.getItem('supabase_cache')

      let data = null

      // 우선 seroumsu_data에서 로드
      if (seroumsuData) {
        data = JSON.parse(seroumsuData)
      }
      // 없으면 캐시에서 로드
      else if (cacheData) {
        data = JSON.parse(cacheData)
      }

      if (!data) {
        return null
      }

      return {
        patients: data.patients || [],
        appointments: data.appointments || [],
        revenues: data.revenues || [],
        dailyServices: data.dailyServices || [],
        coupons: data.coupons || []
      }
    } catch (error) {
      console.error('Failed to load local data:', error)
      return null
    }
  }

  private async migratePatients(patients: Patient[]): Promise<number> {
    let migrated = 0

    for (const patient of patients) {
      try {
        this.updateProgress(`환자 마이그레이션 중: ${patient.name}`)

        const dbPatient: Database['public']['Tables']['patients']['Insert'] = {
          id: patient.id.startsWith('offline_') ? undefined : patient.id,
          name: patient.name,
          phone: patient.phone,
          email: patient.email || null,
          birth_date: patient.birthDate || null,
          registration_date: patient.registrationDate,
          last_visit: patient.lastVisit || null,
          total_visits: patient.totalVisits,
          total_spent: patient.totalSpent,
          favorite_services: patient.favoriteServices?.length ? patient.favoriteServices : null,
          notes: patient.notes || null,
          status: patient.status,
          membership: patient.membership || 'basic',
          visit_source: patient.visitSource || null
        }

        // 중복 확인
        const { data: existing } = await supabase
          .from('patients')
          .select('id')
          .eq('phone', patient.phone)
          .single()

        if (!existing) {
          const { error } = await supabase
            .from('patients')
            .insert(dbPatient)

          if (error) {
            this.progress.errors.push(`환자 ${patient.name} 마이그레이션 실패: ${error.message}`)
          } else {
            migrated++
          }
        } else {
          console.log(`Patient ${patient.name} already exists, skipping`)
        }

        this.progress.completed++
        this.onProgress?.(this.progress)

      } catch (error) {
        this.progress.errors.push(`환자 ${patient.name} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    return migrated
  }

  private async migrateAppointments(appointments: Appointment[]): Promise<number> {
    let migrated = 0

    for (const appointment of appointments) {
      try {
        this.updateProgress(`예약 마이그레이션 중: ${appointment.patientName}`)

        const dbAppointment: Database['public']['Tables']['appointments']['Insert'] = {
          id: appointment.id.startsWith('offline_') ? undefined : appointment.id,
          patient_id: appointment.patientId,
          patient_name: appointment.patientName,
          phone: appointment.phone,
          service_id: appointment.serviceId,
          service_name: appointment.serviceName,
          appointment_date: appointment.date,
          appointment_time: appointment.time,
          duration: appointment.duration,
          price: appointment.price,
          status: appointment.status,
          notes: appointment.notes || null,
          addon_백옥: appointment.addOns?.백옥 || false,
          addon_백옥더블: appointment.addOns?.백옥더블 || false,
          addon_가슴샘: appointment.addOns?.가슴샘 || false,
          addon_강력주사: appointment.addOns?.강력주사 || false,
          package_type: appointment.packageType || 'single',
          payment_status: appointment.paymentStatus || 'pending',
          created_by: appointment.createdBy || null
        }

        // 중복 확인 (같은 환자, 같은 날짜, 같은 시간)
        const { data: existing } = await supabase
          .from('appointments')
          .select('id')
          .eq('patient_id', appointment.patientId)
          .eq('appointment_date', appointment.date)
          .eq('appointment_time', appointment.time)
          .single()

        if (!existing) {
          const { error } = await supabase
            .from('appointments')
            .insert(dbAppointment)

          if (error) {
            this.progress.errors.push(`예약 ${appointment.patientName} 마이그레이션 실패: ${error.message}`)
          } else {
            migrated++
          }
        } else {
          console.log(`Appointment for ${appointment.patientName} already exists, skipping`)
        }

        this.progress.completed++
        this.onProgress?.(this.progress)

      } catch (error) {
        this.progress.errors.push(`예약 ${appointment.patientName} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    return migrated
  }

  private async migrateRevenues(revenues: Revenue[]): Promise<number> {
    let migrated = 0

    for (const revenue of revenues) {
      try {
        this.updateProgress(`매출 마이그레이션 중: ${revenue.date}`)

        // 중복 확인
        const { data: existing } = await supabase
          .from('revenues')
          .select('id')
          .eq('date', revenue.date)
          .single()

        if (!existing) {
          const { data: newRevenue, error: revenueError } = await supabase
            .from('revenues')
            .insert({
              date: revenue.date,
              iv_revenue: revenue.ivRevenue,
              endoscopy_revenue: revenue.endoscopyRevenue,
              total_revenue: revenue.totalRevenue
            })
            .select()
            .single()

          if (revenueError) {
            this.progress.errors.push(`매출 ${revenue.date} 마이그레이션 실패: ${revenueError.message}`)
          } else {
            // 매출 세부사항 추가
            if (revenue.serviceDetails?.length && newRevenue) {
              const details = revenue.serviceDetails.map(detail => ({
                revenue_id: newRevenue.id,
                service_id: detail.serviceId,
                service_name: detail.serviceId, // 서비스 이름은 ID로 대체
                count: detail.count,
                revenue: detail.revenue
              }))

              const { error: detailsError } = await supabase
                .from('revenue_details')
                .insert(details)

              if (detailsError) {
                this.progress.errors.push(`매출 세부사항 ${revenue.date} 마이그레이션 실패: ${detailsError.message}`)
              }
            }
            migrated++
          }
        } else {
          console.log(`Revenue for ${revenue.date} already exists, skipping`)
        }

        this.progress.completed++
        this.onProgress?.(this.progress)

      } catch (error) {
        this.progress.errors.push(`매출 ${revenue.date} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    return migrated
  }

  private async migrateDailyServices(dailyServices: DailyServiceData[]): Promise<number> {
    let migrated = 0

    for (const service of dailyServices) {
      try {
        this.updateProgress(`일일 서비스 마이그레이션 중: ${service.date}`)

        // 중복 확인
        const { data: existing } = await supabase
          .from('daily_services')
          .select('id')
          .eq('date', service.date)
          .eq('service_id', service.serviceId)
          .single()

        if (!existing) {
          const { error } = await supabase
            .from('daily_services')
            .insert({
              date: service.date,
              service_id: service.serviceId,
              service_name: service.serviceId,
              count: service.count,
              revenue: service.revenue
            })

          if (error) {
            this.progress.errors.push(`일일 서비스 ${service.date} 마이그레이션 실패: ${error.message}`)
          } else {
            migrated++
          }
        } else {
          console.log(`Daily service for ${service.date} already exists, skipping`)
        }

        this.progress.completed++
        this.onProgress?.(this.progress)

      } catch (error) {
        this.progress.errors.push(`일일 서비스 ${service.date} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    return migrated
  }

  private async migrateCoupons(coupons: Coupon[]): Promise<number> {
    let migrated = 0

    for (const coupon of coupons) {
      try {
        this.updateProgress(`쿠폰 마이그레이션 중: ${coupon.code}`)

        // 중복 확인
        const { data: existing } = await supabase
          .from('coupons')
          .select('id')
          .eq('code', coupon.code)
          .single()

        if (!existing) {
          const { error } = await supabase
            .from('coupons')
            .insert({
              id: coupon.id.startsWith('offline_') ? undefined : coupon.id,
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

          if (error) {
            this.progress.errors.push(`쿠폰 ${coupon.code} 마이그레이션 실패: ${error.message}`)
          } else {
            migrated++
          }
        } else {
          console.log(`Coupon ${coupon.code} already exists, skipping`)
        }

        this.progress.completed++
        this.onProgress?.(this.progress)

      } catch (error) {
        this.progress.errors.push(`쿠폰 ${coupon.code} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    return migrated
  }

  private async migratePackages(patients: Patient[]): Promise<number> {
    let migrated = 0

    for (const patient of patients) {
      if (!patient.packages?.length) continue

      for (const pkg of patient.packages) {
        try {
          this.updateProgress(`패키지 마이그레이션 중: ${patient.name} - ${pkg.serviceName}`)

          // 중복 확인
          const { data: existing } = await supabase
            .from('packages')
            .select('id')
            .eq('patient_id', patient.id)
            .eq('service_id', pkg.serviceId)
            .eq('purchase_date', pkg.purchaseDate)
            .single()

          if (!existing) {
            const { error } = await supabase
              .from('packages')
              .insert({
                patient_id: patient.id,
                service_id: pkg.serviceId,
                service_name: pkg.serviceName,
                total_count: pkg.totalCount,
                remaining_count: pkg.remainingCount,
                purchase_date: pkg.purchaseDate,
                expiry_date: pkg.expiryDate || null,
                purchase_price: 0 // 기본값
              })

            if (error) {
              this.progress.errors.push(`패키지 ${patient.name} - ${pkg.serviceName} 마이그레이션 실패: ${error.message}`)
            } else {
              migrated++
            }
          } else {
            console.log(`Package for ${patient.name} - ${pkg.serviceName} already exists, skipping`)
          }

        } catch (error) {
          this.progress.errors.push(`패키지 ${patient.name} - ${pkg.serviceName} 마이그레이션 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
        }
      }
    }

    return migrated
  }

  private updateProgress(current: string): void {
    this.progress.current = current
    this.onProgress?.(this.progress)
  }

  /**
   * 마이그레이션 상태를 초기화합니다
   */
  public resetProgress(): void {
    this.progress = {
      total: 0,
      completed: 0,
      current: '',
      errors: []
    }
  }

  /**
   * 현재 진행상황을 반환합니다
   */
  public getProgress(): MigrationProgress {
    return { ...this.progress }
  }
}

// 편의 함수들
export const createMigrationService = (onProgress?: (progress: MigrationProgress) => void) => {
  return new DataMigrationService(onProgress)
}

export const quickMigrate = async (): Promise<MigrationResult> => {
  const migration = new DataMigrationService()
  return await migration.migrateToSupabase()
}

export const backupData = async (): Promise<any> => {
  const migration = new DataMigrationService()
  return await migration.backupLocalData()
}

export const restoreData = async (file: File): Promise<void> => {
  const migration = new DataMigrationService()
  return await migration.restoreFromBackup(file)
}