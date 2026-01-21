import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.{js,ts}'],
    globals: false,
    testTimeout: 10000,
  },
  esbuild: {
    target: 'esnext',
  },
})

