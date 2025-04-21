import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
        }
    }
});
