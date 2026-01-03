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
    const data = await res.json()
    const payload = {
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
      },
      providerId: data.providerId ?? null,
      patientId: data.patientId ?? null,
    }
    useAuthStore.getState().setSession(payload)
  } catch {
    useAuthStore.getState().clearUser()
  }
}

export async function logout() {
  await fetch(apiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  })

  useAuthStore.getState().clearUser()
}
