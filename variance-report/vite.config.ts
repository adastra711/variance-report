import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      external: ['scheduler'],
      output: {
        globals: {
          scheduler: 'scheduler'
        }
      }
    }
  },
  server: {
    port: 3000,
    https: {
      key: process.env.HTTPS_KEY,
      cert: process.env.HTTPS_CERT
    }
  }
})
