import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.245.139',  // Your system's IP address
    port: 5173,              // Optional: Change the port if needed
  },
})
