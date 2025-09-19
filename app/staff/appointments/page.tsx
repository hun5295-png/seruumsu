'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Phone, ChevronLeft, ChevronRight, Plus, Search, Filter, X } from 'lucide-react'
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/data/services'
import { useData } from '@/lib/context/DataContext'
import toast from 'react-hot-toast'

interface Appointment {
  id: string
  patientName: string
  phone: string
  serviceId: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
}

export default function AppointmentsPage() {
  const { patients, appointments: contextAppointments, addAppointment, updateAppointment, cancelAppointment, completeAppointment } = useData()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [appointmentFormDate, setAppointmentFormDate] = useState<string>('')
  const [appointmentFormTime, setAppointmentFormTime] = useState<string>('')

  // DataContext의 예약 데이터를 사용 (취소된 예약은 제외)
  const appointments = contextAppointments
    .filter(apt => apt.status !== 'cancelled') // 취소된 예약 제외
    .map(apt => ({
      id: apt.id,
      patientName: apt.patientName,
      phone: apt.phone,
      serviceId: apt.serviceId,
      date: apt.date,
      time: apt.time,
      status: apt.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
      notes: apt.notes
    }))

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getAppointmentsForDate = (date: string) => {
    console.log('Filtering appointments for date:', date)
    const filtered = appointments.filter(apt => {
      console.log('Comparing:', apt.date, 'with', date, 'Result:', apt.date === date)
      return apt.date === date
    })
    console.log('Found appointments:', filtered)
    return filtered
  }

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setSelectedDate(newDate)
  }

  // 예약 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '확정'
      case 'pending': return '대기'
      case 'cancelled': return '취소'
      case 'completed': return '완료'
      default: return status
    }
  }

  // 월별 캘린더 렌더링
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(selectedDate)
    const firstDay = getFirstDayOfMonth(selectedDate)
    const days = []
    const weekDays = ['일', '월', '화', '수', '목', '금', '토']

    // 빈 공간 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-r border-b"></div>)
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      console.log('Calendar date string:', dateString)
      const dayAppointments = getAppointmentsForDate(dateString)
      const isToday = new Date().toDateString() === new Date(year, selectedDate.getMonth(), day).toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border-r border-b p-1 ${isToday ? 'bg-primary-50' : 'hover:bg-gray-50'} cursor-pointer`}
          onClick={(e) => {
            // 날짜 클릭시 해당 날짜로 선택
            const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
            const clickedDateString = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            setSelectedDate(clickedDate)
            setAppointmentFormDate(clickedDateString)

            // 예약 클릭이 아닌 경우에만 새 예약 추가 모달 열기
            const isAppointmentClick = (e.target as HTMLElement).closest('.appointment-item')
            if (!isAppointmentClick) {
              setShowNewAppointment(true)
            }
          }}
        >
          <div className="font-medium text-sm mb-1 flex justify-between pointer-events-none">
            <span className={isToday ? 'text-primary-600 font-bold' : ''}>{day}</span>
            {dayAppointments.length > 0 && (
              <span className="text-xs bg-primary-600 text-white px-1 rounded">
                {dayAppointments.length}
              </span>
            )}
          </div>
          <div className="space-y-0.5 overflow-y-auto max-h-16">
            {dayAppointments.slice(0, 3).map((apt, idx) => {
              const service = SERVICES.find(s => s.id === apt.serviceId)
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAppointment(apt)
                  }}
                  className="appointment-item text-xs p-1 rounded bg-primary-100 text-primary-700 cursor-pointer hover:bg-primary-200 truncate"
                  data-apt-id={apt.id}
                >
                  {apt.time} {apt.patientName}
                </div>
              )
            })}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 px-1">+{dayAppointments.length - 3} more</div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center font-medium text-sm border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    )
  }

  // 주간 뷰 렌더링
  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate)
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

    const weekDays: Date[] = []
    const weekDayNames = ['일', '월', '화', '수', '목', '금', '토']

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }

    const timeSlots: string[] = []
    for (let hour = 9; hour < 19; hour++) {
      timeSlots.push(`${String(hour).padStart(2, '0')}:00`)
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 border-r bg-gray-50"></div>
          {weekDays.map((date, idx) => {
            const isToday = new Date().toDateString() === date.toDateString()
            const isSelected = selectedDate.toDateString() === date.toDateString()
            return (
              <div
                key={idx}
                className={`p-3 text-center border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-primary-50' : isSelected ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs text-gray-500">{weekDayNames[idx]}</div>
                <div className={`text-lg font-medium ${isToday ? 'text-primary-600' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b">
              <div className="p-2 text-sm text-gray-600 border-r bg-gray-50">
                {time}
              </div>
              {weekDays.map((date, idx) => {
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayAppointments = getAppointmentsForDate(dateString)
                const appointment = dayAppointments.find(apt => apt.time.startsWith(time.substring(0, 2)))

                return (
                  <div
                    key={idx}
                    className="p-2 border-r last:border-r-0 hover:bg-gray-50 min-h-[60px]"
                    onClick={() => {
                      if (!appointment) {
                        setSelectedDate(date)
                        const clickedDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                        setAppointmentFormDate(clickedDateString)
                        setAppointmentFormTime(time)
                        setShowNewAppointment(true)
                      }
                    }}
                  >
                    {appointment ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAppointment(appointment)
                        }}
                        className="p-1 rounded bg-primary-100 text-xs cursor-pointer hover:bg-primary-200"
                      >
                        <div className="font-medium truncate">{appointment.patientName}</div>
                        <div className="text-gray-600 truncate">
                          {SERVICES.find(s => s.id === appointment.serviceId)?.name}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 일별 뷰 렌더링
  const renderDayView = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayAppointments = getAppointmentsForDate(dateString).sort((a, b) => a.time.localeCompare(b.time))

    const timeSlots: string[] = []
    for (let hour = 9; hour < 19; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
        timeSlots.push(time)
      }
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </h3>
        </div>
        <div className="divide-y">
          {timeSlots.map(time => {
            const appointment = dayAppointments.find(apt => apt.time === time)
            return (
              <div key={time} className="flex">
                <div className="w-20 p-3 text-sm text-gray-600 border-r bg-gray-50">
                  {time}
                </div>
                <div className="flex-1 p-3">
                  {appointment ? (
                    <div
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-3 rounded-lg bg-primary-50 border border-primary-200 cursor-pointer hover:bg-primary-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{appointment.patientName}</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {SERVICES.find(s => s.id === appointment.serviceId)?.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{appointment.phone}</div>
                      {appointment.notes && (
                        <div className="text-xs text-gray-500 mt-2 italic">{appointment.notes}</div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowNewAppointment(true)
                      }}
                      className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      예약 추가
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">예약 관리</h1>
        <p className="text-gray-600 mt-1">예약 일정을 관리하고 확인하세요</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {formatDate(selectedDate)}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              오늘
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded ${
                    viewMode === mode
                      ? 'bg-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'month' ? '월' : mode === 'week' ? '주' : '일'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                // 로컬 날짜 문자열 생성
                const year = selectedDate.getFullYear()
                const month = selectedDate.getMonth() + 1
                const day = selectedDate.getDate()
                const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                setAppointmentFormDate(dateString)
                setShowNewAppointment(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              예약 추가
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="환자명, 전화번호로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'month' && (
        <>
          {renderMonthView()}
          {/* Daily Timeline Below Calendar */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })} 예약 현황
            </h3>

            {(() => {
              // toISOString() 대신 로컬 날짜 문자열 생성
              const year = selectedDate.getFullYear()
              const month = selectedDate.getMonth() + 1
              const day = selectedDate.getDate()
              const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              console.log('Timeline date string:', dateString)
              const dayAppointments = getAppointmentsForDate(dateString)
                .filter(apt => apt.status !== 'cancelled')
                .sort((a, b) => a.time.localeCompare(b.time))

              // 시간대 생성 (9:00 - 18:30)
              const timeSlots: string[] = []
              for (let hour = 9; hour < 19; hour++) {
                for (let min = 0; min < 60; min += 30) {
                  const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
                  timeSlots.push(time)
                }
              }

              return (
                <div className="grid grid-cols-5 gap-2">
                  {timeSlots.map(time => {
                    const appointment = dayAppointments.find(apt => apt.time === time)
                    return (
                      <div key={time} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{time}</div>
                        {appointment ? (
                          <div
                            onClick={() => setSelectedAppointment(appointment)}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs cursor-pointer hover:bg-primary-200 transition-colors"
                          >
                            <div className="font-medium truncate">{appointment.patientName}</div>
                            <div className="text-[10px]">{SERVICES.find(s => s.id === appointment.serviceId)?.name}</div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              // 해당 시간으로 예약 추가 - 로컬 날짜 사용
                              const year = selectedDate.getFullYear()
                              const month = selectedDate.getMonth() + 1
                              const day = selectedDate.getDate()
                              const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                              setAppointmentFormDate(dateString)
                              setShowNewAppointment(true)
                            }}
                            className="px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-400 hover:border-primary-300 hover:text-primary-600 w-full"
                          >
                            비어있음
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </>
      )}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">예약 상세정보</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">환자명</label>
                <p className="font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">연락처</label>
                <p className="font-medium">{selectedAppointment.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">서비스</label>
                <p className="font-medium">
                  {SERVICES.find(s => s.id === selectedAppointment.serviceId)?.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">날짜</label>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">시간</label>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">상태</label>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm text-gray-600">메모</label>
                  <p className="font-medium">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                <>
                  {selectedAppointment.status === 'pending' && (
                    <button
                      onClick={() => {
                        // DataContext의 예약 ID 찾기
                        const contextAppointment = contextAppointments.find(
                          apt => apt.patientName === selectedAppointment.patientName &&
                          apt.date === selectedAppointment.date &&
                          apt.time === selectedAppointment.time
                        )
                        if (contextAppointment) {
                          updateAppointment(contextAppointment.id, { status: 'confirmed' })
                          toast.success('예약이 확정되었습니다')
                        }
                        setSelectedAppointment(null)
                      }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      확정
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // DataContext의 예약 ID 찾기
                      const contextAppointment = contextAppointments.find(
                        apt => apt.patientName === selectedAppointment.patientName &&
                        apt.date === selectedAppointment.date &&
                        apt.time === selectedAppointment.time
                      )
                      if (contextAppointment) {
                        completeAppointment(contextAppointment.id)
                        toast.success('서비스가 완료되고 매출이 기록되었습니다')
                      }
                      setSelectedAppointment(null)
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    완료
                  </button>
                  <button
                    onClick={() => {
                      // DataContext의 예약 ID 찾기
                      const contextAppointment = contextAppointments.find(
                        apt => apt.patientName === selectedAppointment.patientName &&
                        apt.date === selectedAppointment.date &&
                        apt.time === selectedAppointment.time
                      )
                      if (contextAppointment) {
                        cancelAppointment(contextAppointment.id)
                        toast.success('예약이 취소되었습니다')
                      }
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

      {/* 새 예약 추가 모달 */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">새 예약 추가</h2>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <NewAppointmentForm
              onClose={() => setShowNewAppointment(false)}
              onSave={(appointment) => {
                // 샘플 데이터 제거 - 직접 DataContext에 추가
                setShowNewAppointment(false)
                toast.success('예약이 추가되었습니다')
              }}
              patients={patients}
              initialDate={appointmentFormDate || selectedDate.toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 새 예약 추가 폼 컴포넌트
function NewAppointmentForm({ onClose, onSave, patients, initialDate }: {
  onClose: () => void
  onSave: (appointment: Appointment) => void
  patients: any[]
  initialDate?: string
}) {
  const { addAppointment, getPatientAppointments } = useData()
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState(initialDate || new Date().toISOString().split('T')[0])
  const [appointmentTime, setAppointmentTime] = useState('09:00')
  const [notes, setNotes] = useState('')

  const selectedPatient = patients.find(p => p.id === selectedPatientId)
  const selectedService = SERVICES.find(s => s.id === selectedServiceId)

  // 선택된 환자의 패키지 정보 가져오기
  const getPatientPackages = () => {
    if (!selectedPatient) return []

    // 환자의 packages 필드에서 직접 가져오기
    if (selectedPatient.packages && selectedPatient.packages.length > 0) {
      return selectedPatient.packages.map((pkg: any) => {
        const service = SERVICES.find(s => s.id === pkg.serviceId)
        return {
          serviceId: pkg.serviceId,
          serviceName: service?.name || '',
          packageType: pkg.packageType,
          totalCount: pkg.totalCount,
          remainingCount: pkg.remainingCount
        }
      }).filter((pkg: any) => pkg.remainingCount > 0)
    }

    // packages 필드가 없으면 예약 내역에서 패키지 구매 정보 추출 (하위 호환성)
    const patientAppointments = getPatientAppointments(selectedPatient.id)
    const packages = new Map()

    // 패키지 구매 내역 찾기
    patientAppointments.forEach(apt => {
      if (apt.packageType && apt.packageType !== 'single' && apt.paymentStatus === 'paid') {
        const key = `${apt.serviceId}-${apt.packageType}`
        if (!packages.has(key)) {
          const totalCount = apt.packageType === '4times' ? 4 : 8
          packages.set(key, {
            serviceId: apt.serviceId,
            serviceName: apt.serviceName,
            packageType: apt.packageType,
            totalCount,
            usedCount: 0
          })
        }
      }
    })

    // 사용된 횟수 계산
    patientAppointments.forEach(apt => {
      if (apt.status === 'completed' || apt.status === 'confirmed') {
        const key4 = `${apt.serviceId}-4times`
        const key8 = `${apt.serviceId}-8times`

        // 패키지 사용 건인지 확인
        if (apt.packageType && apt.packageType !== 'single') {
          const key = `${apt.serviceId}-${apt.packageType}`
          if (packages.has(key)) {
            packages.get(key).usedCount++
          }
        }
      }
    })

    // 남은 횟수가 있는 패키지만 반환
    return Array.from(packages.values())
      .map(pkg => ({
        ...pkg,
        remainingCount: pkg.totalCount - pkg.usedCount
      }))
      .filter(pkg => pkg.remainingCount > 0)
  }

  // 구매한 패키지 서비스만 반환
  const getAvailableServices = () => {
    const packages = getPatientPackages()
    if (packages.length === 0) return []

    // 패키지가 있는 서비스 ID들만 추출
    const packageServiceIds = packages.map((pkg: any) => pkg.serviceId)

    // 해당 서비스들만 필터링해서 반환
    return SERVICES.filter(service => packageServiceIds.includes(service.id))
  }

  const handleSubmit = () => {
    if (!selectedPatientId || !selectedServiceId) {
      toast.error('환자와 서비스를 선택해주세요')
      return
    }

    // 날짜가 올바른 형식인지 확인 (YYYY-MM-DD)
    console.log('Selected date:', appointmentDate)

    // 패키지 사용 여부 확인
    const packageInfo = getPatientPackages().find((pkg: any) => pkg.serviceId === selectedServiceId)
    const isUsingPackage = packageInfo && packageInfo.remainingCount > 0

    const newAppointment = addAppointment({
      patientId: selectedPatientId,
      patientName: selectedPatient.name,
      phone: selectedPatient.phone,
      serviceId: selectedServiceId,
      serviceName: selectedService?.name || '',
      date: appointmentDate, // YYYY-MM-DD 형식 그대로 사용
      time: appointmentTime,
      duration: selectedService?.duration || 60,
      price: isUsingPackage ? 0 : (selectedService?.basePrice || 0), // 패키지 사용시 0원
      status: 'pending',
      notes,
      paymentStatus: isUsingPackage ? 'paid' : 'pending', // 패키지 사용시 결제완료
      packageType: isUsingPackage ? (packageInfo.totalCount === 4 ? '4times' : '8times') : 'single' // 패키지 횟수에 맞게 설정
    })

    onSave({
      id: newAppointment.id,
      patientName: selectedPatient.name,
      phone: selectedPatient.phone,
      serviceId: selectedServiceId,
      date: appointmentDate, // YYYY-MM-DD 형식 그대로 사용
      time: appointmentTime,
      status: 'pending',
      notes
    })

    if (isUsingPackage) {
      toast.success(`예약이 추가되었습니다 (패키지 사용: ${packageInfo.remainingCount - 1}회 남음)`)
    } else {
      toast.success('예약이 추가되었습니다')
    }
  }

  return (
    <div className="space-y-4">
      {/* 환자 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">환자 선택</label>
        <select
          value={selectedPatientId}
          onChange={(e) => {
            setSelectedPatientId(e.target.value)
            setSelectedServiceId('') // 환자 변경 시 서비스 선택 초기화
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">환자를 선택하세요</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.phone})
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 환자의 패키지 정보 */}
      {selectedPatient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">구매한 패키지 정보</h3>
          {getPatientPackages().length > 0 ? (
            <div className="space-y-2">
              {getPatientPackages().map((pkg: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-white rounded p-2">
                  <span className="text-sm font-medium">{pkg.serviceName}</span>
                  <span className="text-sm text-blue-600 font-bold">
                    남은 횟수: {pkg.remainingCount}회
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">구매한 패키지가 없습니다 - 신규 접수에서 패키지를 구매해주세요</p>
          )}
        </div>
      )}

      {/* 서비스 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          서비스 선택
        </label>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          disabled={!selectedPatientId}
        >
          <option value="">
            {!selectedPatientId ? '먼저 환자를 선택하세요' :
             getAvailableServices().length === 0 ? '구매한 패키지가 없습니다' :
             '서비스를 선택하세요'}
          </option>
          {selectedPatientId && getAvailableServices().map(service => {
            const packageInfo = getPatientPackages().find((pkg: any) => pkg.serviceId === service.id)
            return (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration}분) - 남은 횟수: {packageInfo?.remainingCount || 0}회
              </option>
            )
          })}
        </select>
      </div>

      {/* 날짜와 시간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 20 }, (_, i) => {
              const hour = Math.floor(9 + i / 2)
              const min = i % 2 === 0 ? '00' : '30'
              return `${String(hour).padStart(2, '0')}:${min}`
            }).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="추가 메모를 입력하세요..."
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          예약 추가
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </div>
  )
}