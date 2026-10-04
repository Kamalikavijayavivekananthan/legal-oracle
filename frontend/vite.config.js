import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-backend': {
        target: 'https://legal-oracle-1.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-backend/, ''),
      },
    },
  },
})