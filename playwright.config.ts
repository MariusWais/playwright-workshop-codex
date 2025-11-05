import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests-examples',
  use: {
    baseURL: 'http://localhost:4222',
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4222',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
