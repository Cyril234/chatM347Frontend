import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MessageBubble from './MessageBubble.tsx'
import type { MessageResponse } from '../../types/api.ts'

export default function MessageList({
  messages,
  currentUserUuid,
  isGroup,
  usernameOf,
}: {
  messages: MessageResponse[]
  currentUserUuid: string
  isGroup: boolean
  usernameOf: (uuid: string) => string
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Noch keine Nachrichten — schreib die erste!</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
      {messages.map((m) => (
        <MessageBubble
          key={m.messageUuid}
          message={m}
          mine={m.senderUuid === currentUserUuid}
          senderName={m.username ?? usernameOf(m.senderUuid)}
          showSender={isGroup}
        />
      ))}
      <div ref={endRef} />
    </Box>
  )
}
