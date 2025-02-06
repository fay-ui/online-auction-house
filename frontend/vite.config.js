import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Bind to all available IPs
    
  },
  preview: {
    allowedHosts: ['online-auction-house-4.onrender.com'],  // Add your host here
  },
})
