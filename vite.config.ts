import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: process.env.VITE_CACHE_DIR || "/tmp/rider-vite-cache",
  plugins: [react()],
  server: {
    port: 5173,
    open: false, // Don't auto-open browser
    host: true, // Allow external connections
    strictPort: false, // Try next available port if 3000 is busy
    headers: {
      "X-Frame-Options": "DENY"
    },
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
    }
  },
  preview: {
    headers: {
      "X-Frame-Options": "DENY"
    },
  },
  build: {
    outDir: process.env.VITE_BUILD_OUT_DIR || 'build',
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
      '@': path.resolve(projectRoot, './src'),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
  },
  // Public directory for static assets
  publicDir: 'public',
});
