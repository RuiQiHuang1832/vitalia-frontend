import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { apiUrl } from '@/lib/api'
export async function hydrateAuth() {
  try {
    const res = await fetch(apiUrl('/auth/me'), {
      credentials: 'include',
    })
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const user = await res.json()
    useAuthStore.getState().setUser(user)
  } catch {
    useAuthStore.getState().clearUser()
  }
}
