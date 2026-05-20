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

// In-flight de-dupe: many SWR hooks can 401 in parallel after the 15m
// access token expires. They should all share a single /auth/refresh call.
let refreshPromise: Promise<boolean> | null = null

export function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function hydrateAuth() {
  const justLoggedIn = sessionStorage.getItem('justLoggedIn')

  if (justLoggedIn) {
    // Skip hydration once to avoid cookie race
    sessionStorage.removeItem('justLoggedIn')
    return
  }
  try {
    let res = await fetch('/api/auth/me', {
      credentials: 'include',
    })
    if (res.status === 401) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        res = await fetch('/api/auth/me', { credentials: 'include' })
      }
    }
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

  // Hard reload to guarantee a clean tab — wipes SWR cache, Zustand state,
  // and the Next.js App Router RSC cache in one shot. Without the reload,
  // a different user logging in on the same tab could briefly see the
  // previous user's data (e.g. the messages list) from the router cache.
  window.location.assign('/login')
}
