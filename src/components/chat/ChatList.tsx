import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import UserAvatar from '../common/UserAvatar.tsx'
import { useChat } from '../../context/chat.context.ts'
import { useAuth } from '../../context/auth.context.ts'
import { chatDisplayName } from '../../utils/format.ts'
import type { ChatResponse } from '../../types/api.ts'

export default function ChatList({ onNewChat }: { onNewChat: () => void }) {
  const { state, selectChat, deleteChat, usernameOf } = useChat()
  const { user } = useAuth()
  const currentUuid = user?.userUuid ?? ''
  const [toDelete, setToDelete] = useState<ChatResponse | null>(null)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Chats
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {state.chats.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            Noch keine Chats. Erstelle deinen ersten Chat.
          </Typography>
        ) : (
          <List disablePadding>
            {state.chats.map((chat) => {
              const name = chatDisplayName(chat, currentUuid, usernameOf)
              return (
                <ListItemButton
                  key={chat.chatUuid}
                  selected={state.selectedChatUuid === chat.chatUuid}
                  onClick={() => selectChat(chat.chatUuid)}
                >
                  <ListItemAvatar>
                    <UserAvatar name={chat.chatType === 'GROUP' ? chat.name || name : name} size={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={
                      chat.chatType === 'GROUP'
                        ? `Gruppe · ${chat.memberUuids.length} Mitglieder`
                        : 'Direktnachricht'
                    }
                    slotProps={{
                      primary: { noWrap: true },
                      secondary: { noWrap: true },
                    }}
                  />
                  <Tooltip title="Chat löschen">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        setToDelete(chat)
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              )
            })}
          </List>
        )}
      </Box>

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={onNewChat}>
          Neuer Chat
        </Button>
      </Box>

      <Dialog open={toDelete !== null} onClose={() => setToDelete(null)}>
        <DialogTitle>Chat löschen?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Der Chat wird für <strong>alle Mitglieder</strong> entfernt und alle Nachrichten werden
            gelöscht. Das kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Abbrechen</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (toDelete) deleteChat(toDelete)
              setToDelete(null)
            }}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
