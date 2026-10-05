import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // About 100 browser tests share one production server; on a 4-core machine the longer ones need more
  // than the default 30 seconds.
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // Test-only pages (src/app/(dev)/fixtures) exist only in builds made with this flag, never on Vercel.
    env: { ...(process.env as Record<string, string>), PCL_FIXTURES: '1' },
  },
})
