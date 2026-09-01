import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'spa',
  define: {
    QING_ADMIN_BUILD_TIME: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      target: 'react',
    }),
    react({
      compiler: {
        eslintSuppressionRules: ['react-hooks/exhaustive-deps', 'react-hooks/rules-of-hooks'],
        sources: ['/apps/web-admin/src/'],
        target: '19',
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
