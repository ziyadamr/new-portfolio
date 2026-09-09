import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/new-portfolio/', // 👈 اكتب هنا نفس اسم الريبو على GitHub بالمللي بين سلاشين
})
