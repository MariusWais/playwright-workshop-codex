import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:4222';

export default defineConfig({
  testDir: './e2e/tests',
  reporter: [['html']],
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
