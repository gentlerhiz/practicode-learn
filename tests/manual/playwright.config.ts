import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  workers: 2,
  use: { screenshot: 'only-on-failure', baseURL: process.env.PW_BASE ?? 'http://localhost:3200', ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
})
