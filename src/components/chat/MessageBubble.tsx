import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import UserAvatar from '../common/UserAvatar.tsx'
import { formatTime } from '../../utils/format.ts'
import type { MessageResponse } from '../../types/api.ts'

export default function MessageBubble({
  message,
  mine,
  senderName,
  showSender,
}: {
  message: MessageResponse
  mine: boolean
  senderName: string
  showSender: boolean
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', mb: 1 }}>
      <Stack
        direction={mine ? 'row-reverse' : 'row'}
        spacing={1}
        sx={{ alignItems: 'flex-end', maxWidth: '75%' }}
      >
        {!mine && <UserAvatar name={senderName} size={32} />}
        <Box sx={{ minWidth: 0 }}>
          {showSender && !mine && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {senderName}
            </Typography>
          )}
          <Paper
            elevation={0}
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: mine ? 'primary.main' : 'action.hover',
              color: mine ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopRightRadius: mine ? 4 : 16,
              borderTopLeftRadius: mine ? 16 : 4,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.25 }}
            >
              {formatTime(message.createdAt)}
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </Box>
  )
}
