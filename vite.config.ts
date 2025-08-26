import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Check if the command was serve (npm run dev)
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/Hisorty', // /Hisorty for GH pages
    plugins: [
      vue(),
      vueDevTools(),
    ],
    build: {
      outDir: 'docs' // GH pages
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
