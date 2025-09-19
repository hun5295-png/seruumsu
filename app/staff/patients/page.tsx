'use client'

import { useState } from 'react'
import { Search, User, Phone, Calendar, FileText, Filter, Download, ChevronRight, Clock, Star, Plus, Edit } from 'lucide-react'
import { SERVICES } from '@/lib/data/services'
import toast from 'react-hot-toast'
import { useData } from '@/lib/context/DataContext'
import { useRouter } from 'next/navigation'

export default function PatientsPage() {
  const { patients, getPatientAppointments, getPatientStats, updatePatient } = useData()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // 환자 필터링
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm)

    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // 멤버십 등급 색상
  const getMembershipColor = (totalSpent: number) => {
    if (totalSpent >= 3000000) return 'bg-purple-100 text-purple-800'
    if (totalSpent >= 1500000) return 'bg-yellow-100 text-yellow-800'
    if (totalSpent >= 500000) return 'bg-gray-100 text-gray-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getMembershipLabel = (totalSpent: number) => {
    if (totalSpent >= 3000000) return 'VIP'
    if (totalSpent >= 1500000) return 'GOLD'
    if (totalSpent >= 500000) return 'SILVER'
    return 'BASIC'
  }

  // 나이 계산
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // 마지막 방문일 계산
  const getDaysSinceLastVisit = (lastVisit: string) => {
    const last = new Date(lastVisit)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - last.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">환자 조회</h1>
        <p className="text-gray-600 mt-1">환자 정보를 검색하고 관리합니다</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="환자명, 연락처로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">전체 환자</option>
              <option value="active">활성 환자</option>
              <option value="inactive">비활성 환자</option>
            </select>
            <button
              onClick={() => router.push('/staff/reception')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              신규 환자
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">전체 환자</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{patients.length}명</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">활성 환자</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {patients.filter(p => p.status === 'active').length}명
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">이번 달 신규</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {patients.filter(p => {
              const regDate = new Date(p.registrationDate)
              const now = new Date()
              return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
            }).length}명
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">VIP 회원</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {patients.filter(p => p.totalSpent >= 3000000).length}명
          </p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  환자 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  방문 기록
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  누적 매출
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회원 등급
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.birthDate ? `${calculateAge(patient.birthDate)}세` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.totalVisits}회</div>
                      {patient.lastVisit && (
                        <div className="text-sm text-gray-500">
                          {getDaysSinceLastVisit(patient.lastVisit)}일 전 방문
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₩{patient.totalSpent.toLocaleString()}
                      </div>
                      {patient.totalVisits > 0 && (
                        <div className="text-sm text-gray-500">
                          평균 ₩{Math.round(patient.totalSpent / patient.totalVisits).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipColor(patient.totalSpent)}`}>
                        {getMembershipLabel(patient.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEdit={(updatedPatient) => {
            updatePatient(selectedPatient.id, updatedPatient)
            setSelectedPatient(null)
            toast.success('환자 정보가 수정되었습니다')
          }}
          getMembershipColor={getMembershipColor}
          getMembershipLabel={getMembershipLabel}
          calculateAge={calculateAge}
          getPatientAppointments={getPatientAppointments}
          router={router}
        />
      )}
    </div>
  )
}

// 환자 상세 모달 컴포넌트
function PatientDetailModal({
  patient,
  onClose,
  onEdit,
  getMembershipColor,
  getMembershipLabel,
  calculateAge,
  getPatientAppointments,
  router
}: {
  patient: any
  onClose: () => void
  onEdit: (updatedPatient: any) => void
  getMembershipColor: (totalSpent: number) => string
  getMembershipLabel: (totalSpent: number) => string
  calculateAge: (birthDate: string) => number
  getPatientAppointments: (patientId: string) => any[]
  router: any
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState(patient)
  const { updatePatient } = useData()

  const handleSave = () => {
    updatePatient(patient.id, editedPatient)
    onEdit(editedPatient)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">환자 정보 수정</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value={editedPatient.name}
                  onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="tel"
                  value={editedPatient.phone}
                  onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={editedPatient.email}
                  onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                <input
                  type="date"
                  value={editedPatient.birthDate}
                  onChange={(e) => setEditedPatient({ ...editedPatient, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                value={editedPatient.status}
                onChange={(e) => setEditedPatient({ ...editedPatient, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
              <textarea
                value={editedPatient.notes || ''}
                onChange={(e) => setEditedPatient({ ...editedPatient, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="환자에 대한 추가 메모..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              {patient.birthDate && (
                <p className="text-gray-600">{calculateAge(patient.birthDate)}세</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">기본 정보</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">연락처:</span>
                <p className="font-medium">{patient.phone}</p>
              </div>
              {patient.email && (
                <div>
                  <span className="text-sm text-gray-600">이메일:</span>
                  <p className="font-medium">{patient.email}</p>
                </div>
              )}
              {patient.birthDate && (
                <div>
                  <span className="text-sm text-gray-600">생년월일:</span>
                  <p className="font-medium">{patient.birthDate}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">등록일:</span>
                <p className="font-medium">{patient.registrationDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">이용 정보</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">총 방문:</span>
                <p className="font-medium">{patient.totalVisits}회</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">누적 매출:</span>
                <p className="font-medium">₩{patient.totalSpent.toLocaleString()}</p>
              </div>
              {patient.lastVisit && (
                <div>
                  <span className="text-sm text-gray-600">마지막 방문:</span>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">회원 등급:</span>
                <p className="font-medium">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipColor(patient.totalSpent)}`}>
                    {getMembershipLabel(patient.totalSpent)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 예약 내역 */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">최근 예약 내역</h3>
          <div className="space-y-2">
            {getPatientAppointments(patient.id).slice(0, 5).map((appointment: any) => (
              <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-gray-500">{appointment.date} {appointment.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₩{appointment.price.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'completed' ? '완료' :
                     appointment.status === 'confirmed' ? '확정' : '대기'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => {
              router.push('/staff/reception')
              onClose()
            }}
            className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            예약 등록
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            정보 수정
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}