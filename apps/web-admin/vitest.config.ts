import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react({
      compiler: {
        eslintSuppressionRules: ['react-hooks/exhaustive-deps', 'react-hooks/rules-of-hooks'],
        sources: ['/apps/web-admin/src/'],
        target: '19',
      },
    }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    coverage: {
      exclude: ['src/**/*.test.{ts,tsx}', 'src/routeTree.gen.ts', 'src/test/**'],
      include: [
        'src/components/charts.tsx',
        'src/core/auth.ts',
        'src/core/i18n.ts',
        'src/core/persisted-storage.ts',
        'src/core/preferences.ts',
        'src/core/tab-model.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    environment: 'happy-dom',
    exclude: ['../../tests/e2e/**', '../../packages/**', '**/node_modules/**'],
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
