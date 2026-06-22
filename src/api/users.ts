import { apiDelete, apiGet, apiPatch } from './http.ts'
import type { UserAnonymData, UserData } from '../types/api.ts'

export function getCurrentUser() {
  return apiGet<UserData>('/users/one')
}

export function getAllUsers() {
  return apiGet<UserAnonymData[]>('/users/all')
}

export function editUsername(username: string) {
  return apiPatch<null>('/users/edit/username', { username })
}

export function editCredential(payload: { email?: string; password?: string }) {
  return apiPatch<null>('/users/edit/credential', payload)
}

export function deleteAccount() {
  return apiDelete<null>('/users/delete')
}
