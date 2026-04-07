export const AUDIT_ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'VIEW'] as const
export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const AUDIT_ENTITIES = [
  'USER',
  'PATIENT',
  'PROVIDER',
  'APPOINTMENT',
  'VISIT_NOTE',
  'VISIT_NOTE_ENTRY',
  'PROBLEM',
  'ALLERGY',
  'MEDICATION',
  'VITAL',
  'PROVIDER_AVAILABILITY',
] as const
export type AuditEntity = (typeof AUDIT_ENTITIES)[number]

export const USER_ROLES = ['PATIENT', 'PROVIDER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface AuditLog {
  id: number
  userId: number
  userRole: UserRole
  action: AuditAction
  entity: AuditEntity
  entityId: number
  createdAt: string
  details: Record<string, unknown> | null
  user: {
    id: number
    role: UserRole
    patient: { firstName: string; lastName: string } | null
    provider: { firstName: string; lastName: string } | null
  }
}

export interface AuditLogsResponse {
  data: AuditLog[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export interface AuditLogFilters {
  action?: AuditAction
  entity?: AuditEntity
  userRole?: UserRole
  from?: string
  to?: string
}
