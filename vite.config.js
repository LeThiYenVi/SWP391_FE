import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(() => ({
  base: './',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/services': resolve(__dirname, 'src/services'),
      '@/stores': resolve(__dirname, 'src/stores'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    // ✅ Tắt HMR WebSocket khi BE down để tránh spam console
    hmr: {
      port: 3001, // Dùng port khác để tránh conflict
      overlay: false, // Tắt error overlay
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('🚀 Sending Request to BE:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('✅ Response from BE:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('❌ WebSocket Proxy error:', err);
          });
          proxy.on('upgrade', (req, socket, head) => {
            console.log('🔌 WebSocket upgrade:', req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name].[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `img/[name].[hash].${ext}`;
          }
          return `assets/[name].[hash].${ext}`;
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'date-vendor': ['date-fns', 'react-calendar', 'react-datepicker'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'buffer', 'process'],
  },
}));
