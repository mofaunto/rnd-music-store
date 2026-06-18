import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendHost = process.env.VITE_BACKEND_HOST || 'localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/health': `http://${backendHost}`,
      '/api': `http://${backendHost}`
    }
  }
})
