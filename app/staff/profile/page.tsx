'use client'

import { useState } from 'react'
import { User, Mail, Phone, Calendar, MapPin, Gift, Heart, Award, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '홍길동',
    email: 'user@example.com',
    phone: '010-1234-5678',
    birthDate: '1990-01-01',
    address: '서울시 강남구',
    marketingAgree: true,
    smsAgree: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState({ ...profile })

  const membershipInfo = {
    level: 'Gold',
    points: 12500,
    visits: 24,
    joinDate: '2023-06-15',
    benefits: [
      '모든 서비스 10% 할인',
      '생일 쿠폰 제공',
      '우선 예약 가능',
      '무료 주차 2시간'
    ]
  }

  const visitHistory = [
    { date: '2024-01-15', service: '감기 수액', price: 60000 },
    { date: '2024-01-10', service: '피로 회복 수액', price: 70000 },
    { date: '2024-01-05', service: '백옥 수액', price: 80000 },
    { date: '2023-12-28', service: '비타민 수액', price: 50000 },
    { date: '2023-12-20', service: '숙취 해소 수액', price: 50000 },
  ]

  const handleSave = () => {
    setProfile({ ...tempProfile })
    setIsEditing(false)
    toast.success('프로필이 업데이트되었습니다.')
  }

  const handleCancel = () => {
    setTempProfile({ ...profile })
    setIsEditing(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 정보</h1>
        <p className="text-gray-600">프로필 정보와 이용 내역을 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">개인 정보</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  수정
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline w-4 h-4 mr-1" />
                  이름
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline w-4 h-4 mr-1" />
                  이메일
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline w-4 h-4 mr-1" />
                  연락처
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  생년월일
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempProfile.birthDate}
                    onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  주소
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.address}
                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.address}</p>
                )}
              </div>

              {isEditing && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tempProfile.marketingAgree}
                      onChange={(e) => setTempProfile({ ...tempProfile, marketingAgree: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">마케팅 정보 수신 동의</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tempProfile.smsAgree}
                      onChange={(e) => setTempProfile({ ...tempProfile, smsAgree: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">SMS 수신 동의</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 이용 내역</h2>
            <div className="space-y-3">
              {visitHistory.map((visit, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{visit.service}</p>
                    <p className="text-sm text-gray-500">{visit.date}</p>
                  </div>
                  <span className="font-medium text-gray-900">₩{visit.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membership Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">멤버십 등급</p>
                <p className="text-2xl font-bold">{membershipInfo.level}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">포인트</span>
                <span className="font-semibold">{membershipInfo.points.toLocaleString()}P</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">총 방문</span>
                <span className="font-semibold">{membershipInfo.visits}회</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">가입일</span>
                <span className="font-semibold">{membershipInfo.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary-600" />
              회원 혜택
            </h3>
            <ul className="space-y-2">
              {membershipInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰함</h3>
            <div className="space-y-2">
              <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <p className="text-sm font-medium text-primary-900">생일 축하 쿠폰</p>
                <p className="text-xs text-primary-700 mt-1">30% 할인 (유효기간: 2024-01-31)</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">신규 가입 쿠폰</p>
                <p className="text-xs text-green-700 mt-1">20% 할인 (유효기간: 2024-02-15)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}