'use client'

import { useState } from 'react'
import { Gift, Plus, Copy, Trash2, Calendar, Users, Percent, CheckCircle, XCircle, Edit, X } from 'lucide-react'
import { useData } from '@/lib/context/DataContext'
import type { Coupon } from '@/lib/context/DataContext'
import toast from 'react-hot-toast'

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useData()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const getStatusColor = (isActive: boolean, validUntil: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (!isActive) {
      return 'bg-gray-100 text-gray-800'
    }
    if (validUntil < today) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (isActive: boolean, validUntil: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (!isActive) {
      return '비활성'
    }
    if (validUntil < today) {
      return '만료'
    }
    return '활성'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`쿠폰 코드 "${text}"가 클립보드에 복사되었습니다.`)
  }

  const handleCreateCoupon = (couponData: Omit<Coupon, 'id'>) => {
    addCoupon(couponData)
    toast.success('쿠폰이 생성되었습니다')
    setShowCreateModal(false)
  }

  const handleEditCoupon = (couponData: Omit<Coupon, 'id'>) => {
    if (selectedCoupon) {
      updateCoupon(selectedCoupon.id, couponData)
      toast.success('쿠폰이 수정되었습니다')
      setShowEditModal(false)
      setSelectedCoupon(null)
    }
  }

  const handleDeleteCoupon = (couponId: string) => {
    if (confirm('정말 이 쿠폰을 삭제하시겠습니까?')) {
      deleteCoupon(couponId)
      toast.success('쿠폰이 삭제되었습니다')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">쿠폰 관리</h1>
          <p className="text-gray-600 mt-1">할인 쿠폰 생성 및 관리</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>새 쿠폰 생성</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Gift className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">{coupons.length}</span>
          </div>
          <p className="text-sm text-gray-600">전체 쿠폰</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {coupons.filter(c => c.isActive).length}
            </span>
          </div>
          <p className="text-sm text-gray-600">활성 쿠폰</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
            </span>
          </div>
          <p className="text-sm text-gray-600">총 사용 횟수</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">쿠폰 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  쿠폰 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  할인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유효 기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용 현황
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {coupon.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{coupon.discount}%</span>
                        </>
                      ) : (
                        <span className="font-medium text-gray-900">₩{coupon.discount.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{coupon.validFrom}</p>
                      <p className="text-gray-500">~ {coupon.validUntil}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {coupon.usageCount} / {coupon.maxUsage === 0 ? '무제한' : coupon.maxUsage}
                        </p>
                        {coupon.maxUsage > 0 && (
                          <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-primary-600 h-1.5 rounded-full"
                              style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon.isActive, coupon.validUntil)}`}>
                      {getStatusText(coupon.isActive, coupon.validUntil)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon)
                          setShowEditModal(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 쿠폰 생성 모달 */}
      {showCreateModal && (
        <CouponModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCoupon}
        />
      )}

      {/* 쿠폰 수정 모달 */}
      {showEditModal && selectedCoupon && (
        <CouponModal
          mode="edit"
          coupon={selectedCoupon}
          onClose={() => {
            setShowEditModal(false)
            setSelectedCoupon(null)
          }}
          onSave={handleEditCoupon}
        />
      )}
    </div>
  )
}

// 쿠폰 생성/수정 모달 컴포넌트
function CouponModal({ mode, coupon, onClose, onSave }: {
  mode: 'create' | 'edit'
  coupon?: Coupon
  onClose: () => void
  onSave: (coupon: Omit<Coupon, 'id'>) => void
}) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discount: coupon?.discount || 0,
    discountType: coupon?.discountType || 'percentage' as 'percentage' | 'fixed',
    minAmount: coupon?.minAmount || undefined,
    validFrom: coupon?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: coupon?.validUntil || '',
    maxUsage: coupon?.maxUsage || 100,
    usageCount: coupon?.usageCount || 0,
    isActive: coupon?.isActive ?? true
  })

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.validFrom || !formData.validUntil) {
      toast.error('필수 항목을 모두 입력해주세요')
      return
    }

    if (formData.discount <= 0) {
      toast.error('할인 금액/비율은 0보다 커야 합니다')
      return
    }

    if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      toast.error('시작일은 종료일보다 빨라야 합니다')
      return
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? '새 쿠폰 생성' : '쿠폰 수정'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드 *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="WELCOME2024"
                required
              />
              <button
                type="button"
                onClick={generateCouponCode}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                생성
              </button>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입 *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="percentage">비율 (%)</option>
                <option value="fixed">고정 금액 (원)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                할인 {formData.discountType === 'percentage' ? '비율' : '금액'} *
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                min="1"
                max={formData.discountType === 'percentage' ? "100" : undefined}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최소 금액</label>
            <input
              type="number"
              value={formData.minAmount || ''}
              onChange={(e) => setFormData({ ...formData, minAmount: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              min="0"
              placeholder="제한 없음"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작일 *</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료일 *</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최대 사용 횟수</label>
            <input
              type="number"
              value={formData.maxUsage}
              onChange={(e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              min="0"
              placeholder="0은 무제한"
            />
            <p className="text-xs text-gray-500 mt-1">0을 입력하면 무제한 사용 가능</p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">쿠폰 활성화</span>
            </label>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {mode === 'create' ? '생성' : '수정'}
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