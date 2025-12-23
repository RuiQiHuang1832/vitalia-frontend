'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useAuthStore()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    // prevent flash of protected content
    return null
  }

  return <>{children}</>
}
