import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { DataProvider } from '@/lib/context/DataContext'

export const metadata: Metadata = {
  title: '세로움 수액센터 관리 시스템',
  description: '수액센터 운영 관리를 위한 통합 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <DataProvider>
          {children}
        </DataProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}