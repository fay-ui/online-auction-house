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
  build: {
    // If you're deploying to a subfolder, specify the base path here.
    // base: '/your-subpath/',  // Uncomment this if needed
  },
  // Optional: Ensure SPA routing works by setting the following for production:
  // Note: Render should handle this automatically if you are using the "static site" deployment.
  server: {
    historyApiFallback: true,  // Important for client-side routing (React Router)
  },
})
