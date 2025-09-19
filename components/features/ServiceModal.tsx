'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SERVICE_CATEGORIES } from '@/lib/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { calculateDiscount } from '@/lib/utils/format'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: SERVICE_CATEGORIES[0],
    duration: 60,
    base_price: 0,
    description: '',
    effects: '',
    package_4_price: 0,
    package_8_price: 0,
    is_active: true,
  })

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        category: service.category || SERVICE_CATEGORIES[0],
        duration: service.duration || 60,
        base_price: service.base_price || 0,
        description: service.description || '',
        effects: service.effects || '',
        package_4_price: service.package_4_price || 0,
        package_8_price: service.package_8_price || 0,
        is_active: service.is_active ?? true,
      })
    }
  }, [service])

  const calculatePackagePrice = () => {
    const package4 = calculateDiscount(formData.base_price * 4, 10)
    const package8 = calculateDiscount(formData.base_price * 8, 20)

    setFormData(prev => ({
      ...prev,
      package_4_price: package4,
      package_8_price: package8,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (service) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', service.id)

        if (error) throw error
        toast.success('서비스가 수정되었습니다.')
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData])

        if (error) throw error
        toast.success('서비스가 추가되었습니다.')
      }

      onClose()
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.')
      console.error(error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {service ? '서비스 수정' : '새 서비스 추가'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">서비스명</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="예: 피로회복"
              />
            </div>

            <div>
              <label className="label">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">소요시간 (분)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="input"
                min="1"
              />
            </div>

            <div>
              <label className="label">기본가격 (원)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })}
                  className="input flex-1"
                  min="0"
                  step="10000"
                />
                <button
                  type="button"
                  onClick={calculatePackagePrice}
                  className="btn-outline text-sm"
                >
                  패키지 자동계산
                </button>
              </div>
            </div>

            <div>
              <label className="label">4회 패키지 가격 (원)</label>
              <input
                type="number"
                value={formData.package_4_price}
                onChange={(e) => setFormData({ ...formData, package_4_price: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
                step="10000"
              />
            </div>

            <div>
              <label className="label">8회 패키지 가격 (원)</label>
              <input
                type="number"
                value={formData.package_8_price}
                onChange={(e) => setFormData({ ...formData, package_8_price: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
                step="10000"
              />
            </div>
          </div>

          <div>
            <label className="label">효과</label>
            <textarea
              value={formData.effects}
              onChange={(e) => setFormData({ ...formData, effects: e.target.value })}
              className="input"
              rows={3}
              placeholder="예: 간기능 개선, 면역력 강화 및 해독 작용..."
            />
          </div>

          <div>
            <label className="label">설명 (선택사항)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              서비스 활성화
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button type="submit" className="btn-primary flex-1">
              {service ? '수정' : '추가'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}