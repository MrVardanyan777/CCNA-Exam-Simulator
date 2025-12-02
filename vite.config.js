import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      tailwindcss(),
      react()
  ],
  // Serve static assets from the actual folder name in this project
  // The folder appears to be misspelled as "pubilc"; this makes Vite serve files from there at "/{filename}"
  publicDir: 'pubilc',
})
