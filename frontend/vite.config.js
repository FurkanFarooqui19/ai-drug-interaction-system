import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/check': 'http://localhost:8000',
      '/check-from-image': 'http://localhost:8000',
      '/chat': 'http://localhost:8000',
      '/clinical-advice': 'http://localhost:8000',
      '/drugs': 'http://localhost:8000',
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts':       ['recharts'],
          'icons':        ['@phosphor-icons/react'],
        },
      },
    },
  },
})
