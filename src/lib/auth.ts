import { useAuthStore } from '@/app/(auth)/stores/auth.store'
export async function hydrateAuth() {
  const justLoggedIn = sessionStorage.getItem('justLoggedIn')

  if (justLoggedIn) {
    // Skip hydration once to avoid cookie race
    sessionStorage.removeItem('justLoggedIn')
    return
  }
  try {
    const res = await fetch('/api/auth/me', {
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
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  useAuthStore.getState().clearUser()
}
