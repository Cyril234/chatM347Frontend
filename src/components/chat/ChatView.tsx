import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import SettingsIcon from '@mui/icons-material/Settings'
import MessageList from './MessageList.tsx'
import ChatInput from './ChatInput.tsx'
import GroupSettingsDialog from './GroupSettingsDialog.tsx'
import UserAvatar from '../common/UserAvatar.tsx'
import { useChat } from '../../context/chat.context.ts'
import { useAuth } from '../../context/auth.context.ts'
import { chatDisplayName } from '../../utils/format.ts'
import type { ChatResponse } from '../../types/api.ts'

export default function ChatView({ chat }: { chat: ChatResponse }) {
  const { state, sendMessage, usernameOf } = useChat()
  const { user } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const currentUuid = user?.userUuid ?? ''
  const title = chatDisplayName(chat, currentUuid, usernameOf)
  const isGroup = chat.chatType === 'GROUP'
  const messages = state.messagesByChat[chat.chatUuid] ?? []
  const memberNames = chat.memberUuids.map((u) => (u === currentUuid ? 'Du' : usernameOf(u)))

  return (
    <Stack sx={{ height: '100%' }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <UserAvatar name={isGroup ? chat.name || title : title} size={40} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {isGroup ? `Gruppe · ${memberNames.join(', ')}` : 'Direktnachricht'}
          </Typography>
        </Box>
        {isGroup && (
          <>
            <Chip size="small" label={`${chat.memberUuids.length} Mitglieder`} />
            <Tooltip title="Gruppeneinstellungen">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      <MessageList
        messages={messages}
        currentUserUuid={currentUuid}
        isGroup={isGroup}
        usernameOf={usernameOf}
      />

      <ChatInput onSend={sendMessage} disabled={!state.connected} />

      {isGroup && settingsOpen && (
        <GroupSettingsDialog onClose={() => setSettingsOpen(false)} chat={chat} />
      )}
    </Stack>
  )
}
