import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000', // Use .env variable
        changeOrigin: true,
        rewrite: path => path.replace(/^\/uploads/, ''), // Removes /uploads prefix
      },
    },
  },
});
