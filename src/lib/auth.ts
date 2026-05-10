import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { mutate } from 'swr'

// Wipe every SWR cache entry so a different user logging in on the same
// tab can't briefly see the previous user's data. The conversations list
// was the trigger — provider's cached convos showed up for a frame after
// switching to a patient account, since SWR keys (e.g. '/conversations')
// are user-agnostic.
export async function clearSWRCache() {
  await mutate(() => true, undefined, { revalidate: false })
}

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
  await clearSWRCache()
}
