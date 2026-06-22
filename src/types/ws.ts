import type { ChatResponse, ChatType, MessageResponse } from './api.ts'

export type OutgoingMessage =
  | { type: 'CREATE_CHAT'; name: string; chatType: ChatType; memberUuids: string[] }
  | { type: 'GET_CHATS' }
  | { type: 'GET_CHAT'; chatUuid: string }
  | { type: 'GET_CHAT_MESSAGES'; chatUuid: string }
  | { type: 'CREATE_MESSAGE'; chatUuid: string; content: string }
  | { type: 'EDIT_CHAT'; chatUuid: string; name: string; memberUuids: string[] }
  | { type: 'DELETE_CHAT'; chatUuid: string; memberUuids: string[] }

export type ServerEvent =
  | { kind: 'CHATS'; chats: ChatResponse[] }
  | { kind: 'CHAT_MESSAGES'; chat: ChatResponse; messages: MessageResponse[] }
  | { kind: 'MESSAGE'; message: MessageResponse; memberUuids: string[] }
  | { kind: 'CHAT'; chat: ChatResponse }
  | { kind: 'CHAT_DELETED'; chatUuid: string }

export function parseServerEvent(raw: string): ServerEvent | null {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
  if (!data || typeof data !== 'object') return null

  if (Array.isArray(data.chats)) {
    return { kind: 'CHATS', chats: data.chats as ChatResponse[] }
  }
  if (Array.isArray(data.messages) && data.chat) {
    return {
      kind: 'CHAT_MESSAGES',
      chat: data.chat as ChatResponse,
      messages: data.messages as MessageResponse[],
    }
  }
  if (data.message && typeof data.message === 'object') {
    return {
      kind: 'MESSAGE',
      message: data.message as MessageResponse,
      memberUuids: Array.isArray(data.memberUuids) ? (data.memberUuids as string[]) : [],
    }
  }
  if (data.chat && typeof data.chat === 'object') {

    return { kind: 'CHAT', chat: data.chat as ChatResponse }
  }
  if (typeof data.chatUuid === 'string' && Array.isArray(data.memberUuids)) {
    return { kind: 'CHAT_DELETED', chatUuid: data.chatUuid }
  }
  return null
}
