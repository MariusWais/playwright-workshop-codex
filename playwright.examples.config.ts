import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:4222';

export default defineConfig({
  testDir: './e2e/examples',
  reporter: [['html']],
  expect: { timeout: 1000 },
  use: {
    baseURL: baseURL,
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npm start',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
