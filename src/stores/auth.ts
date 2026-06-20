import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  providers?: string[]
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoggedIn: boolean

  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),

      logout: () => set({ user: null, token: null, isLoggedIn: false }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    { name: 'kith-auth' }
  )
)
