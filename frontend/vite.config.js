import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Bind to all available IPs
           // Specify the port for local development (you can change if necessary)
    historyApiFallback: true,  // Ensure SPA routing works (important for React Router)
  },
  preview: {
    allowedHosts: ['online-auction-house-4.onrender.com'],  // Add your host here
  },
  build: {
    // If you're deploying to a subfolder, specify the base path here.
    // base: '/your-subpath/',  // Uncomment this if needed
  },
})
