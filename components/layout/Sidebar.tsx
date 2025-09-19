'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Activity,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Gift,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: Home },
  { name: '수액 서비스', href: '/dashboard/services', icon: Activity },
  { name: '환자 관리', href: '/dashboard/patients', icon: Users },
  { name: '예약 관리', href: '/dashboard/appointments', icon: Calendar },
  { name: '일별 이용현황', href: '/dashboard/daily-usage', icon: FileText },
  { name: '매출 관리', href: '/dashboard/revenue', icon: DollarSign },
  { name: '마케팅 분석', href: '/dashboard/marketing', icon: TrendingUp },
  { name: '쿠폰 관리', href: '/dashboard/coupons', icon: Gift },
  { name: '설정', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // 로컬 스토리지 클리어
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    toast.success('로그아웃되었습니다')
    router.push('/')
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">세로움 수액센터</h1>
        <p className="text-sm text-gray-600 mt-1">관리 시스템</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  )
}