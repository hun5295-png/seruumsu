'use client'

import { useState } from 'react'
import { Calendar, TrendingUp, Download, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useData } from '@/lib/context/DataContext'
import { formatCurrency } from '@/lib/utils/format'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function RevenuePage() {
  const { revenues, addRevenue, getMonthlyRevenue, appointments } = useData()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState({ iv: 0, endoscopy: 0 })

  const monthlyRevenue = getMonthlyRevenue(selectedYear, selectedMonth)

  // 예약 데이터에서 일별 수액센터 매출 계산
  const calculateDailyIVRevenue = (date: string) => {
    return appointments
      .filter(apt => {
        // 날짜 비교를 정확하게 하기 위해 날짜 부분만 추출
        const aptDate = apt.date.split('T')[0]
        return aptDate === date &&
          apt.status === 'completed' &&
          apt.paymentStatus === 'paid'
      })
      .reduce((sum, apt) => sum + (apt.price || 0), 0)
  }


  const updateRevenue = (date: string) => {
    const totalRevenue = tempValues.iv + tempValues.endoscopy

    addRevenue({
      date,
      ivRevenue: tempValues.iv,
      endoscopyRevenue: tempValues.endoscopy,
      totalRevenue,
      serviceDetails: [] // This would need to be calculated based on actual service usage
    })

    setEditingDate(null)
    toast.success('매출이 저장되었습니다.')
  }

  const startEditing = (date: string, existingData?: any) => {
    setEditingDate(date)
    // 수액센터 매출은 예약 데이터에서 자동 계산
    const ivRevenueFromAppointments = calculateDailyIVRevenue(date)
    setTempValues({
      iv: existingData?.ivRevenue || ivRevenueFromAppointments,
      endoscopy: existingData?.endoscopyRevenue || 0,
    })
  }

  const exportToExcel = () => {
    const data = monthlyRevenue.map(item => ({
      날짜: format(new Date(item.date), 'yyyy-MM-dd'),
      수액센터: item.ivRevenue,
      내시경: item.endoscopyRevenue,
      총매출: item.totalRevenue,
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '매출현황')

    const fileName = `매출현황_${selectedYear}년_${selectedMonth}월.xlsx`
    XLSX.writeFile(wb, fileName)
    toast.success('엑셀 파일이 다운로드되었습니다.')
  }

  // 차트 데이터 (예약 데이터 포함)
  const chartData = {
    labels: monthlyRevenue.map(item => format(new Date(item.date), 'MM/dd')),
    datasets: [
      {
        label: '수액센터',
        data: monthlyRevenue.map(item => {
          const dailyIVRevenue = calculateDailyIVRevenue(item.date)
          return item.ivRevenue || dailyIVRevenue
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: '내시경',
        data: monthlyRevenue.map(item => item.endoscopyRevenue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  // 통계 계산 (예약 데이터 포함)
  const appointmentRevenue = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.getFullYear() === selectedYear &&
             aptDate.getMonth() + 1 === selectedMonth &&
             apt.status === 'completed' &&
             apt.paymentStatus === 'paid'
    })
    .reduce((sum, apt) => sum + (apt.price || 0), 0)

  const totalIvRevenue = monthlyRevenue.reduce((sum, item) => sum + item.ivRevenue, 0) + appointmentRevenue
  const totalEndoscopyRevenue = monthlyRevenue.reduce((sum, item) => sum + item.endoscopyRevenue, 0)
  const totalRevenue = totalIvRevenue + totalEndoscopyRevenue
  const avgDailyRevenue = monthlyRevenue.length > 0 ? totalRevenue / monthlyRevenue.length : 0

  // 일별 매출 생성
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
  const allDates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(selectedYear, selectedMonth - 1, i + 1)
    return format(date, 'yyyy-MM-dd')
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">매출 관리</h1>
        <p className="text-gray-600 mt-2">수액센터 및 내시경 매출 관리</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input w-32"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="input w-32"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </div>

          <button
            onClick={exportToExcel}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-gray-600">수액센터 매출</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalIvRevenue)}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">내시경 매출</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEndoscopyRevenue)}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">총 매출</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">일 평균</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(avgDailyRevenue)}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">매출 추이</h2>
        <div style={{ height: '300px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">일별 매출 입력</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">날짜</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">수액센터</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">내시경</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">총 매출</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody>
              {allDates.map(date => {
                const existing = monthlyRevenue.find(item => item.date === date)
                const isEditing = editingDate === date
                // 예약 데이터에서 수액센터 매출 계산
                const dailyIVRevenue = calculateDailyIVRevenue(date)
                const displayIVRevenue = existing?.ivRevenue || dailyIVRevenue

                return (
                  <tr key={date} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(date), 'MM월 dd일 (E)', { locale: ko })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempValues.iv}
                          onChange={(e) => setTempValues({ ...tempValues, iv: Number(e.target.value) })}
                          className="input w-32 text-right"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm">
                          {displayIVRevenue > 0 ? formatCurrency(displayIVRevenue) : '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempValues.endoscopy}
                          onChange={(e) => setTempValues({ ...tempValues, endoscopy: Number(e.target.value) })}
                          className="input w-32 text-right"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm">
                          {existing ? formatCurrency(existing.endoscopyRevenue) : '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {existing ? formatCurrency(existing.totalRevenue + (displayIVRevenue - existing.ivRevenue)) :
                       (displayIVRevenue > 0 ? formatCurrency(displayIVRevenue) : '-')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => updateRevenue(date)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingDate(null)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(date, existing)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {existing ? '수정' : '입력'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}