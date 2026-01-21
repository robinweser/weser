import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.test.{js,ts}'],
    globals: false,
    fileParallelism: true,
    maxConcurrency: 10,
    testTimeout: 10000,
  },
  esbuild: {
    target: 'esnext',
  },
})

