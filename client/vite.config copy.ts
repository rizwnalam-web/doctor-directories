import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.error('Proxy Error:', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({
                message: 'Server unavailable. Please try again.',
                error: err.message
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            const { method, url } = req;
            console.log(`[Proxy] ${method} ${url} -> ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const { statusCode } = proxyRes;
            const { method, url } = req;
            console.log(`[Proxy] ${method} ${url} <- ${statusCode}`);
          });
        },
      },
    },
  },
});
