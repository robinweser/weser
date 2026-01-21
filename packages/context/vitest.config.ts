import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.test.{js,ts,tsx}'],
    environment: 'jsdom',
    globals: false,
    fileParallelism: true,
    maxConcurrency: 10,
    testTimeout: 10000,
  },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
  },
})

