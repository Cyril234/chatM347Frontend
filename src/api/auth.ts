import { apiPost } from './http.ts'

export type RegisterPayload = { email: string; password: string; username: string }
export type LoginPayload = { email: string; password: string }

export function registerRequest(payload: RegisterPayload) {
  return apiPost<null>('/auth/register', payload)
}

export function loginRequest(payload: LoginPayload) {
  return apiPost<null>('/auth/login', payload)
}

export function logoutRequest() {
  return apiPost<null>('/auth/logout')
}
