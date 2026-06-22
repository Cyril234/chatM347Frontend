

const GATEWAY_URL = (import.meta.env.VITE_GATEWAY_URL ?? '').replace(/\/+$/, '')

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${GATEWAY_URL}${p}`
}

export function wsUrl(): string {
  const configured = import.meta.env.VITE_WS_URL
  if (configured) {
    const base = configured.replace(/\/+$/, '')
    return base.endsWith('/chat') ? base : `${base}/chat`
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws/chat`
}
