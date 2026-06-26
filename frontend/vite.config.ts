import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const backendUrl = env.VITE_API_URL || 'http://127.0.0.1:8080'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 7433,  // 7070은 AnyDesk가 점유
      https: fs.existsSync('./server.cert') && fs.existsSync('./server.key')
        ? {
            cert: fs.readFileSync('./server.cert'),
            key: fs.readFileSync('./server.key'),
          }
        : undefined,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
