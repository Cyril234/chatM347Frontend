import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GATEWAY_TARGET = 'http://localhost:8080'
const WS_TARGET = 'ws://localhost:3004'

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
