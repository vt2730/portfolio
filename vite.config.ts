import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://vt2730.github.io/portfolio/ (GitHub Pages project site).
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
})
