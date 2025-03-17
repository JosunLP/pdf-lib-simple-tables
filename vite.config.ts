import { defineConfig } from 'vite';
import { resolve } from 'path';

// Additional plugins can be imported here, e.g.:
// import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // Library settings
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PdfjsTableLib',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => `index.${format}.js`,
    },
    outDir: 'dist',
  },

  // Resolve module paths with aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Add plugins if needed
  plugins: [
    // Example: Include Vue plugin
    // vue()
  ],

  // Local development server settings
  server: {
    port: 3000,
    open: true,
  },
});
