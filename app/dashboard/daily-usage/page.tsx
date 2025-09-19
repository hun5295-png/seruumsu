'use client'

import { useState } from 'react'
import { Calendar, Download, Plus, Minus, Copy } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useData } from '@/lib/context/DataContext'
import { SERVICES } from '@/lib/data/services'
import { SERVICE_CATEGORIES } from '@/lib/types'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function DailyUsagePage() {
  const { dailyServices, addDailyService, getDailyServicesByDate } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const todayUsageData = getDailyServicesByDate(selectedDateStr)

  // Create a map for easy lookup
  const usageMap = new Map<string, number>()
  todayUsageData.forEach(item => {
    usageMap.set(item.serviceId, item.count)
  })


  const updateUsage = (serviceId: string, delta: number) => {
    const currentCount = usageMap.get(serviceId) || 0
    const newCount = Math.max(0, currentCount + delta)

    const service = SERVICES.find(s => s.id === serviceId)
    if (!service) return

    if (newCount === 0) {
      // Remove the daily service entry if count becomes 0
      // This would need to be implemented in DataContext
      return
    }

    addDailyService({
      date: selectedDateStr,
      serviceId,
      count: newCount,
      revenue: newCount * service.basePrice
    })

    toast.success('저장되었습니다.')
  }

  const copyPreviousDay = () => {
    const previousDate = new Date(selectedDate)
    previousDate.setDate(previousDate.getDate() - 1)
    const previousDateStr = format(previousDate, 'yyyy-MM-dd')

    const previousDayData = getDailyServicesByDate(previousDateStr)

    if (previousDayData.length === 0) {
      toast.error('전날 데이터가 없습니다.')
      return
    }

    // Copy previous day's data to current date
    previousDayData.forEach(item => {
      addDailyService({
        date: selectedDateStr,
        serviceId: item.serviceId,
        count: item.count,
        revenue: item.revenue
      })
    })

    toast.success('전날 데이터를 복사했습니다.')
  }

  const exportToExcel = () => {
    const data = filteredServices.map(service => ({
      카테고리: service.category,
      서비스명: service.name,
      이용건수: usageMap.get(service.id) || 0,
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '일별이용현황')

    const fileName = `일별이용현황_${format(selectedDate, 'yyyy-MM-dd')}.xlsx`
    XLSX.writeFile(wb, fileName)
    toast.success('엑셀 파일이 다운로드되었습니다.')
  }

  const filteredServices = SERVICES.filter(
    s => s.isActive && (selectedCategory === 'all' || s.category === selectedCategory)
  )

  const totalCount = filteredServices.reduce(
    (sum, service) => sum + (usageMap.get(service.id) || 0),
    0
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">일별 이용현황</h1>
        <p className="text-gray-600 mt-2">서비스별 일일 이용 건수 관리</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">전체 카테고리</option>
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyPreviousDay}
              className="btn-outline flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              전날 복사
            </button>
            <button
              onClick={exportToExcel}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {format(selectedDate, 'yyyy년 MM월 dd일')} 총 이용 건수
          </h2>
          <span className="text-2xl font-bold text-primary-600">{totalCount}건</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(service => {
          const count = usageMap.get(service.id) || 0
          return (
            <div key={service.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <span className="text-xs text-gray-600">{service.category}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    ₩{service.basePrice.toLocaleString()}
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary-600">{count}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateUsage(service.id, -10)}
                  className="flex-1 btn-outline py-1 text-xs"
                >
                  -10
                </button>
                <button
                  onClick={() => updateUsage(service.id, -1)}
                  className="flex-1 btn-outline py-1"
                >
                  <Minus className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateUsage(service.id, 1)}
                  className="flex-1 btn-primary py-1"
                >
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateUsage(service.id, 10)}
                  className="flex-1 btn-primary py-1 text-xs"
                >
                  +10
                </button>
              </div>

              {count > 0 && (
                <div className="mt-2 text-xs text-gray-600 text-center">
                  예상 매출: ₩{(count * service.basePrice).toLocaleString()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}