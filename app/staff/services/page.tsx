'use client'

import { useState } from 'react'
import { Search, Clock, Star, Filter, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'all', name: '전체' },
  { id: 'vitamin', name: '비타민/영양' },
  { id: 'cold', name: '감기/면역' },
  { id: 'recovery', name: '피로회복' },
  { id: 'beauty', name: '미용/항노화' },
  { id: 'diet', name: '다이어트' },
]

const services = [
  {
    id: '1',
    name: '비타민 수액',
    category: 'vitamin',
    description: '비타민 C, B 복합체를 통한 피로 회복과 면역력 증진',
    effects: ['피로 회복', '면역력 증진', '항산화 효과'],
    duration: 60,
    basePrice: 50000,
    packagePrices: { 4: 180000, 8: 320000 },
    rating: 4.8,
    reviews: 124,
    popular: true,
  },
  {
    id: '2',
    name: '감기 수액',
    category: 'cold',
    description: '감기 증상 완화와 빠른 회복을 위한 특별 조합',
    effects: ['감기 증상 완화', '빠른 회복', '면역력 강화'],
    duration: 45,
    basePrice: 60000,
    packagePrices: { 4: 220000, 8: 400000 },
    rating: 4.9,
    reviews: 89,
    popular: true,
  },
  {
    id: '3',
    name: '피로 회복 수액',
    category: 'recovery',
    description: '만성 피로와 스트레스 해소를 위한 프리미엄 수액',
    effects: ['만성 피로 개선', '스트레스 해소', '에너지 충전'],
    duration: 50,
    basePrice: 70000,
    packagePrices: { 4: 260000, 8: 480000 },
    rating: 4.7,
    reviews: 156,
    popular: false,
  },
  {
    id: '4',
    name: '백옥 수액',
    category: 'beauty',
    description: '미백과 항산화 효과로 맑고 투명한 피부',
    effects: ['미백 효과', '항산화', '피부 탄력'],
    duration: 40,
    basePrice: 80000,
    packagePrices: { 4: 300000, 8: 560000 },
    rating: 4.6,
    reviews: 98,
    popular: false,
  },
  {
    id: '5',
    name: '다이어트 수액',
    category: 'diet',
    description: '지방 분해와 대사 촉진을 돕는 다이어트 보조 수액',
    effects: ['지방 분해', '대사 촉진', '부종 완화'],
    duration: 50,
    basePrice: 75000,
    packagePrices: { 4: 280000, 8: 520000 },
    rating: 4.5,
    reviews: 67,
    popular: false,
  },
  {
    id: '6',
    name: '숙취 해소 수액',
    category: 'recovery',
    description: '빠른 숙취 해소와 간 기능 회복',
    effects: ['숙취 해소', '간 기능 회복', '수분 보충'],
    duration: 30,
    basePrice: 50000,
    packagePrices: null,
    rating: 4.9,
    reviews: 203,
    popular: true,
  },
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const filteredServices = services
    .filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.reviews - a.reviews
      if (sortBy === 'price-low') return a.basePrice - b.basePrice
      if (sortBy === 'price-high') return b.basePrice - a.basePrice
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">서비스 목록</h1>
        <p className="text-gray-600">건강한 일상을 위한 다양한 수액 서비스를 만나보세요</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="서비스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="popular">인기순</option>
            <option value="rating">평점순</option>
            <option value="price-low">낮은 가격순</option>
            <option value="price-high">높은 가격순</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    {service.popular && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        인기
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-500">({service.reviews})</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">주요 효과</p>
                <div className="flex flex-wrap gap-2">
                  {service.effects.map((effect, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}분</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">1회:</span>
                  <span className="text-primary-600 font-semibold">₩{service.basePrice.toLocaleString()}</span>
                </div>
              </div>

              {service.packagePrices && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">패키지 할인</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">4회:</span>
                      <span className="ml-1 font-semibold text-gray-900">₩{service.packagePrices[4].toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">8회:</span>
                      <span className="ml-1 font-semibold text-gray-900">₩{service.packagePrices[8].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <Link
                href={`/user/booking?service=${service.id}`}
                className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                예약하기
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}