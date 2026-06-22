import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AuthLayout from '../components/common/AuthLayout.tsx'
import { useAuth } from '../context/auth.context.ts'
import { emailError, passwordError, usernameError } from '../utils/validation.ts'

export default function SignUp() {
  const { status, register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authed') return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const err = usernameError(username) ?? emailError(email) ?? passwordError(password)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setSubmitting(true)
    const res = await register({ username, email, password })
    setSubmitting(false)
    if (res.success) navigate('/', { replace: true })
    else setError(res.message || 'Registrierung fehlgeschlagen.')
  }

  return (
    <AuthLayout title="Konto erstellen" subtitle="In wenigen Sekunden loslegen.">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Benutzername"
            autoComplete="username"
            fullWidth
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText="3-30 Zeichen: Buchstaben, Zahlen, Unterstrich"
          />
          <TextField
            label="E-Mail"
            type="email"
            autoComplete="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Passwort"
            type="password"
            autoComplete="new-password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Mind. 8 Zeichen, mit Gross-, Kleinbuchstabe und Ziffer"
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? 'Konto wird erstellt…' : 'Registrieren'}
          </Button>
          <Typography variant="body2" align="center" color="text.secondary">
            Bereits ein Konto? <Link component={RouterLink} to="/sign-in">Anmelden</Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
