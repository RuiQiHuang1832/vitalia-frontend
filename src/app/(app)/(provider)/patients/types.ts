type status = 'ACTIVE' | 'INACTIVE' | 'DISCHARGED'
type gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED'

export type Patient = {
  mrn: string
  name: string
  age: Date
  status: status
  lastVisit: Date | null
}

export type ApiPatient = {
  id: number
  userId: number
  firstName: string
  lastName: string
  dob: string
  gender: gender
  phone: string
  email: string
  createdAt: string
  status: status
  appointments: {
    startTime: Date
  }[]
}

export type PatientsResponse = {
  data: ApiPatient[]
  totalCount: number
  page: number
  limit: number
}
