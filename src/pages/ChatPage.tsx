import { useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ForumIcon from '@mui/icons-material/Forum'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import ChatList from '../components/chat/ChatList.tsx'
import ChatView from '../components/chat/ChatView.tsx'
import NewChatDialog from '../components/chat/NewChatDialog.tsx'
import AccountDialog from '../components/settings/AccountDialog.tsx'
import UserAvatar from '../components/common/UserAvatar.tsx'
import { useAuth } from '../context/auth.context.ts'
import { useChat } from '../context/chat.context.ts'
import { useColorMode } from '../context/color-mode.context.ts'

const DRAWER_WIDTH = 320

export default function ChatPage() {
  const { user, logout } = useAuth()
  const { state } = useChat()
  const { mode, toggle } = useColorMode()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const selectedChat = useMemo(
    () => state.chats.find((c) => c.chatUuid === state.selectedChatUuid) ?? null,
    [state.chats, state.selectedChatUuid],
  )

  return (
    <Box sx={{ display: 'flex', height: '100dvh', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Chattrix
          </Typography>
          <Tooltip title={state.connected ? 'Verbunden' : 'Verbindung wird aufgebaut…'}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                ml: 1.5,
                bgcolor: state.connected ? 'success.main' : 'warning.main',
              }}
            />
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={mode === 'dark' ? 'Helles Design' : 'Dunkles Design'}>
            <IconButton color="inherit" onClick={toggle}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Konto">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
              <UserAvatar name={user?.username ?? ''} size={34} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={menuAnchor}
            open={menuAnchor !== null}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Stack>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null)
                setAccountOpen(true)
              }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Konto-Einstellungen</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null)
                void logout()
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Abmelden</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ChatList onNewChat={() => setNewChatOpen(true)} />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100dvh' }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {selectedChat ? (
            <ChatView chat={selectedChat} />
          ) : (
            <Stack
              spacing={1}
              sx={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <ForumIcon sx={{ fontSize: 64, opacity: 0.4 }} />
              <Typography>Waehle links einen Chat oder erstelle einen neuen.</Typography>
            </Stack>
          )}
        </Box>
      </Box>

      <NewChatDialog open={newChatOpen} onClose={() => setNewChatOpen(false)} />
      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
    </Box>
  )
}
