import { supabase } from './client'
import { Database } from './types'

// 타입 정의
type Patient = Database['public']['Tables']['patients']['Row']
type PatientInsert = Database['public']['Tables']['patients']['Insert']
type PatientUpdate = Database['public']['Tables']['patients']['Update']

type Service = Database['public']['Tables']['services']['Row']

type Appointment = Database['public']['Tables']['appointments']['Row']
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

type Package = Database['public']['Tables']['packages']['Row']
type PackageInsert = Database['public']['Tables']['packages']['Insert']

type Revenue = Database['public']['Tables']['revenues']['Row']
type RevenueInsert = Database['public']['Tables']['revenues']['Insert']

type Coupon = Database['public']['Tables']['coupons']['Row']
type CouponInsert = Database['public']['Tables']['coupons']['Insert']

// 환자 서비스
export const patientService = {
  // 모든 환자 조회
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // 환자 ID로 조회
  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // 전화번호로 환자 검색
  async getByPhone(phone: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // 환자 생성
  async create(patient: PatientInsert) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 환자 정보 업데이트
  async update(id: string, updates: PatientUpdate) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 환자 삭제
  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // 환자 검색 (이름, 전화번호)
  async search(query: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// 서비스 서비스
export const serviceService = {
  // 모든 서비스 조회
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('id')

    if (error) throw error
    return data
  },

  // 서비스 ID로 조회
  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // 카테고리별 서비스 조회
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('id')

    if (error) throw error
    return data
  }
}

// 예약 서비스
export const appointmentService = {
  // 모든 예약 조회
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false })

    if (error) throw error
    return data
  },

  // 환자별 예약 조회
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false })

    if (error) throw error
    return data
  },

  // 날짜별 예약 조회
  async getByDate(date: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', date)
      .order('appointment_time')

    if (error) throw error
    return data
  },

  // 오늘 예약 조회
  async getToday() {
    const today = new Date().toISOString().split('T')[0]
    return this.getByDate(today)
  },

  // 예약 생성
  async create(appointment: AppointmentInsert) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 예약 업데이트
  async update(id: string, updates: AppointmentUpdate) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 예약 완료 처리
  async complete(id: string) {
    return this.update(id, {
      status: 'completed',
      payment_status: 'paid'
    })
  },

  // 예약 취소
  async cancel(id: string) {
    return this.update(id, { status: 'cancelled' })
  }
}

