import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// =============================================
// Vite 配置（加了开发代理）
// 替换掉你原来的 vite.config.js
// =============================================

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 开发时把 /api 请求转发到后端，避免跨域
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 如果不需要保留 /api 前缀，打开这行：
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
