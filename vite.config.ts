import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ziel-Hosts fuer den lokalen Dev-Proxy. Bei Bedarf anpassen, falls das Backend
// auf anderen Ports laeuft.
const GATEWAY_TARGET = 'http://localhost:8080'
const WS_TARGET = 'ws://localhost:3004'

// https://vite.dev/config/
// Der Dev-Proxy macht REST + WebSocket im Browser same-origin (localhost:5173).
// Dadurch werden die httpOnly-Auth-Cookies als first-party mitgesendet und es
// entstehen keine CORS-Probleme. In Produktion uebernimmt der Reverse-Proxy (Caddy)
// diese Aufgabe; dort greift dieser Block nicht.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': { target: GATEWAY_TARGET, changeOrigin: true },
      '/users': { target: GATEWAY_TARGET, changeOrigin: true },
      '/ws': { target: WS_TARGET, ws: true, changeOrigin: true },
    },
  },
})
