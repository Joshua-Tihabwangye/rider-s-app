import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false, // Don't auto-open browser
    host: true, // Allow external connections
    strictPort: false, // Try next available port if 3000 is busy
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === '1',
      interval: 300,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/build/**',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/baseline-screenshots/**',
        '**/rider (1)/**',
      ],
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Increase limit for large apps
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
  },
  // Public directory for static assets
  publicDir: 'public',
});
