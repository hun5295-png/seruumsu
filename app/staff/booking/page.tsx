'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

const services = [
  { id: '1', name: '비타민 수액', duration: 60, price: 50000 },
  { id: '2', name: '감기 수액', duration: 45, price: 60000 },
  { id: '3', name: '피로 회복 수액', duration: 50, price: 70000 },
  { id: '4', name: '백옥 수액', duration: 40, price: 80000 },
  { id: '5', name: '다이어트 수액', duration: 50, price: 75000 },
  { id: '6', name: '숙취 해소 수액', duration: 30, price: 50000 },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
]

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service')

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(preSelectedService || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService)
    }
  }, [preSelectedService])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const handleSubmit = async () => {
    const service = services.find(s => s.id === selectedService)

    toast.success('예약이 완료되었습니다!')

    // 예약 완료 후 내 예약 페이지로 이동
    setTimeout(() => {
      router.push('/user/appointments')
    }, 1500)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">서비스 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={selectedService === service.id}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="inline w-4 h-4 mr-1" />
                        {service.duration}분
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-primary-600">
                      ₩{service.price.toLocaleString()}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">날짜 및 시간 선택</h2>

            {/* Calendar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium">
                  {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && isDateSelectable(date) && setSelectedDate(formatDate(date))}
                    disabled={!date || !isDateSelectable(date)}
                    className={`p-2 text-sm rounded-lg ${
                      !date
                        ? ''
                        : !isDateSelectable(date)
                        ? 'text-gray-400 cursor-not-allowed'
                        : selectedDate === formatDate(date)
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">시간 선택</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg border transition-all ${
                        selectedTime === time
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">예약 정보 입력</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  요청사항
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="특별한 요청사항이 있으시면 입력해주세요"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        const service = services.find(s => s.id === selectedService)
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">예약 확인</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">서비스</span>
                <span className="font-medium">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">날짜</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">시간</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">소요시간</span>
                <span className="font-medium">{service?.duration}분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">연락처</span>
                <span className="font-medium">{userPhone}</span>
              </div>
              {userEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일</span>
                  <span className="font-medium">{userEmail}</span>
                </div>
              )}
              {notes && (
                <div>
                  <span className="text-gray-600">요청사항</span>
                  <p className="mt-1 text-sm">{notes}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                  <span>결제 예정 금액</span>
                  <span className="text-primary-600">₩{service?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService !== ''
      case 2:
        return selectedDate !== '' && selectedTime !== ''
      case 3:
        return userName !== '' && userPhone !== ''
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['서비스 선택', '날짜/시간', '정보 입력', '예약 확인'].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1
                    ? 'bg-primary-600 text-white'
                    : step === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < 3 && (
                <div className={`w-full h-1 mx-2 ${step > index + 1 ? 'bg-primary-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {['서비스 선택', '날짜/시간', '정보 입력', '예약 확인'].map((label, index) => (
            <span key={index} className={step === index + 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg ${
            step === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          이전
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg ${
              canProceed()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            예약 완료
          </button>
        )}
      </div>
    </div>
  )
}