'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, CreditCard, Database, Save } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: '일반 설정', icon: Settings },
    { id: 'profile', name: '프로필', icon: User },
    { id: 'notifications', name: '알림', icon: Bell },
    { id: 'security', name: '보안', icon: Shield },
    { id: 'billing', name: '결제', icon: CreditCard },
    { id: 'data', name: '데이터 관리', icon: Database },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-1">시스템 설정 및 환경 구성</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">일반 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      센터명
                    </label>
                    <input
                      type="text"
                      defaultValue="세로움 수액센터"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사업자 등록번호
                    </label>
                    <input
                      type="text"
                      defaultValue="123-45-67890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      defaultValue="02-1234-5678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소
                    </label>
                    <textarea
                      defaultValue="서울특별시 강남구 테헤란로 123 세로움빌딩 5층"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      영업 시간
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        defaultValue="09:00"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="time"
                        defaultValue="21:00"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">프로필 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      defaultValue="관리자"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@seroum.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      역할
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>관리자</option>
                      <option>매니저</option>
                      <option>직원</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">알림 설정</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">예약 알림</p>
                      <p className="text-sm text-gray-500">새로운 예약이 접수되면 알림을 받습니다</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">취소 알림</p>
                      <p className="text-sm text-gray-500">예약이 취소되면 알림을 받습니다</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">일일 리포트</p>
                      <p className="text-sm text-gray-500">매일 오후 9시에 일일 리포트를 받습니다</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">마케팅 알림</p>
                      <p className="text-sm text-gray-500">마케팅 캠페인 성과 알림을 받습니다</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">보안 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      현재 비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                      <span className="text-sm text-gray-700">2단계 인증 사용</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">결제 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      현재 플랜
                    </label>
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <p className="font-semibold text-primary-900">프리미엄 플랜</p>
                      <p className="text-sm text-primary-700 mt-1">월 99,000원</p>
                      <p className="text-sm text-primary-600 mt-2">다음 결제일: 2024년 2월 1일</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      결제 수단
                    </label>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-300 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <span className="text-sm">•••• •••• •••• 1234</span>
                        </div>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          변경
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">데이터 관리</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">데이터 백업</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">마지막 백업: 2024년 1월 15일 오후 3:30</p>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        지금 백업하기
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">데이터 내보내기</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">환자 정보, 예약 기록 등을 CSV 파일로 내보낼 수 있습니다.</p>
                      <button className="bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                        데이터 내보내기
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">데이터 삭제</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">주의: 삭제된 데이터는 복구할 수 없습니다.</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        데이터 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>저장하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}