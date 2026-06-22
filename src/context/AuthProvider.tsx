import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserData } from '../types/api.ts'
import { getCurrentUser } from '../api/users.ts'
import { loginRequest, logoutRequest, registerRequest } from '../api/auth.ts'
import type { LoginPayload, RegisterPayload } from '../api/auth.ts'
import { AuthContext } from './auth.context.ts'
import type { AuthResult, AuthStatus } from './auth.context.ts'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Aktuellen User laden; dient zugleich als Session-Check.
  const loadUser = useCallback(async (): Promise<boolean> => {
    const res = await getCurrentUser()
    if (res.success && res.data) {
      setUser(res.data)
      setStatus('authed')
      return true
    }
    setUser(null)
    setStatus('anon')
    return false
  }, [])

  // Session beim Start pruefen (einmalig). setState erfolgt erst im async Callback.
  useEffect(() => {
    let active = true
    void getCurrentUser().then((res) => {
      if (!active) return
      if (res.success && res.data) {
        setUser(res.data)
        setStatus('authed')
      } else {
        setUser(null)
        setStatus('anon')
      }
    })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthResult> => {
      const res = await loginRequest(payload)
      if (!res.success) return { success: false, message: res.message }
      await loadUser()
      return { success: true, message: res.message }
    },
    [loadUser],
  )

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthResult> => {
      const res = await registerRequest(payload)
      if (!res.success) return { success: false, message: res.message }
      // Das Backend setzt bei der Registrierung keine Cookies -> direkt einloggen.
      const loginRes = await loginRequest({ email: payload.email, password: payload.password })
      if (loginRes.success) await loadUser()
      return { success: true, message: res.message }
    },
    [loadUser],
  )

  const logout = useCallback(async (): Promise<void> => {
    await logoutRequest()
    setUser(null)
    setStatus('anon')
  }, [])

  const refreshUser = useCallback(async (): Promise<void> => {
    await loadUser()
  }, [loadUser])

  const value = useMemo(
    () => ({ status, user, login, register, logout, refreshUser }),
    [status, user, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
