import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.test.{js,ts,tsx}'],
    environment: 'jsdom',
    globals: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
  },
})

