'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Plus, X } from 'lucide-react'
import { useData } from '@/lib/context/DataContext'
import { SERVICES } from '@/lib/data/services'
import toast from 'react-hot-toast'

export default function AppointmentsPage() {
  const { appointments: dataAppointments, addAppointment, completeAppointment, cancelAppointment, getAppointmentsByDate, patients, calculateServicePrice } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddModal, setShowAddModal] = useState(false)

  const appointments = getAppointmentsByDate(selectedDate)
    .filter(apt => apt.status !== 'cancelled') // 취소된 예약 제외

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'cancelled':
        return '취소'
      case 'confirmed':
        return '확정'
      default:
        return '대기'
    }
  }

  const handleCompleteAppointment = (appointmentId: string) => {
    if (confirm('이 예약을 완료로 처리하시겠습니까?')) {
      completeAppointment(appointmentId)
      toast.success('예약이 완료 처리되었습니다')
    }
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('이 예약을 취소하시겠습니까?')) {
      cancelAppointment(appointmentId)
      toast.success('예약이 취소되었습니다')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
          <p className="text-gray-600 mt-1">오늘의 예약 현황</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>새 예약 등록</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">날짜 선택:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            선택한 날짜에 예약이 없습니다.
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-600" />
                      <span className="text-lg font-semibold text-gray-900">{appointment.time}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {getStatusText(appointment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{appointment.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{appointment.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                      {appointment.serviceName}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      ₩{appointment.price.toLocaleString()}
                    </span>
                  </div>

                  {appointment.addOns && Object.values(appointment.addOns).some(v => v) && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">추가 옵션: </span>
                      {Object.entries(appointment.addOns).filter(([_, value]) => value).map(([key]) => (
                        <span key={key} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                          {key}
                        </span>
                      ))}
                    </div>
                  )}

                  {appointment.notes && (
                    <p className="mt-3 text-sm text-gray-600">{appointment.notes}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {appointment.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteAppointment(appointment.id)}
                      className="text-primary-600 hover:text-primary-700 p-2"
                      title="완료"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {appointment.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="취소"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 새 예약 등록 모달 */}
      {showAddModal && (
        <AppointmentModal
          onClose={() => setShowAddModal(false)}
          onSave={(appointment) => {
            addAppointment(appointment)
            toast.success('예약이 등록되었습니다')
            setShowAddModal(false)
          }}
          patients={patients}
        />
      )}
    </div>
  )
}

// 예약 추가 모달 컴포넌트
function AppointmentModal({ onClose, onSave, patients }: {
  onClose: () => void
  onSave: (appointment: any) => void
  patients: any[]
}) {
  const { calculateServicePrice } = useData()
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    phone: '',
    serviceId: '',
    serviceName: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 60,
    price: 0,
    status: 'confirmed' as const,
    notes: '',
    packageType: 'single' as 'single' | '4times' | '8times',
    paymentStatus: 'pending' as 'pending' | 'paid',
    addOns: {
      백옥: false,
      백옥더블: false,
      가슴샘: false,
      강력주사: false
    }
  })

  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    if (patient) {
      setSelectedPatient(patient)
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.name,
        phone: patient.phone
      }))
    }
  }

  const handleServiceSelect = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId)
    if (service) {
      const price = calculateServicePrice(serviceId, formData.packageType, formData.addOns)
      setFormData(prev => ({
        ...prev,
        serviceId: service.id,
        serviceName: service.name,
        duration: service.duration,
        price
      }))
    }
  }

  const handleAddOnChange = (addOn: keyof typeof formData.addOns, checked: boolean) => {
    const newAddOns = { ...formData.addOns, [addOn]: checked }
    const price = calculateServicePrice(formData.serviceId, formData.packageType, newAddOns)
    setFormData(prev => ({
      ...prev,
      addOns: newAddOns,
      price
    }))
  }

  const handlePackageTypeChange = (packageType: 'single' | '4times' | '8times') => {
    const price = calculateServicePrice(formData.serviceId, packageType, formData.addOns)
    setFormData(prev => ({
      ...prev,
      packageType,
      price
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId || !formData.serviceId || !formData.date || !formData.time) {
      toast.error('필수 항목을 모두 입력해주세요')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">새 예약 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환자 선택 *</label>
            <select
              value={formData.patientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">환자를 선택하세요</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">서비스 선택 *</label>
            <select
              value={formData.serviceId}
              onChange={(e) => handleServiceSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">서비스를 선택하세요</option>
              {SERVICES.filter(s => s.isActive).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₩{service.basePrice.toLocaleString()} ({service.duration}분)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜 *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시간 *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">패키지 유형</label>
            <select
              value={formData.packageType}
              onChange={(e) => handlePackageTypeChange(e.target.value as 'single' | '4times' | '8times')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="single">단건</option>
              <option value="4times">4회 패키지</option>
              <option value="8times">8회 패키지</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">추가 옵션</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(formData.addOns).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleAddOnChange(key as keyof typeof formData.addOns, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">총 가격</label>
            <div className="text-lg font-bold text-primary-600">
              ₩{formData.price.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">결제 상태</label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'pending' | 'paid' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="pending">미결제</option>
              <option value="paid">결제완료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="추가 메모나 특이사항을 입력하세요"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              등록
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}