'use client'

import { useState } from 'react'
import { useData } from '@/lib/context/DataContext'
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/data/services'
import { User, Plus, Check, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ReceptionPage() {
  const { patients, addPatient, updatePatient, calculateServicePrice, addRevenue } = useData()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [packageType, setPackageType] = useState<'single' | '4times' | '8times'>('single')

  // 신규 환자 등록
  const [showNewPatient, setShowNewPatient] = useState(false)
  const [newPatientName, setNewPatientName] = useState('')
  const [newPatientPhone, setNewPatientPhone] = useState('')
  const [newPatientBirth, setNewPatientBirth] = useState('')
  const [visitSource, setVisitSource] = useState<string>('기타')

  const selectedPatient = patients.find(p => p.id === selectedPatientId)
  const selectedService = SERVICES.find(s => s.id === selectedServiceId)
  const totalPrice = selectedServiceId ? calculateServicePrice(selectedServiceId, packageType) : 0

  // 신규 환자 등록 처리
  const handleAddPatient = () => {
    if (!newPatientName || !newPatientPhone || !newPatientBirth) {
      toast.error('모든 필수 정보를 입력해주세요')
      return
    }

    const patient = addPatient({
      name: newPatientName,
      phone: newPatientPhone,
      email: '',
      birthDate: newPatientBirth,
      registrationDate: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0],
      totalVisits: 0,
      totalSpent: 0,
      favoriteServices: [],
      status: 'active',
      visitSource: visitSource as any
    })

    setSelectedPatientId(patient.id)
    setShowNewPatient(false)
    setNewPatientName('')
    setNewPatientPhone('')
    setNewPatientBirth('')
    toast.success('환자 등록 완료')
    setStep(2)
  }

  // 결제 처리
  const handlePayment = () => {
    if (!selectedPatientId || !selectedServiceId) {
      toast.error('환자와 서비스를 선택해주세요')
      return
    }

    // 오늘 날짜 - 로컬 날짜 사용
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const today = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // 패키지 구매 정보를 환자 데이터에 저장
    const patient = patients.find(p => p.id === selectedPatientId)
    const selectedService = SERVICES.find(s => s.id === selectedServiceId)

    if (patient && selectedService) {
      if (packageType !== 'single') {
        const packageCount = packageType === '4times' ? 4 : 8
        const updatedPackages = patient.packages || []
        updatedPackages.push({
          serviceId: selectedServiceId,
          serviceName: selectedService.name,
          totalCount: packageCount,
          remainingCount: packageCount,
          purchaseDate: today,
          expiryDate: undefined
        })

        // 환자 정보 업데이트 (패키지 구매 기록)
        updatePatient(selectedPatientId, {
          packages: updatedPackages,
          totalSpent: patient.totalSpent + totalPrice
        })
      } else {
        // 단일 서비스 구매
        updatePatient(selectedPatientId, {
          totalSpent: patient.totalSpent + totalPrice
        })
      }

      // 매출 기록 추가
      addRevenue({
        date: today,
        ivRevenue: totalPrice, // 수액센터 매출
        endoscopyRevenue: 0,
        totalRevenue: totalPrice,
        serviceDetails: [{
          serviceId: selectedServiceId,
          count: 1,
          revenue: totalPrice
        }]
      })
    }

    toast.success('접수 완료! 매출이 기록되었습니다.')
    setStep(4)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">신규 접수</h1>

      {/* 진행 단계 */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <span>환자 선택</span>
        </div>
        <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}>
            {step > 2 ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <span>서비스 선택</span>
        </div>
        <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}>
            {step > 3 ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <span>결제</span>
        </div>
      </div>

      {/* Step 1: 환자 선택 */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">환자 선택</h2>

          <button
            onClick={() => setShowNewPatient(true)}
            className="mb-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            신규 환자 등록
          </button>

          {showNewPatient && (
            <div className="mb-4 p-4 border rounded">
              <h3 className="font-medium mb-3">신규 환자 정보</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="이름"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="전화번호"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="생년월일"
                  value={newPatientBirth}
                  onChange={(e) => setNewPatientBirth(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <select
                  value={visitSource}
                  onChange={(e) => setVisitSource(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="기타">방문경로 선택</option>
                  <option value="검색">온라인 검색</option>
                  <option value="직원소개">직원 소개</option>
                  <option value="원내광고">원내 광고</option>
                  <option value="이벤트메세지">이벤트 메세지</option>
                  <option value="내시경실">내시경실</option>
                  <option value="진료">진료</option>
                  <option value="지인소개">지인 소개</option>
                  <option value="기타">기타</option>
                </select>
                <button
                  onClick={handleAddPatient}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  등록하기
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.id}
                onClick={() => {
                  setSelectedPatientId(patient.id)
                  setStep(2)
                }}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.phone}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 서비스 선택 */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">서비스 선택</h2>
          <p className="text-sm text-gray-600 mb-4">환자: {selectedPatient?.name}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {SERVICES.slice(0, 10).map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-3 border rounded cursor-pointer ${
                  selectedServiceId === service.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-sm">{service.name}</p>
                <p className="text-xs text-gray-500">{service.duration}분</p>
                <p className="text-primary-600 font-bold">{service.basePrice.toLocaleString()}원</p>
              </div>
            ))}
          </div>

          {selectedServiceId && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">패키지 선택</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPackageType('single')}
                  className={`px-3 py-1 border rounded ${
                    packageType === 'single' ? 'bg-primary-600 text-white' : 'bg-white'
                  }`}
                >
                  단회
                </button>
                <button
                  onClick={() => setPackageType('4times')}
                  className={`px-3 py-1 border rounded ${
                    packageType === '4times' ? 'bg-primary-600 text-white' : 'bg-white'
                  }`}
                >
                  4회 (10% 할인)
                </button>
                <button
                  onClick={() => setPackageType('8times')}
                  className={`px-3 py-1 border rounded ${
                    packageType === '8times' ? 'bg-primary-600 text-white' : 'bg-white'
                  }`}
                >
                  8회 (20% 할인)
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              이전
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedServiceId}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 결제 */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">환자</span>
              <span className="font-medium">{selectedPatient?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">서비스</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">패키지</span>
              <span className="font-medium">
                {packageType === 'single' ? '단회' :
                 packageType === '4times' ? '4회' : '8회'}
              </span>
            </div>
            <div className="pt-3 border-t flex justify-between">
              <span className="text-lg font-medium">총 금액</span>
              <span className="text-xl font-bold text-primary-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              이전
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              결제 완료
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 완료 */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">접수 완료!</h2>
          <p className="text-gray-600 mb-6">결제가 성공적으로 처리되었습니다.</p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep(1)
                setSelectedPatientId('')
                setSelectedServiceId('')
                setPackageType('single')
              }}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              새 접수하기
            </button>
            <button
              onClick={() => router.push('/staff')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              대시보드로
            </button>
          </div>
        </div>
      )}
    </div>
  )
}