import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000', // Backend URL
        changeOrigin: true,
        rewrite: path => path.replace(/^\/uploads/, ''), // Removes /uploads prefix when forwarding to backend
      },
    },
  },
});
