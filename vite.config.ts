import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',

  plugins: [
    react(),
    glsl({include: '**/*.glsl',})
  ],
})
