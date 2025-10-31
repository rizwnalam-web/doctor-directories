import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://doctor-directories.onrender.com')
  }
})