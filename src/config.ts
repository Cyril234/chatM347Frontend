// Zentrale URL-Konfiguration.
//
// REST-Basis kommt aus VITE_GATEWAY_URL (so heisst das Build-Arg im Dockerfile/CI).
// Leerer Wert => same-origin (Dev-Proxy bzw. Caddy uebernehmen das Routing).
const GATEWAY_URL = (import.meta.env.VITE_GATEWAY_URL ?? '').replace(/\/+$/, '')

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${GATEWAY_URL}${p}`
}

// Liefert die vollstaendige WebSocket-URL zum Handler /ws/chat.
// - VITE_WS_URL gesetzt: wird verwendet (mit oder ohne abschliessendes /chat).
// - leer: same-origin aus window.location ableiten.
export function wsUrl(): string {
  const configured = import.meta.env.VITE_WS_URL
  if (configured) {
    const base = configured.replace(/\/+$/, '')
    return base.endsWith('/chat') ? base : `${base}/chat`
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws/chat`
}
