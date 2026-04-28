'use client'

import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useAuthStore()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}
