import { defineConfig, devices } from '@playwright/test'

const TEST_REPORTS_DIR = process.env.TEST_REPORTS_DIR ?? 'tests/output/reports'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/output/results',
  globalSetup: './tests/e2e/globalSetup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // outputFile lives outside outputDir: outputDir gets cleared at
  // the start of every run, which would wipe this file before it's ever read
  reporter: process.env.CI
    ? [['list'], ['json', { outputFile: `${TEST_REPORTS_DIR}/e2e.json` }]]
    : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'VITE_COVERAGE=true npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
