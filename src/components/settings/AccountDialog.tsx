import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../context/auth.context.ts'
import { deleteAccount, editCredential, editUsername } from '../../api/users.ts'
import { emailError, passwordError, usernameError } from '../../utils/validation.ts'
import { formatDateTime } from '../../utils/format.ts'

type Feedback = { type: 'success' | 'error'; text: string } | null

export default function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, refreshUser, logout } = useAuth()
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!user) return null

  const saveUsername = async () => {
    const err = usernameError(username)
    if (err) {
      setFeedback({ type: 'error', text: err })
      return
    }
    setBusy(true)
    const res = await editUsername(username)
    setBusy(false)
    if (res.success) {
      await refreshUser()
      setFeedback({ type: 'success', text: 'Benutzername aktualisiert.' })
    } else {
      setFeedback({ type: 'error', text: res.message || 'Aenderung fehlgeschlagen.' })
    }
  }

  const saveCredential = async () => {
    if (!email && !password) {
      setFeedback({ type: 'error', text: 'Bitte E-Mail oder Passwort ausfuellen.' })
      return
    }
    const err = (email ? emailError(email) : null) ?? (password ? passwordError(password) : null)
    if (err) {
      setFeedback({ type: 'error', text: err })
      return
    }
    setBusy(true)
    const res = await editCredential({ email: email || undefined, password: password || undefined })
    setBusy(false)
    if (res.success) {
      await refreshUser()
      setEmail('')
      setPassword('')
      setFeedback({ type: 'success', text: 'Zugangsdaten aktualisiert.' })
    } else {
      setFeedback({ type: 'error', text: res.message || 'Aenderung fehlgeschlagen.' })
    }
  }

  const removeAccount = async () => {
    setBusy(true)
    const res = await deleteAccount()
    setBusy(false)
    if (res.success) {
      await logout() // ProtectedRoute leitet anschliessend auf /sign-in
    } else {
      setFeedback({ type: 'error', text: res.message || 'Loeschen fehlgeschlagen.' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Konto-Einstellungen</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {feedback && <Alert severity={feedback.type}>{feedback.text}</Alert>}

          <Box>
            <Typography variant="body2" color="text.secondary">
              Angemeldet als
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              Mitglied seit {formatDateTime(user.createdAt)}
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Benutzername</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button variant="outlined" onClick={saveUsername} disabled={busy}>
                Speichern
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">E-Mail / Passwort aendern</Typography>
            <TextField
              fullWidth
              size="small"
              label="Neue E-Mail (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Neues Passwort (optional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={saveCredential}
              disabled={busy}
              sx={{ alignSelf: 'flex-start' }}
            >
              Speichern
            </Button>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="error">
              Konto loeschen
            </Typography>
            {confirmDelete ? (
              <Alert
                severity="warning"
                action={
                  <>
                    <Button color="inherit" size="small" onClick={() => setConfirmDelete(false)}>
                      Abbrechen
                    </Button>
                    <Button color="error" size="small" onClick={removeAccount} disabled={busy}>
                      Endgueltig loeschen
                    </Button>
                  </>
                }
              >
                Konto wirklich unwiderruflich loeschen?
              </Alert>
            ) : (
              <Button
                color="error"
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
                onClick={() => setConfirmDelete(true)}
              >
                Konto loeschen
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
