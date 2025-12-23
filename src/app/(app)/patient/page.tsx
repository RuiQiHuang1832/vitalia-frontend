'use client'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api'
export default function Patient() {
  const handleLogout = async () => {
    await fetch(apiUrl('/auth/logout'), {
      method: 'POST',
      credentials: 'include',
    })
    useAuthStore.getState().clearUser()
  }
  return (
    <div>
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  )
}
