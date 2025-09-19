'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Percent } from 'lucide-react'
import toast from 'react-hot-toast'

interface DiscountRate {
  id: string
  name: string
  rate: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountRate[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountRate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    description: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    if (!isSupabaseConfigured()) {
      // 로컬 데이터 사용
      setDiscounts([
        { id: '1', name: '일반', rate: 0, description: '할인 없음', is_active: true, created_at: '', updated_at: '' },
        { id: '2', name: 'VIP 고객', rate: 10, description: 'VIP 고객 10% 할인', is_active: true, created_at: '', updated_at: '' },
        { id: '3', name: '직원 할인', rate: 20, description: '직원 및 가족 20% 할인', is_active: true, created_at: '', updated_at: '' },
      ])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('discount_rates')
        .select('*')
        .order('rate', { ascending: true })

      if (error) throw error
      setDiscounts(data || [])
    } catch (error) {
      console.error('할인율 목록 로드 실패:', error)
      toast.error('할인율 목록을 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.rate < 0 || formData.rate > 100) {
      toast.error('올바른 정보를 입력해주세요')
      return
    }

    try {
      if (isSupabaseConfigured()) {
        if (editingDiscount) {
          // 수정
          const { error } = await supabase
            .from('discount_rates')
            .update({
              name: formData.name,
              rate: formData.rate,
              description: formData.description,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingDiscount.id)

          if (error) throw error
          toast.success('할인율이 수정되었습니다')
        } else {
          // 추가
          const { error } = await supabase
            .from('discount_rates')
            .insert({
              name: formData.name,
              rate: formData.rate,
              description: formData.description
            })

          if (error) throw error
          toast.success('할인율이 추가되었습니다')
        }
      } else {
        // 로컬 처리
        toast.success(editingDiscount ? '할인율이 수정되었습니다' : '할인율이 추가되었습니다')
      }

      setShowModal(false)
      setEditingDiscount(null)
      setFormData({ name: '', rate: 0, description: '' })
      fetchDiscounts()
    } catch (error) {
      console.error('할인율 저장 실패:', error)
      toast.error('할인율 저장에 실패했습니다')
    }
  }

  const handleEdit = (discount: DiscountRate) => {
    setEditingDiscount(discount)
    setFormData({
      name: discount.name,
      rate: discount.rate,
      description: discount.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 할인율을 삭제하시겠습니까?')) return

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('discount_rates')
          .update({ is_active: false })
          .eq('id', id)

        if (error) throw error
      }

      toast.success('할인율이 삭제되었습니다')
      fetchDiscounts()
    } catch (error) {
      console.error('할인율 삭제 실패:', error)
      toast.error('할인율 삭제에 실패했습니다')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">할인율 관리</h1>
        <button
          onClick={() => {
            setEditingDiscount(null)
            setFormData({ name: '', rate: 0, description: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          할인율 추가
        </button>
      </div>

      {/* 할인율 목록 */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  할인명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  할인율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
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
              {discounts.filter(d => d.is_active).map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{discount.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{discount.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      활성
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 할인율 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingDiscount ? '할인율 수정' : '할인율 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  할인명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  할인율 (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingDiscount(null)
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingDiscount ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}