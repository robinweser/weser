import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.{js,ts}'],
    globals: false,
  },
  esbuild: {
    target: 'esnext',
  },
})

