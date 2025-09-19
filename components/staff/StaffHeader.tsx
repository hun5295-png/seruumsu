'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Home, FileText, Calendar, Users, LogOut, MessageSquare, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

const navigation = [
  { name: '일일 업무', href: '/staff', icon: Home },
  { name: '신규 접수', href: '/staff/reception', icon: Plus },
  { name: '예약 관리', href: '/staff/appointments', icon: Calendar },
  { name: '환자 조회', href: '/staff/patients', icon: Users },
  { name: '톡톡 게시판', href: '/staff/daily-input', icon: MessageSquare },
  { name: '매출 조회', href: '/staff/revenue-input', icon: FileText },
]

export default function StaffHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/staff" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-600">세로움 수액센터</h1>
                <p className="text-xs text-gray-600">직원 업무 시스템</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActive
                      ? 'text-primary-600 font-medium bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'text-primary-600 font-medium bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>로그아웃</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}