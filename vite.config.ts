/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/__tests__/setupTest.ts',
    coverage: {
      provider: 'v8',
    },
  },
})
