'use client'

import AuthGuard from '@/app/(auth)/components/AuthGuard'
import type { Role } from '@/app/(auth)/stores/auth.store'
import Sidebar from '@/components/common/sidebar/Sidebar'
import { hydrateAuth } from '@/lib/auth'
import { useEffect } from 'react'

// Client wrapper for the (app) route group. Owns the auth-hydration effect
// and gating, and forwards the server-resolved role down so the sidebar
// renders the right variant on first paint.
export default function AuthShell({
  initialRole,
  children,
}: {
  initialRole: Role | null
  children: React.ReactNode
}) {
  useEffect(() => {
    hydrateAuth()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar initialRole={initialRole}>{children}</Sidebar>
      </div>
    </AuthGuard>
  )
}
