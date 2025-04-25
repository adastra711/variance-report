<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'fluent-vendor': ['@fluentui/react-components'],
        }
      }
    }
  },
  server: {
    port: 3000,
    https: {
      key: process.env.HTTPS_KEY,
      cert: process.env.HTTPS_CERT
=======
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      },
      proxy: {
        '/api': {
          target: 'http://localhost:7071',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      // Hardcoded Azure OpenAI values for testing
      'import.meta.env.VITE_AZURE_OPENAI_API_KEY': JSON.stringify("c4205a4a0c6f4d0c9d2c4c0c0c0c0c0c"),
      'import.meta.env.VITE_AZURE_OPENAI_ENDPOINT': JSON.stringify("https://variance-report.openai.azure.com/"),
      'import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT': JSON.stringify("gpt-4")
>>>>>>> 81130407de8e86cbad77f3d2441f4b060384ed6a
    }
  }
})
