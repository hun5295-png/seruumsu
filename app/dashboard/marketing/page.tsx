'use client'

import { useState } from 'react'
import { TrendingUp, Users, Calendar, Target, BarChart3, PieChart, ArrowUp, ArrowDown, Globe, UserCheck, Building, MessageCircle, Stethoscope, UserPlus } from 'lucide-react'
import { useData } from '@/lib/context/DataContext'
import { SERVICES } from '@/lib/data/services'

export default function MarketingPage() {
  const [period, setPeriod] = useState('month')
  const { patients, appointments, revenues } = useData()

  // 방문경로별 통계 계산
  const getVisitSourceStats = () => {
    const sourceStats: Record<string, number> = {
      '검색': 0,
      '직원소개': 0,
      '원내광고': 0,
      '이벤트메세지': 0,
      '내시경실': 0,
      '진료': 0,
      '지인소개': 0,
      '기타': 0
    }

    patients.forEach(patient => {
      const source = patient.visitSource || '기타'
      if (source in sourceStats) {
        sourceStats[source]++
      }
    })

    return Object.entries(sourceStats).map(([source, count]) => ({
      source,
      count,
      percentage: patients.length > 0 ? ((count / patients.length) * 100).toFixed(1) : '0'
    }))
  }

  const visitSourceStats = getVisitSourceStats()

  // 기간별 데이터 계산 함수
  const getMetricsForPeriod = (period: string) => {
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date
    let previousEndDate: Date

    if (period === 'week') {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      previousStartDate = new Date(startDate)
      previousStartDate.setDate(startDate.getDate() - 7)
      previousEndDate = new Date(startDate)
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0)
    } else { // year
      startDate = new Date(now.getFullYear(), 0, 1)
      previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
      previousEndDate = new Date(now.getFullYear() - 1, 11, 31)
    }

    // 현재 기간 환자
    const currentPeriodPatients = patients.filter(p => {
      const regDate = new Date(p.registrationDate)
      return regDate >= startDate && regDate <= now
    })

    // 이전 기간 환자
    const previousPeriodPatients = patients.filter(p => {
      const regDate = new Date(p.registrationDate)
      return regDate >= previousStartDate && regDate <= previousEndDate
    })

    // 신규 환자 변화율 계산
    const newPatientsChange = previousPeriodPatients.length > 0
      ? ((currentPeriodPatients.length - previousPeriodPatients.length) / previousPeriodPatients.length) * 100
      : 0

    // 현재 기간 총 수익
    const currentRevenue = currentPeriodPatients.reduce((sum, p) => sum + p.totalSpent, 0)
    const previousRevenue = previousPeriodPatients.reduce((sum, p) => sum + p.totalSpent, 0)

    // 평균 고객 가치 변화율
    const currentAvgValue = currentPeriodPatients.length > 0 ? currentRevenue / currentPeriodPatients.length : 0
    const previousAvgValue = previousPeriodPatients.length > 0 ? previousRevenue / previousPeriodPatients.length : 0
    const avgValueChange = previousAvgValue > 0
      ? ((currentAvgValue - previousAvgValue) / previousAvgValue) * 100
      : 0

    // 재방문율 계산 (현재 기간)
    const currentRetentionRate = currentPeriodPatients.length > 0
      ? (currentPeriodPatients.filter(p => p.totalVisits > 1).length / currentPeriodPatients.length) * 100
      : 0

    const previousRetentionRate = previousPeriodPatients.length > 0
      ? (previousPeriodPatients.filter(p => p.totalVisits > 1).length / previousPeriodPatients.length) * 100
      : 0

    const retentionRateChange = previousRetentionRate > 0
      ? ((currentRetentionRate - previousRetentionRate) / previousRetentionRate) * 100
      : 0

    return {
      newPatients: {
        value: currentPeriodPatients.length,
        change: newPatientsChange,
        trend: newPatientsChange >= 0 ? 'up' : 'down'
      },
      conversionRate: {
        value: currentPeriodPatients.length > 0 ?
          (currentPeriodPatients.filter(p => p.totalVisits > 0).length / currentPeriodPatients.length) * 100 : 0,
        change: 0,
        trend: 'up' as const
      },
      avgCustomerValue: {
        value: currentAvgValue,
        change: avgValueChange,
        trend: avgValueChange >= 0 ? 'up' : 'down'
      },
      retentionRate: {
        value: currentRetentionRate,
        change: retentionRateChange,
        trend: retentionRateChange >= 0 ? 'up' : 'down'
      }
    }
  }

  const marketingMetrics = getMetricsForPeriod(period)

  const channelPerformance = visitSourceStats.filter(s => s.count > 0).map(s => ({
    channel: s.source,
    visits: s.count,
    conversions: Math.floor(s.count * 0.7),
    rate: parseFloat(s.percentage)
  }))

  // 기간별 인기 서비스 계산
  const getPopularServicesForPeriod = (period: string) => {
    const now = new Date()
    let startDate: Date

    if (period === 'week') {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else { // year
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    // 해당 기간의 예약 필터링
    const periodAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startDate && aptDate <= now && apt.status !== 'cancelled'
    })

    // 서비스별 통계 계산
    const serviceStats: Record<string, { count: number, revenue: number }> = {}

    periodAppointments.forEach(apt => {
      const service = SERVICES.find(s => s.id === apt.serviceId)
      if (service) {
        if (!serviceStats[service.name]) {
          serviceStats[service.name] = { count: 0, revenue: 0 }
        }
        serviceStats[service.name].count++
        serviceStats[service.name].revenue += apt.price || 0
      }
    })

    return Object.entries(serviceStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const popularServices = getPopularServicesForPeriod(period)

  const getSourceIcon = (source: string) => {
    switch(source) {
      case '검색': return <Globe className="w-4 h-4" />
      case '직원소개': return <UserCheck className="w-4 h-4" />
      case '원내광고': return <Building className="w-4 h-4" />
      case '이벤트메세지': return <MessageCircle className="w-4 h-4" />
      case '내시경실': return <Stethoscope className="w-4 h-4" />
      case '진료': return <Stethoscope className="w-4 h-4" />
      case '지인소개': return <UserPlus className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getPeriodText = (period: string) => {
    switch(period) {
      case 'week': return '주간'
      case 'month': return '월간'
      case 'year': return '연간'
      default: return '월간'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">마케팅 분석</h1>
          <p className="text-gray-600 mt-1">{getPeriodText(period)} 데이터</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded ${period === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >
            주간
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded ${period === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >
            월간
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded ${period === 'year' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >
            연간
          </button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">신규 환자</span>
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{marketingMetrics.newPatients.value}명</p>
              <p className={`text-sm flex items-center gap-1 ${marketingMetrics.newPatients.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {marketingMetrics.newPatients.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {marketingMetrics.newPatients.change}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">전환율</span>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{marketingMetrics.conversionRate.value}%</p>
              <p className={`text-sm flex items-center gap-1 ${marketingMetrics.conversionRate.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {marketingMetrics.conversionRate.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(marketingMetrics.conversionRate.change)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">평균 고객 가치</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">₩{Math.round(marketingMetrics.avgCustomerValue.value).toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 ${marketingMetrics.avgCustomerValue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {marketingMetrics.avgCustomerValue.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {marketingMetrics.avgCustomerValue.change}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">재방문율</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{marketingMetrics.retentionRate.value.toFixed(0)}%</p>
              <p className={`text-sm flex items-center gap-1 ${marketingMetrics.retentionRate.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {marketingMetrics.retentionRate.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {marketingMetrics.retentionRate.change}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 방문경로 통계 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">방문경로별 유입 분석</h2>
          <div className="space-y-3">
            {visitSourceStats.map((stat) => (
              <div key={stat.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSourceIcon(stat.source)}
                  <span className="text-sm">{stat.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{stat.count}명</span>
                  <span className="text-xs text-gray-500 w-12 text-right">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">채널별 성과</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 pb-2">채널</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-2">방문</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-2">전환</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-2">전환율</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel) => (
                  <tr key={channel.channel} className="border-b">
                    <td className="py-3 text-sm">{channel.channel}</td>
                    <td className="py-3 text-sm text-right">{channel.visits}</td>
                    <td className="py-3 text-sm text-right">{channel.conversions}</td>
                    <td className="py-3 text-sm text-right font-medium text-primary-600">
                      {channel.rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 인기 서비스 */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">인기 서비스 TOP 5</h2>
        <div className="space-y-3">
          {popularServices.map((service, index) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-600">{service.count}건</span>
                <span className="text-sm font-bold text-primary-600">₩{service.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}