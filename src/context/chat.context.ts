import { createContext, useContext } from 'react'
import type { ChatResponse, ChatType, MessageResponse } from '../types/api.ts'

export type ChatState = {
  connected: boolean
  chats: ChatResponse[]
  messagesByChat: Record<string, MessageResponse[]>
  usersByUuid: Record<string, string>
  selectedChatUuid: string | null
}

export type CreateChatInput = {
  name: string
  chatType: ChatType
  memberUuids: string[]
}

export type ChatContextValue = {
  state: ChatState
  selectChat: (chatUuid: string) => void
  sendMessage: (content: string) => void
  createChat: (input: CreateChatInput) => void
  deleteChat: (chat: ChatResponse) => void
  refreshChats: () => void
  usernameOf: (uuid: string) => string
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
