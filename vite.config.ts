import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ตั้งค่าคอนฟิกปลดล็อกโฮสต์เพื่อให้รันบน Render ได้อย่างสมบูรณ์แบบ
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  preview: {
    allowedHosts: ['dragy-domains.onrender.com']
  }
})
