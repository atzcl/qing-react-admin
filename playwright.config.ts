import { defineConfig } from '@playwright/test'

export default defineConfig({
  expect: { timeout: 10_000 },
  fullyParallel: false,
  outputDir: '.playwright/test-results',
  reporter: [['list']],
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5192',
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { height: 900, width: 1440 },
  },
  webServer: {
    command: 'apps/web-admin/node_modules/.bin/vite apps/web-admin --host 127.0.0.1 --port 5192',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: 'http://127.0.0.1:5192/auth/login',
  },
})
