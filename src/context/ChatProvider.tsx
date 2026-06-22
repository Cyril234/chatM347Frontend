import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './auth.context.ts'
import { getAllUsers } from '../api/users.ts'
import { wsUrl } from '../config.ts'
import { parseServerEvent } from '../types/ws.ts'
import type { OutgoingMessage } from '../types/ws.ts'
import type { ChatResponse, MessageResponse } from '../types/api.ts'
import { ChatContext } from './chat.context.ts'
import type { ChatContextValue, ChatState, CreateChatInput, EditChatInput } from './chat.context.ts'

const DEV = import.meta.env.DEV
function dlog(...args: unknown[]) {
  if (DEV) console.info('[chat-ws]', ...args)
}

type Action =
  | { type: 'RESET' }
  | { type: 'SET_CONNECTED'; connected: boolean }
  | { type: 'SET_USERS'; users: Record<string, string> }
  | { type: 'SET_CHATS'; chats: ChatResponse[] }
  | { type: 'UPSERT_CHAT'; chat: ChatResponse }
  | { type: 'REMOVE_CHAT'; chatUuid: string }
  | { type: 'SET_MESSAGES'; chatUuid: string; messages: MessageResponse[] }
  | { type: 'ADD_MESSAGE'; message: MessageResponse }
  | { type: 'SELECT_CHAT'; chatUuid: string | null }

const initialState: ChatState = {
  connected: false,
  chats: [],
  messagesByChat: {},
  usersByUuid: {},
  selectedChatUuid: null,
}

function timeOf(value: string | number): number {
  return new Date(value).getTime()
}

