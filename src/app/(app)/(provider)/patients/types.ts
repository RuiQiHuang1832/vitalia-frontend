type Status = 'ACTIVE' | 'INACTIVE' | 'DISCHARGED'
type Gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED'

export type Patient = {
  mrn: string
  name: string
  age: Date
  status: Status
  lastVisit: string
}

export type PatientsResponse = {
  data: ApiPatient[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export type PatientBase = {
  id: number
  userId: number | null
  firstName: string
  lastName: string
  dob: string
  gender: Gender
  phone: string
  email: string
  createdAt: string
  status: Status
}

export type ApiPatient = PatientBase & {
  appointments: {
    startTime: string
  }[]
}

export type PatientFull = PatientBase & {
  appointments: Appointment[]
  problems: Problem[]
  allergies: Allergy[]
  medications: Medication[]
  vitals: Vital[]
}

export type PatientOverview = {
  id: number
  data: PatientFull
}

export type Problem = {
  id: number
  description: string
  createdAt: string
}

export type Allergy = {
  id: number
  name: string
  severity: string
  createdAt: string
}

export type Vital = {
  id: number
  appointmentId: number
  patientId: number
  providerId: number
  heartRate: number | null
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  temperature: number | null
  weight: number | null
  oxygenSaturation: number | null
  recordedAt: string
}
export type Medication = {
  id: number
  patientId: number
  prescribedBy: number
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string | null
  status: 'ACTIVE' | 'COMPLETED'
  notes: string | null
  createdAt: string
  updatedAt: string
}
export type Appointment = {
  id: number
  providerId: number
  patientId: number
  startTime: string
  endTime: string
  reason: string | null
  createdAt: string
  updatedAt: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  visitNote: VisitNote | null
}
export type VisitNote = {
  id: number
  appointmentId: number
  providerId: number
  latestVersion: number
  createdAt: string
  updatedAt: string
  versions: VisitNoteVersion[]
}
export type VisitNoteVersion = {
  id: number
  visitNoteId: number
  version: number
  content: string
  editedById: number
  createdAt: string
}
