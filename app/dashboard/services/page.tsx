'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { formatCurrency, formatTime } from '@/lib/utils/format'
import { SERVICE_CATEGORIES, SERVICES } from '@/lib/data/services'
import ServiceModal from '@/components/features/ServiceModal'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  category: string
  duration: number
  base_price: number
  description?: string
  effects?: string
  package_4_price?: number
  package_8_price?: number
  is_active: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, selectedCategory, searchTerm])

  const fetchServices = async () => {
    if (!isSupabaseConfigured()) {
      // listup.md 기반 30개 전체 서비스 데이터
      const formattedServices = SERVICES.map(service => ({
        id: service.id,
        name: service.name,
        category: service.category,
        duration: service.duration,
        base_price: service.basePrice,
        description: service.description,
        effects: service.description,
        package_4_price: service.package4Price || null,
        package_8_price: service.package8Price || null,
        is_active: service.isActive
      }))
      setServices(formattedServices)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      // 임시 데이터
      setServices([
        {
          id: '1',
          name: '피로회복',
          category: '피로회복&면역력',
          duration: 60,
          base_price: 80000,
          effects: '간기능 개선, 면역력 강화',
          package_4_price: 288000,
          package_8_price: 512000,
          is_active: true,
        },
        {
          id: '2',
          name: '백옥더블',
          category: '미용&항노화',
          duration: 20,
          base_price: 50000,
          effects: '미백, 항산화',
          package_4_price: 180000,
          package_8_price: 320000,
          is_active: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.effects?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredServices(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(services.filter(s => s.id !== id))
      toast.success('서비스가 삭제되었습니다.')
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingService(null)
    fetchServices()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">수액 서비스 관리</h1>
        <p className="text-gray-600 mt-2">서비스 등록 및 가격 관리</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="서비스명 또는 효과로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">전체 카테고리</option>
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            서비스 추가
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredServices.map(service => (
          <div key={service.id} className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                <span className="text-sm text-gray-600">
                  {SERVICE_CATEGORIES.find(cat => cat.id === service.category)?.name || service.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-1.5 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">기본가격</span>
                <span className="font-medium">{formatCurrency(service.base_price)}</span>
              </div>
              {service.package_4_price && (
                <div className="flex justify-between">
                  <span className="text-gray-600">4회 패키지</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(service.package_4_price)}
                  </span>
                </div>
              )}
              {service.package_8_price && (
                <div className="flex justify-between">
                  <span className="text-gray-600">8회 패키지</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(service.package_8_price)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">소요시간</span>
                <span>{formatTime(service.duration)}</span>
              </div>
            </div>

            {service.effects && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-2">{service.effects}</p>
              </div>
            )}

            <div className="mt-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                service.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {service.is_active ? '활성' : '비활성'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          service={editingService}
        />
      )}
    </div>
  )
}