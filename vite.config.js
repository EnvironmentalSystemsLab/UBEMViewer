import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for GitHub Pages to resolve paths correctly
  build: {
    outDir: 'dist', // Confirm this matches your deploy script target directory
  }
});
