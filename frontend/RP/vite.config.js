import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 8080,
  strictPort: true,
 },
 server: {
  port: 8080,
  strictPort: true,
  host: true,
  proxy: {
    // Change '/api' to your actual API path if needed
    '/': {
      target: 'http://54.91.180.108:8000',
      changeOrigin: true,
      secure: false,
    },
  },
 },
});
