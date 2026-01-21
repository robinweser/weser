import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.{js,ts}'],
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
  },
})

