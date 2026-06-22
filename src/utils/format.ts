import type { BackendDate, ChatResponse } from '../types/api.ts'

export function toDate(value: BackendDate): Date {
  return new Date(value)
}

export function formatTime(value: BackendDate): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(value: BackendDate): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('de-CH', { dateStyle: 'medium', timeStyle: 'short' })
}

// Anzeigename eines Chats:
// - GROUP:   gespeicherter Chatname
// - PRIVATE: Username des anderen Teilnehmers (Fallback: Chatname)
export function chatDisplayName(
  chat: ChatResponse,
  currentUserUuid: string,
  usernameOf: (uuid: string) => string,
): string {
  if (chat.chatType === 'PRIVATE') {
    const other = chat.memberUuids.find((u) => u !== currentUserUuid)
    if (other) return usernameOf(other)
  }
  return chat.name || 'Chat'
}

export function initials(name: string): string {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Deterministische Farbe aus einem String (fuer Avatare).
export function colorFromString(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 55%, 45%)`
}
