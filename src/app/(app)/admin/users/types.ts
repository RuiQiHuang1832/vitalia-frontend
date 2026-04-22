export const USER_ROLES = ['PATIENT', 'PROVIDER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_FILTER_OPTIONS = ['ALL', ...USER_ROLES] as const
export type UserRoleFilter = (typeof USER_ROLE_FILTER_OPTIONS)[number]

export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'DISCHARGED'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export interface UserRow {
  userId: number
  email: string
  role: UserRole
  createdAt: string
  firstName: string | null
  lastName: string | null
  status: UserStatus | null
  profileId: number | null
}

export interface UsersResponse {
  data: UserRow[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export interface UsersFilters {
  role?: UserRole
}
