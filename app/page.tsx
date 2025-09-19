'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { User, Shield } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<'staff' | 'admin'>('staff')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!isSupabaseConfigured()) {
      // Supabase가 설정되지 않은 경우 테스트 로그인
      if (loginType === 'admin' && email === 'admin@seroum.com' && password === 'admin1234') {
        toast.success('관리자 로그인 성공!')
        router.push('/dashboard')
      } else if (loginType === 'staff' && email === 'staff@seroum.com' && password === 'staff1234') {
        toast.success('직원 로그인 성공!')
        router.push('/staff')
      } else {
        const hint = loginType === 'admin'
          ? '(admin@seroum.com / admin1234)'
          : '(staff@seroum.com / staff1234)'
        toast.error(`로그인에 실패했습니다. ${hint}`)
      }
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('로그인에 실패했습니다.')
      } else {
        toast.success('로그인 성공!')
        router.push(loginType === 'admin' ? '/dashboard' : '/staff')
      }
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">S</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              세로움 수액센터
            </h2>
            <p className="mt-2 text-gray-600">
              {loginType === 'admin' ? '관리자' : '사용자'} 로그인
            </p>
          </div>

          {/* Login Type Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginType('staff')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginType === 'staff'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="w-5 h-5" />
              직원
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              관리자
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={loginType === 'admin' ? 'admin@seroum.com' : 'staff@seroum.com'}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={loginType === 'admin' ? 'admin1234' : 'staff1234'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>테스트 계정</strong><br />
              {loginType === 'admin' ? (
                <>관리자: admin@seroum.com / admin1234</>
              ) : (
                <>직원: staff@seroum.com / staff1234</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}