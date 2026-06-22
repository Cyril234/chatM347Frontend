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
import { emailError } from '../utils/validation.ts'

export default function SignIn() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authed') return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const emailErr = emailError(email)
    if (emailErr) {
      setError(emailErr)
      return
    }
    if (!password) {
      setError('Bitte Passwort eingeben.')
      return
    }
    setSubmitting(true)
    const res = await login({ email, password })
    setSubmitting(false)
    if (res.success) navigate('/', { replace: true })
    else setError('Anmeldung fehlgeschlagen. E-Mail oder Passwort ist falsch.')
  }

  return (
    <AuthLayout title="Anmelden" subtitle="Willkommen zurueck!">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="E-Mail"
            type="email"
            autoComplete="email"
            fullWidth
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Passwort"
            type="password"
            autoComplete="current-password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? 'Anmelden…' : 'Anmelden'}
          </Button>
          <Typography variant="body2" align="center" color="text.secondary">
            Noch kein Konto? <Link component={RouterLink} to="/sign-up">Registrieren</Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
