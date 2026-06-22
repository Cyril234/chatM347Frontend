// Spiegelt die Backend-Validierung (shared DTOs), damit Eingaben nicht erst
// serverseitig mit 400 abgelehnt werden.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/
const USERNAME_RE = /^[a-zA-Z0-9_]+$/

export function emailError(email: string): string | null {
  if (!email) return 'E-Mail darf nicht leer sein.'
  if (email.length > 255) return 'E-Mail darf hoechstens 255 Zeichen lang sein.'
  if (!EMAIL_RE.test(email)) return 'Bitte eine gueltige E-Mail-Adresse eingeben.'
  return null
}

export function passwordError(password: string): string | null {
  if (!password) return 'Passwort darf nicht leer sein.'
  if (password.length < 8 || password.length > 64) return 'Passwort muss 8-64 Zeichen lang sein.'
  if (!PASSWORD_RE.test(password)) {
    return 'Passwort braucht Gross-, Kleinbuchstaben und mindestens eine Ziffer.'
  }
  return null
}

export function usernameError(username: string): string | null {
  if (!username) return 'Benutzername darf nicht leer sein.'
  if (username.length < 3 || username.length > 30) return 'Benutzername muss 3-30 Zeichen lang sein.'
  if (!USERNAME_RE.test(username)) return 'Nur Buchstaben, Zahlen und Unterstrich erlaubt.'
  return null
}
