'use client'

import { useState, useEffect } from 'react'
import { useData } from '@/lib/context/DataContext'
import { Calendar, TrendingUp, DollarSign, Package, ChevronLeft, ChevronRight } from 'lucide-react'

export default function RevenueReportPage() {
  const { revenues, appointments, getTotalRevenueByMonth, getMonthlyRevenue } = useData()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // 월별 일자별 매출 계산 (revenues와 appointments 모두 확인)
  const getDailyRevenue = (date: string) => {
    // appointments에서 매출 계산
    const dayAppointments = appointments.filter(a =>
      a.date === date &&
      (a.status === 'completed' || a.paymentStatus === 'paid')
    )
    const appointmentRevenue = dayAppointments.reduce((sum, a) => sum + a.price, 0)

    // revenues 테이블에서 매출 확인
    const dayRevenue = revenues.find(r => r.date === date)
    const revenueTableRevenue = dayRevenue ? dayRevenue.totalRevenue : 0

    // 두 값 중 큰 값을 반환 (중복 방지)
    return Math.max(appointmentRevenue, revenueTableRevenue)
  }

  // 선택된 날짜의 상세 매출 내역
  const getDateDetails = (date: string) => {
    return appointments.filter(a =>
      a.date === date &&
      (a.status === 'completed' || a.paymentStatus === 'paid')
    )
  }

  // 월 전체 매출 통계 (revenues와 appointments 모두 포함)
  const getMonthlyStats = () => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1)
    const endDate = new Date(selectedYear, selectedMonth, 0)

    // appointments에서 매출 계산
    const monthAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.date)
      return appointmentDate >= startDate &&
             appointmentDate <= endDate &&
             (a.status === 'completed' || a.paymentStatus === 'paid')
    })

    const appointmentRevenue = monthAppointments.reduce((sum, a) => sum + a.price, 0)

    // revenues 테이블에서 매출 계산
    const monthRevenues = getMonthlyRevenue(selectedYear, selectedMonth)
    const revenueTableTotal = monthRevenues.reduce((sum, r) => sum + r.totalRevenue, 0)

    // 두 값 중 큰 값을 사용 (중복 방지)
    const totalRevenue = Math.max(appointmentRevenue, revenueTableTotal)

    const totalCount = monthAppointments.length
    const averageRevenue = totalCount > 0 ? appointmentRevenue / totalCount : 0

    // 서비스별 매출 집계
    const serviceRevenue: Record<string, number> = {}

    // appointments에서 서비스별 매출
    monthAppointments.forEach(a => {
      if (!serviceRevenue[a.serviceName]) {
        serviceRevenue[a.serviceName] = 0
      }
      serviceRevenue[a.serviceName] += a.price
    })

    // revenues에서 서비스별 매출 추가
    monthRevenues.forEach(r => {
      r.serviceDetails?.forEach(sd => {
        // serviceId를 서비스명으로 변환이 필요한 경우
        // 여기서는 간단히 serviceId를 키로 사용
        const key = `Service-${sd.serviceId}`
        if (!serviceRevenue[key]) {
          serviceRevenue[key] = 0
        }
        serviceRevenue[key] += sd.revenue
      })
    })

    return {
      totalRevenue,
      totalCount,
      averageRevenue,
      serviceRevenue
    }
  }

  const monthlyStats = getMonthlyStats()

  // 달력 렌더링
  const renderCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay()
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    const days = []

    // 빈 공간
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const revenue = getDailyRevenue(dateStr)
      const isSelected = selectedDate === dateStr

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`p-2 border rounded hover:bg-gray-50 text-left transition-colors ${
            isSelected ? 'bg-primary-50 border-primary-600' : 'border-gray-200'
          }`}
        >
          <div className="text-sm font-medium">{day}일</div>
          {revenue > 0 && (
            <div className="text-xs text-primary-600 font-bold">
              ₩{(revenue / 1000).toFixed(0)}k
            </div>
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">매출 조회</h1>
        <p className="text-gray-600">자동으로 집계된 매출을 확인합니다</p>
      </div>

      {/* 월 선택 */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedMonth === 1) {
                setSelectedMonth(12)
                setSelectedYear(selectedYear - 1)
              } else {
                setSelectedMonth(selectedMonth - 1)
              }
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">
            {selectedYear}년 {selectedMonth}월
          </h2>
          <button
            onClick={() => {
              if (selectedMonth === 12) {
                setSelectedMonth(1)
                setSelectedYear(selectedYear + 1)
              } else {
                setSelectedMonth(selectedMonth + 1)
              }
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 월별 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">총 매출</span>
            <DollarSign className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-primary-600">
            ₩{monthlyStats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">총 건수</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{monthlyStats.totalCount}건</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">평균 단가</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold">
            ₩{Math.round(monthlyStats.averageRevenue).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">일평균</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">
            ₩{Math.round(monthlyStats.totalRevenue / 30).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 달력 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">일별 매출</h3>
          <div className="grid grid-cols-7 gap-2">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        {/* 서비스별 매출 */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">서비스별 매출</h3>
          <div className="space-y-3">
            {Object.entries(monthlyStats.serviceRevenue)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([service, revenue]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{service}</span>
                  <span className="font-medium">₩{revenue.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 선택된 날짜 상세 */}
      {selectedDate && (
        <div className="mt-6 bg-white p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">
            {selectedDate} 매출 상세
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">시간</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">환자명</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">서비스</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">패키지</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {getDateDetails(selectedDate).map(appointment => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2 text-sm">{appointment.time}</td>
                    <td className="px-4 py-2 text-sm">{appointment.patientName}</td>
                    <td className="px-4 py-2 text-sm">{appointment.serviceName}</td>
                    <td className="px-4 py-2 text-sm">
                      {appointment.packageType === 'single' ? '단회' :
                       appointment.packageType === '4times' ? '4회' : '8회'}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium">
                      ₩{appointment.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right font-semibold">합계</td>
                  <td className="px-4 py-2 text-right font-bold text-primary-600">
                    ₩{getDailyRevenue(selectedDate).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}