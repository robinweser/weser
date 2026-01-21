import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.test.{js,ts,tsx}'],
    environment: 'jsdom',
    globals: false,
    fileParallelism: true, // Run test files in parallel
    maxConcurrency: 10, // Tests within files run concurrently
    testTimeout: 10000,
  },
  esbuild: {
    target: 'esnext',
  },
})

