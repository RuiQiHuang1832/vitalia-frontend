'use client'

import AuthGuard from '@/app/(auth)/components/AuthGuard'
import Sidebar from '@/components/common/sidebar/Sidebar'
import { hydrateAuth } from '@/lib/auth'
import { useEffect } from 'react'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    hydrateAuth()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar>{children}</Sidebar>
      </div>
    </AuthGuard>
  )
}
