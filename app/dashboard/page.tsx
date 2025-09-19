'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Gift,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { useData } from '@/lib/context/DataContext'
import { SERVICES } from '@/lib/data/services'

export default function DashboardPage() {
  const { getTodayStats, getWeekStats, appointments, patients, revenues, coupons } = useData()

  const todayStats = getTodayStats()
  const weekStats = getWeekStats()

  // 이번 달 통계 계산
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date)
    return aptDate.getMonth() === currentMonth &&
           aptDate.getFullYear() === currentYear &&
           apt.status !== 'cancelled'
  })

  const monthRevenue = revenues
    .filter(r => {
      const date = new Date(r.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, r) => sum + r.totalRevenue, 0)

  const monthPatients = new Set(monthAppointments.map(apt => apt.patientId)).size
  const activeServices = SERVICES.filter(s => s.isActive).length
  const activeCoupons = coupons.filter(c => c.isActive && new Date(c.validUntil) > new Date()).length

  const cards = [
    {
      title: '오늘 매출',
      value: formatCurrency(todayStats.revenue),
      icon: DollarSign,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '이번 달 매출',
      value: formatCurrency(monthRevenue),
      icon: TrendingUp,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '오늘 방문',
      value: `${todayStats.appointments}명`,
      icon: Users,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '이번 달 방문',
      value: `${formatNumber(monthPatients)}명`,
      icon: Calendar,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '활성 서비스',
      value: `${activeServices}개`,
      icon: Activity,
      change: '',
      changeType: 'neutral',
    },
    {
      title: '사용가능 쿠폰',
      value: `${activeCoupons}개`,
      icon: Gift,
      change: '',
      changeType: 'neutral',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">세로움 수액센터 운영 현황</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : card.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">인기 서비스 TOP 5</h2>
          <div className="space-y-3">
            {(() => {
              // 서비스별 예약 횟수 집계
              const serviceStats = appointments
                .filter(apt => apt.status !== 'cancelled')
                .reduce((acc, apt) => {
                  const service = SERVICES.find(s => s.id === apt.serviceId)
                  if (service) {
                    acc[service.name] = (acc[service.name] || 0) + 1
                  }
                  return acc
                }, {} as Record<string, number>)

              const sortedServices = Object.entries(serviceStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)

              const maxCount = sortedServices[0]?.[1] || 1

              return sortedServices.length > 0 ? sortedServices.map(([name, count], index) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {name}
                      </span>
                      <span className="text-sm text-gray-600">{count}회</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-4">
                  아직 서비스 이용 데이터가 없습니다
                </div>
              )
            })()}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            {appointments.slice(-5).reverse().map((apt, idx) => (
              <div key={apt.id} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-500' :
                  apt.status === 'confirmed' ? 'bg-blue-500' :
                  apt.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm font-medium text-gray-900 flex-1">
                  {apt.patientName} - {apt.serviceName}
                </span>
                <span className="text-sm text-gray-600">{apt.date}</span>
              </div>
            )).length > 0 ? appointments.slice(-5).reverse().map((apt, idx) => (
              <div key={apt.id} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-500' :
                  apt.status === 'confirmed' ? 'bg-blue-500' :
                  apt.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm font-medium text-gray-900 flex-1">
                  {apt.patientName} - {apt.serviceName}
                </span>
                <span className="text-sm text-gray-600">{apt.date}</span>
              </div>
            )) : (
              <div className="text-center text-gray-500 py-4">
                아직 예약 데이터가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}