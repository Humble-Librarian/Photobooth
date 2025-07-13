import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Vercel will serve from this directory
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Default Vite dev port
    strictPort: true,
  },
  preview: {
    port: 4173, // Default Vite preview port
    strictPort: true,
  },
}); 