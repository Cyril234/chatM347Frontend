import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined'

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'radial-gradient(ellipse at 50% 0%, #e8eaf6, #f4f6fb 60%)'
            : 'radial-gradient(ellipse at 50% 0%, #1a1d2b, #0f1115 60%)',
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ChatBubbleOutlineIcon color="primary" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Chattrix
            </Typography>
          </Stack>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        {children}
      </Paper>
    </Box>
  )
}
