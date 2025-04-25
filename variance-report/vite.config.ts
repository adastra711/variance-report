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
      // Expose Azure OpenAI environment variables to the client
      'import.meta.env.VITE_AZURE_OPENAI_API_KEY': JSON.stringify(env.VITE_AZURE_OPENAI_API_KEY),
      'import.meta.env.VITE_AZURE_OPENAI_ENDPOINT': JSON.stringify(env.VITE_AZURE_OPENAI_ENDPOINT),
      'import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT': JSON.stringify(env.VITE_AZURE_OPENAI_DEPLOYMENT)
    }
  }
})
