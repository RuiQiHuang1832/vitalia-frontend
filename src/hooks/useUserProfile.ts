import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useUserProfile(enabled = true) {
  const user = useAuthStore((s) => s.user)
  console.log(user)
  const key = !user
    ? null
    : user.role === 'PROVIDER'
    ? `/providers/user/${user.id}`
    : user.role === 'PATIENT'
    ? `/patients/user/${user.id}`
    : null

  return useSWR(
    enabled ? key : null, // null = no fetch
    swrFetcher
  )
}
