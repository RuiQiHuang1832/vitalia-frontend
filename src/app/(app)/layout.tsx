'use client'

import AuthGuard from '@/app/(auth)/components/AuthGuard'
import { hydrateAuth } from '@/lib/auth'
import { useEffect } from 'react'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    hydrateAuth()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] max-w-[1600px] mx-auto px-4 ">
        <main>{children}</main>
      </div>
    </AuthGuard>
  )
}
