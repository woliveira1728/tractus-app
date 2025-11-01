import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    watch: {
      // Use polling instead of relying on filesystem events.
      // Useful when working on network mounts, WSL, or paths with spaces/accents.
      usePolling: true,
      // Polling interval in milliseconds (adjust if needed).
      interval: 100,
    },
  },
})
