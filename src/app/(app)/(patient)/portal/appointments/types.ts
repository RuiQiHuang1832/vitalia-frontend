import type { Appointment } from '@/app/(app)/(provider)/patients/types'

export type AppointmentProvider = {
  id: number
  firstName: string
  lastName: string
  specialty: string
}

export type AppointmentWithProvider = Appointment & {
  provider: AppointmentProvider
}

export type PatientAppointmentsResponse = {
  data: AppointmentWithProvider[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}
