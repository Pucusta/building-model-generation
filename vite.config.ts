import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  build: {
    outDir: 'dist',
  },

  server: {
    port: 3000,
  },

  plugins: [
    glsl({
      include: '**/*.glsl',
    }),
  ],
});