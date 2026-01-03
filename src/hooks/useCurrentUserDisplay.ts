import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { useUserProfile } from '@/hooks/useUserProfile'
import { capitalize } from '@/lib/utils'

const ADMIN_PROFILE = {
  firstName: 'Admin',
  lastName: 'Admin',
  email: 'admin@gmail.com',
  avatar: '/avatars/shadcn.jpg',
  specialty: 'Administrator',
}

export function useCurrentUserDisplay() {
  const { user } = useAuthStore()
  const role = user?.role

  const isAdmin = role === 'ADMIN'
  const isProvider = role === 'PROVIDER'

  const { data: profile, isLoading } = useUserProfile(!isAdmin)

  const finalProfile = isAdmin ? ADMIN_PROFILE : profile

  const firstName = capitalize(finalProfile?.firstName ?? '')
  const lastName = capitalize(finalProfile?.lastName ?? '')
  const fullName = `${firstName} ${lastName}`.trim()
  const specialty = capitalize(finalProfile?.specialty ?? 'Patient')
  const displayName = isProvider ? `Dr. ${fullName}`.trim() : fullName
  const greeting = isProvider ? `Dr. ${lastName}` : firstName

  const email = finalProfile?.email ?? ''
  const avatar = finalProfile?.avatar ?? ''

  return {
    role,
    isAdmin,
    isProvider,
    fullName,
    displayName,
    greeting,
    email,
    avatar,
    isLoading,
    specialty,
  }
}
