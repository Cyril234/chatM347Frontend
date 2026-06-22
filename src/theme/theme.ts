import { createTheme } from '@mui/material/styles'
import type { PaletteMode, Theme } from '@mui/material'

export function createAppTheme(mode: PaletteMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#3f51b5' },
      secondary: { main: '#00897b' },
      ...(mode === 'light'
        ? { background: { default: '#f4f6fb', paper: '#ffffff' } }
        : { background: { default: '#0f1115', paper: '#171a21' } }),
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, system-ui, Arial, sans-serif',
    },
  })
}
