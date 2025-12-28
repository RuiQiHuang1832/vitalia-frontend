import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import useSWR from 'swr'
import { apiUrl } from '../lib/api'
const fetcher = async (url: string) => {
  const res = await fetch(apiUrl(url), { credentials: 'include' })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? `Failed to fetch ${url} (${res.status})`)
  }

  return data
}

export function useUserProfile(enabled = true) {
  const user = useAuthStore((s) => s.user)
  const key = !user
    ? null
    : user.role === 'PROVIDER'
    ? `/providers/user/${user.id}`
    : user.role === 'PATIENT'
    ? `/patients/user/${user.id}`
    : null

  return useSWR(
    enabled ? key : null, // null = no fetch
    fetcher
  )
}
