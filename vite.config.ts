import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        // Enable code splitting
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks for better caching
              'react-vendor': ['react', 'react-dom'],
              'framer-motion': ['framer-motion'],
              'charts': ['recharts', 'd3-scale', 'd3-shape', 'd3-array'],
              'ui-components': [
                '@radix-ui/react-dialog',
                '@radix-ui/react-label',
                '@radix-ui/react-select',
                '@radix-ui/react-slot',
              ],
              'form-validation': ['react-hook-form', '@hookform/resolvers', 'zod'],
              'icons': ['lucide-react'],
            },
          },
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 600,
        // Enable minification
        minify: 'esbuild',
        // Source maps for production debugging (optional, can be disabled for smaller builds)
        sourcemap: false,
      },
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'framer-motion',
          'lucide-react',
          '@radix-ui/react-dialog',
          '@radix-ui/react-label',
          '@radix-ui/react-select',
          '@radix-ui/react-slot',
        ],
      },
    };
});
