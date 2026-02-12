export type Patient = {
  mrn: string
  name: string
  age: Date
  provider: string
  status: 'active' | 'inactive' | 'discharged'
}

export type ApiPatient = {
  id: number
  userId: number
  firstName: string
  lastName: string
  dob: string
  gender: 'MALE' | 'FEMALE' | 'UNSPECIFIED'
  phone: string
  email: string
  createdAt: string
}

export type PatientsResponse = {
  data: ApiPatient[]
  totalCount: number
  page: number
  limit: number
}
