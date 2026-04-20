import { create } from 'zustand'

export type Role = 'ADMIN' | 'PROVIDER' | 'PATIENT'

export interface User {
  id: number
  email: string
  role: Role
}

type Status = 'loading' | 'authenticated' | 'unauthenticated'

type SessionPayload = {
  user: User
  providerId?: number
  patientId?: number
}

interface AuthState {
  user: User | null
  status: Status
  providerId?: number
  patientId?: number
  setSession: (payload: SessionPayload) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  providerId: undefined,
  patientId: undefined,
  setSession: (payload: SessionPayload) =>
    set({
      user: payload.user,
      status: 'authenticated',
      providerId: payload.providerId,
      patientId: payload.patientId,
    }),
  clearUser: () =>
    set({
      user: null,
      status: 'unauthenticated',
      providerId: undefined,
      patientId: undefined,
    }),
}))
