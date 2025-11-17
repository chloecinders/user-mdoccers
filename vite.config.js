import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src-js/main.js',
      name: 'discord_mdoccers',
      fileName: 'bundle',
      formats: ['iife'],
    },
    outDir: 'dist/js',
    sourcemap: false
  }
});