// 패키지 서비스
export const packageService = {
  // 환자별 패키지 조회
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('patient_id', patientId)
      .gt('remaining_count', 0) // 잔여 횟수가 있는 것만
      .order('purchase_date', { ascending: false })

    if (error) throw error
    return data
  },

  // 패키지 생성
  async create(packageData: PackageInsert) {
    const { data, error } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 패키지 횟수 차감
  async usePackage(id: string) {
    // 현재 잔여 횟수 조회
    const { data: currentPackage, error: fetchError } = await supabase
      .from('packages')
      .select('remaining_count')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (currentPackage.remaining_count <= 0) {
      throw new Error('패키지 사용 횟수가 모두 소진되었습니다.')
    }

    // 횟수 차감
    const { data, error } = await supabase
      .from('packages')
      .update({ remaining_count: currentPackage.remaining_count - 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// 매출 서비스
export const revenueService = {
  // 날짜별 매출 조회
  async getByDate(date: string) {
    const { data, error } = await supabase
      .from('revenues')
      .select(`
        *,
        revenue_details (
          service_id,
          service_name,
          count,
          revenue
        )
      `)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // 기간별 매출 조회
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('revenues')
      .select(`
        *,
        revenue_details (
          service_id,
          service_name,
          count,
          revenue
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  // 월별 매출 조회
  async getByMonth(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    return this.getByDateRange(startDate, endDate)
  },

  // 매출 생성 또는 업데이트
  async createOrUpdate(revenueData: RevenueInsert) {
    // 해당 날짜의 매출이 이미 있는지 확인
    const existing = await this.getByDate(revenueData.date)

    if (existing) {
      // 업데이트
      const { data, error } = await supabase
        .from('revenues')
        .update({
          iv_revenue: (existing.iv_revenue || 0) + (revenueData.iv_revenue || 0),
          endoscopy_revenue: (existing.endoscopy_revenue || 0) + (revenueData.endoscopy_revenue || 0),
          total_revenue: (existing.total_revenue || 0) + (revenueData.total_revenue || 0)
        })
        .eq('date', revenueData.date)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // 새로 생성
      const { data, error } = await supabase
        .from('revenues')
        .insert(revenueData)
        .select()
        .single()

      if (error) throw error
      return data
    }
  }
}

// 쿠폰 서비스
export const couponService = {
  // 모든 쿠폰 조회
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // 활성 쿠폰 조회
  async getActive() {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', today)
      .gte('valid_until', today)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // 쿠폰 코드로 조회
  async getByCode(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // 쿠폰 생성
  async create(coupon: CouponInsert) {
    const { data, error } = await supabase
      .from('coupons')
      .insert(coupon)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 쿠폰 사용
  async use(id: string) {
    // 먼저 현재 사용 횟수 가져오기
    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select('usage_count')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // 사용 횟수 증가
    const { data, error } = await supabase
      .from('coupons')
      .update({ usage_count: (coupon?.usage_count || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 쿠폰 유효성 검증
  async validate(code: string, amount: number) {
    const coupon = await this.getByCode(code)

    if (!coupon) {
      return { valid: false, message: '유효하지 않은 쿠폰 코드입니다.' }
    }

    const today = new Date().toISOString().split('T')[0]

    // 유효기간 확인
    if (today < coupon.valid_from || today > coupon.valid_until) {
      return { valid: false, message: '쿠폰 사용 기간이 아닙니다.' }
    }

    // 사용횟수 확인
    if (coupon.max_usage > 0 && coupon.usage_count >= coupon.max_usage) {
      return { valid: false, message: '쿠폰 사용 한도를 초과했습니다.' }
    }

    // 최소 금액 확인
    if (coupon.min_amount && amount < coupon.min_amount) {
      return {
        valid: false,
        message: `최소 ${coupon.min_amount.toLocaleString()}원 이상 사용 시 적용 가능합니다.`
      }
    }

    // 할인 금액 계산
    let discount = 0
    if (coupon.discount_type === 'percentage') {
      discount = Math.round(amount * (coupon.discount / 100))
    } else {
      discount = coupon.discount
    }

    return {
      valid: true,
      discount,
      coupon
    }
  }
}

// 통계 서비스
export const statsService = {
  // 오늘 통계
  async getToday() {
    const today = new Date().toISOString().split('T')[0]

    // 오늘 예약
    const appointments = await appointmentService.getToday()

    // 오늘 매출
    const revenue = await revenueService.getByDate(today)

    // 오늘 신규 환자
    const { data: newPatients, error } = await supabase
      .from('patients')
      .select('*')
      .eq('registration_date', today)

    if (error) throw error

    return {
      appointments: appointments.length,
      completedServices: appointments.filter(a => a.status === 'completed').length,
      revenue: revenue?.total_revenue || 0,
      newPatients: newPatients?.length || 0
    }
  },

  // 주간 통계
  async getWeek() {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)

    const startDate = weekAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // 주간 예약
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)

    if (appointmentsError) throw appointmentsError

    // 주간 매출
    const revenues = await revenueService.getByDateRange(startDate, endDate)

    // 주간 신규 환자
    const { data: newPatients, error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .gte('registration_date', startDate)
      .lte('registration_date', endDate)

    if (patientsError) throw patientsError

    return {
      appointments: appointments?.length || 0,
      completedServices: appointments?.filter(a => a.status === 'completed').length || 0,
      revenue: revenues?.reduce((sum, r) => sum + (r.total_revenue || 0), 0) || 0,
      newPatients: newPatients?.length || 0
    }
  }
}