function sortChats(chats: ChatResponse[]): ChatResponse[] {
  return [...chats].sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt))
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'RESET':
      return initialState
    case 'SET_CONNECTED':
      return { ...state, connected: action.connected }
    case 'SET_USERS':
      return { ...state, usersByUuid: { ...state.usersByUuid, ...action.users } }
    case 'SET_CHATS':
      return { ...state, chats: sortChats(action.chats) }
    case 'UPSERT_CHAT': {
      const exists = state.chats.some((c) => c.chatUuid === action.chat.chatUuid)
      const chats = exists
        ? state.chats.map((c) => (c.chatUuid === action.chat.chatUuid ? action.chat : c))
        : [action.chat, ...state.chats]
      return { ...state, chats: sortChats(chats) }
    }
    case 'REMOVE_CHAT': {
      const messagesByChat = { ...state.messagesByChat }
      delete messagesByChat[action.chatUuid]
      return {
        ...state,
        chats: state.chats.filter((c) => c.chatUuid !== action.chatUuid),
        messagesByChat,
        selectedChatUuid:
          state.selectedChatUuid === action.chatUuid ? null : state.selectedChatUuid,
      }
    }
    case 'SET_MESSAGES':
      return {
        ...state,
        messagesByChat: { ...state.messagesByChat, [action.chatUuid]: action.messages },
      }
    case 'ADD_MESSAGE': {
      const msg = action.message

      const withName: MessageResponse =
        msg.username == null
          ? { ...msg, username: state.usersByUuid[msg.senderUuid] ?? null }
          : msg
      const existing = state.messagesByChat[msg.chatUuid] ?? []
      if (existing.some((m) => m.messageUuid === msg.messageUuid)) return state
      return {
        ...state,
        messagesByChat: {
          ...state.messagesByChat,
          [msg.chatUuid]: [...existing, withName],
        },
      }
    }
    case 'SELECT_CHAT':
      return { ...state, selectedChatUuid: action.chatUuid }
    default:
      return state
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { status, user } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)

  const socketRef = useRef<WebSocket | null>(null)
  const outboxRef = useRef<OutgoingMessage[]>([])
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldConnectRef = useRef(false)

  const send = useCallback((msg: OutgoingMessage) => {
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      dlog('→ send', msg.type)
      socket.send(JSON.stringify(msg))
    } else {
      dlog('→ queued (socket nicht offen)', msg.type)
      outboxRef.current.push(msg)
    }
  }, [])

  useEffect(() => {
    if (status !== 'authed' || !user) {
      shouldConnectRef.current = false
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      socketRef.current?.close()
      socketRef.current = null
      dispatch({ type: 'RESET' })
      return
    }

    shouldConnectRef.current = true
    let cancelled = false

    void getAllUsers().then((res) => {
      if (cancelled || !res.success || !res.data) return
      const map: Record<string, string> = {}
      for (const u of res.data) map[u.userUuid] = u.username
      map[user.userUuid] = user.username
      dispatch({ type: 'SET_USERS', users: map })
    })

    const connect = () => {
      if (!shouldConnectRef.current) return
      dlog('verbinde mit', wsUrl())
      const socket = new WebSocket(wsUrl())
      socketRef.current = socket

      socket.onopen = () => {
        dlog('verbunden (open)')
        dispatch({ type: 'SET_CONNECTED', connected: true })
        socket.send(JSON.stringify({ type: 'GET_CHATS' } satisfies OutgoingMessage))
        const queued = outboxRef.current
        outboxRef.current = []
        for (const m of queued) socket.send(JSON.stringify(m))
      }

      socket.onmessage = (event) => {
        const parsed = parseServerEvent(event.data as string)
        if (!parsed) {
          dlog('← unbekannte/leere Nachricht', String(event.data).slice(0, 200))
          return
        }
        dlog('← empfangen', parsed.kind)
        switch (parsed.kind) {
          case 'CHATS':
            dispatch({ type: 'SET_CHATS', chats: parsed.chats })
            break
          case 'CHAT_MESSAGES':
            dispatch({ type: 'UPSERT_CHAT', chat: parsed.chat })
            dispatch({
              type: 'SET_MESSAGES',
              chatUuid: parsed.chat.chatUuid,
              messages: parsed.messages,
            })
            break
          case 'MESSAGE':
            dispatch({ type: 'ADD_MESSAGE', message: parsed.message })
            break
          case 'CHAT':
            dispatch({ type: 'UPSERT_CHAT', chat: parsed.chat })
            break
          case 'CHAT_DELETED':
            dispatch({ type: 'REMOVE_CHAT', chatUuid: parsed.chatUuid })
            break
        }
      }

      socket.onclose = (e) => {
        dlog('getrennt (close)', `code=${e.code}`, e.reason || '')
        dispatch({ type: 'SET_CONNECTED', connected: false })
        if (socketRef.current === socket) socketRef.current = null
        if (shouldConnectRef.current) {
          reconnectRef.current = setTimeout(connect, 2500)
        }
      }

      socket.onerror = () => {
        dlog('Verbindungsfehler')
        socket.close()
      }
    }

    connect()

    return () => {
      cancelled = true
      shouldConnectRef.current = false
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      const s = socketRef.current
      socketRef.current = null
      if (s) {
        s.onclose = null
        s.close()
      }
    }
  }, [status, user, send])

  const selectChat = useCallback(
    (chatUuid: string) => {
      dispatch({ type: 'SELECT_CHAT', chatUuid })
      send({ type: 'GET_CHAT_MESSAGES', chatUuid })
    },
    [send],
  )

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      const chatUuid = state.selectedChatUuid
      if (!trimmed || !chatUuid) return
      send({ type: 'CREATE_MESSAGE', chatUuid, content: trimmed })
    },
    [send, state.selectedChatUuid],
  )

  const createChat = useCallback(
    (input: CreateChatInput) => {
      send({
        type: 'CREATE_CHAT',
        name: input.name,
        chatType: input.chatType,
        memberUuids: input.memberUuids,
      })
    },
    [send],
  )

  const editChat = useCallback(
    (input: EditChatInput) => {
      send({
        type: 'EDIT_CHAT',
        chatUuid: input.chatUuid,
        name: input.name,
        memberUuids: input.memberUuids,
      })
    },
    [send],
  )

  const deleteChat = useCallback(
    (chat: ChatResponse) => {
      send({ type: 'DELETE_CHAT', chatUuid: chat.chatUuid, memberUuids: chat.memberUuids })
    },
    [send],
  )

  const refreshChats = useCallback(() => {
    send({ type: 'GET_CHATS' })
  }, [send])

  const usernameOf = useCallback(
    (uuid: string) => state.usersByUuid[uuid] ?? 'Unbekannt',
    [state.usersByUuid],
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      state,
      selectChat,
      sendMessage,
      createChat,
      editChat,
      deleteChat,
      refreshChats,
      usernameOf,
    }),
    [state, selectChat, sendMessage, createChat, editChat, deleteChat, refreshChats, usernameOf],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
