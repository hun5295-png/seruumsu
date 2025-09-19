'use client'

import { useState } from 'react'
import { Calendar, Clock, TrendingUp, Users, Activity, DollarSign, ChevronRight, CheckCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { SERVICES } from '@/lib/data/services'
import { useData } from '@/lib/context/DataContext'
import toast from 'react-hot-toast'

export default function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const { getTodayAppointments, getAppointmentsByDate, getTodayStats, getWeekStats, updateAppointment, completeAppointment, cancelAppointment } = useData()

  // 선택된 날짜의 예약 가져오기 (취소된 예약 제외) - 로컬 날짜 사용
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1
  const day = selectedDate.getDate()
  const selectedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const selectedAppointments = getAppointmentsByDate(selectedDateStr)
    .filter(apt => apt.status !== 'cancelled')

  // 오늘 예약 (취소된 예약 제외)
  const todayAppointments = getTodayAppointments()
    .filter(apt => apt.status !== 'cancelled')

  // 오늘 통계
  const todayStats = getTodayStats()
  const weekStats = getWeekStats()

  // 미니 캘린더 렌더링
  const renderMiniCalendar = () => {
    const date = new Date(selectedDate)
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()

    const weekDays = ['일', '월', '화', '수', '목', '금', '토']
    const days = []

    // 빈 공간 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year

      days.push(
        <button
          key={day}
          onClick={() => {
            const newDate = new Date(year, month, day)
            setSelectedDate(newDate)
          }}
          className={`h-8 rounded-lg text-sm transition-colors ${
            isToday ? 'bg-primary-600 text-white font-bold' :
            isSelected ? 'bg-primary-100 text-primary-600 font-semibold' :
            'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      )
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">일일 업무</h1>
        <p className="text-gray-600 mt-1">오늘의 예약 현황과 업무를 확인하세요</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">오늘 예약</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayStats.appointments}건</p>
          <p className="text-xs text-gray-500 mt-1">{todayAppointments.filter(a => a.status === 'pending').length}건 대기중</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">완료 서비스</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayStats.completedServices}건</p>
          <p className="text-xs text-gray-500 mt-1">{todayStats.appointments > 0 ? Math.round((todayStats.completedServices / todayStats.appointments) * 100) : 0}% 진행률</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">오늘 매출</p>
            <DollarSign className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-primary-600">₩{todayStats.revenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">목표 대비 {todayStats.revenue > 0 ? Math.round((todayStats.revenue / 1000000) * 100) : 0}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">신규 환자</p>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayStats.newPatients}명</p>
          <p className="text-xs text-gray-500 mt-1">이번 주 총 {weekStats.newPatients}명</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Date's Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 예약
              </h2>
              <Link href="/staff/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                전체보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {selectedAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  선택한 날짜에 예약이 없습니다
                </div>
              ) : (
                selectedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{appointment.time.split(':')[0]}</p>
                        <p className="text-sm text-gray-500">{appointment.time.split(':')[1]}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'completed' ? '완료' :
                       appointment.status === 'confirmed' ? '확정' :
                       appointment.status === 'cancelled' ? '취소' : '대기'}
                    </span>
                  </div>
                </div>
              )))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/staff/reception" className="flex items-center gap-3 p-4 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <Plus className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">신규 접수</p>
                  <p className="text-sm text-gray-500">환자 접수 및 결제</p>
                </div>
              </Link>

              <Link href="/staff/appointments" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">예약 관리</p>
                  <p className="text-sm text-gray-500">예약 확인/변경</p>
                </div>
              </Link>

              <Link href="/staff/patients" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">환자 조회</p>
                  <p className="text-sm text-gray-500">환자 정보 검색</p>
                </div>
              </Link>

              <Link href="/staff/daily-input" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Activity className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">서비스 입력</p>
                  <p className="text-sm text-gray-500">오늘의 서비스 기록</p>
                </div>
              </Link>

              <Link href="/staff/revenue-input" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">매출 입력</p>
                  <p className="text-sm text-gray-500">일일 매출 등록</p>
                </div>
              </Link>

              <Link href="/staff/appointments" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">예약 관리</p>
                  <p className="text-sm text-gray-500">예약 확인/변경</p>
                </div>
              </Link>

              <Link href="/staff/patients" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">환자 조회</p>
                  <p className="text-sm text-gray-500">환자 정보 검색</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar & Stats */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                오늘
              </button>
            </div>
            {renderMiniCalendar()}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                선택된 날짜: {selectedDate.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
          </div>

          {/* Week Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">이번 주 실적</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">예약 건수</span>
                  <span className="font-semibold">{weekStats.appointments}건</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${Math.min((weekStats.appointments / 100) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">완료 서비스</span>
                  <span className="font-semibold">{weekStats.completedServices}건</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min((weekStats.completedServices / 50) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">주간 매출</span>
                  <span className="font-semibold">₩{weekStats.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((weekStats.revenue / 5000000) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예약 상세 모달 */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">예약 상세</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">환자명</p>
                <p className="font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">연락처</p>
                <p className="font-medium">{selectedAppointment.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">서비스</p>
                <p className="font-medium">{selectedAppointment.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">예약 일시</p>
                <p className="font-medium">
                  {new Date(selectedAppointment.date).toLocaleDateString('ko-KR')} {selectedAppointment.time}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">상태</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedAppointment.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedAppointment.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : selectedAppointment.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedAppointment.status === 'completed' ? '완료' :
                   selectedAppointment.status === 'confirmed' ? '확정' :
                   selectedAppointment.status === 'cancelled' ? '취소' : '대기'}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-600">메모</p>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                <>
                  {selectedAppointment.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateAppointment(selectedAppointment.id, { status: 'confirmed' })
                        toast.success('예약이 확정되었습니다')
                        setSelectedAppointment(null)
                      }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      확정
                    </button>
                  )}
                  <button
                    onClick={() => {
                      completeAppointment(selectedAppointment.id)
                      toast.success('서비스가 완료되고 매출이 기록되었습니다')
                      setSelectedAppointment(null)
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    완료
                  </button>
                  <button
                    onClick={() => {
                      cancelAppointment(selectedAppointment.id)
                      toast.success('예약이 취소되었습니다')
                      setSelectedAppointment(null)
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    취소
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}