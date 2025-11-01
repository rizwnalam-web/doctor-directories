import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://doctor-directories-server.onrender.com/api')
  }
})