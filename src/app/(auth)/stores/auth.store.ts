import { create } from 'zustand'

export type Role = 'ADMIN' | 'PROVIDER' | 'PATIENT'

export interface User {
  id: number
  role: Role
}

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: Status
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  // login
  setUser: (user: User) =>
    set({
      user,
      status: 'authenticated',
    }),
  // logout
  clearUser: () =>
    set({
      user: null,
      status: 'unauthenticated',
    }),
}))
