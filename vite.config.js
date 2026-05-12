import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Use modern JS syntax for faster browser parsing
    minify: 'esbuild', // Extremely fast minification
    cssCodeSplit: true, // Load CSS only when needed
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          threed: ['three', '@react-three/fiber', '@react-three/drei'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'], // Automatically removes all console.logs and debuggers in production without having to delete them from code
  }
})
