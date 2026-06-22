import { createContext, useContext } from 'react'
import type { UserData } from '../types/api.ts'
import type { LoginPayload, RegisterPayload } from '../api/auth.ts'

export type AuthStatus = 'loading' | 'authed' | 'anon'

export type AuthResult = { success: boolean; message: string }

export type AuthContextValue = {
  status: AuthStatus
  user: UserData | null
  login: (payload: LoginPayload) => Promise<AuthResult>
  register: (payload: RegisterPayload) => Promise<AuthResult>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
