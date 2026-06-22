import { apiUrl } from '../config.ts'
import type { ApiResponse } from '../types/api.ts'

function rawRequest(path: string, init: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })
}

async function request<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
  let res = await rawRequest(path, init)

  if (res.status === 401 && path !== '/auth/refresh') {
    const refreshed = await rawRequest('/auth/refresh', { method: 'POST' })
    if (refreshed.ok) {
      res = await rawRequest(path, init)
    }
  }

  let body: ApiResponse<T> | null = null
  try {
    body = (await res.json()) as ApiResponse<T>
  } catch {
    body = null
  }

  if (!res.ok || !body) {
    return {
      success: false,
      message: body?.message ?? `HTTP_${res.status}`,
      data: null as T,
    }
  }
  return body
}

export function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'GET' })
}

export function apiPost<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export function apiPatch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, {
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'DELETE' })
}
