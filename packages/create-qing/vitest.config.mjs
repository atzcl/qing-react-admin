import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['templates/**', 'tests/**'],
      include: ['bin/**/*.mjs', 'src/**/*.mjs'],
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        branches: 52,
        functions: 68,
        lines: 70,
        statements: 68,
      },
    },
  },
})
