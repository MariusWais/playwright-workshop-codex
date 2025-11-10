# Playwright Workshop - Quick Reference Cheatsheet

## Installation & Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Start demo app
npm start                           # Dev server on port 4222

# Verify app is running
open http://localhost:4222
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test my-test.spec.ts

# Run tests matching pattern
npx playwright test create-policy

# Run with visible browser
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run in UI mode (interactive)
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in watch mode
npx playwright test --watch

# Run with specific number of workers
npx playwright test --workers=1     # Serial execution
npx playwright test --workers=4     # 4 parallel workers
```

---

## Test Reports & Debugging

```bash
# View HTML report
npx playwright show-report

# View trace file
npx playwright show-trace test-results/[test-name]/trace.zip

# Open last trace
npx playwright show-trace trace.zip

# Generate report after test run
npx playwright test --reporter=html
```

---

## Code Generation

```bash
# Record actions and generate test code
npx playwright codegen localhost:4222

# Generate code for specific browser
npx playwright codegen --browser=firefox localhost:4222

# Save generated code to file
npx playwright codegen --target javascript -o my-test.spec.js localhost:4222
```

---

## AI Agents (Copilot Chat)

### Planner Agent
```
@planner Generate a test plan for the policy app

@planner Create test plan focusing on form validation

@planner Explore the app and document edge cases
```

### Generator Agent
```
@generator Generate test for scenario #2

@generator Create test for "Create New Policy - Happy Path"

@generator Generate test using only data-testid selectors
```

### Healer Agent
```
@healer Fix the create-policy test

@healer Fix all failing tests

@healer Fix timing issues without using waitForTimeout
```

---

## Common Test Patterns

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/');
    
    // Interact
    await page.getByTestId('button').click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Using Fixtures

```typescript
test('with fixture', async ({ page, policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.addPolicy({
    policyNumber: 'POL-001',
    customerName: 'John Doe',
    premium: 1500
  });
});
```

### Setup and Teardown

```typescript
test.beforeEach(async ({ page }) => {
  // Run before each test
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test.afterEach(async ({ page }) => {
  // Run after each test
  await page.screenshot({ path: 'screenshot.png' });
});
```

---

## Selectors (Priority Order)

```typescript
// 1. ✅ Best - data-testid
await page.getByTestId('submit-button').click();

// 2. ✅ Good - Role-based (accessibility)
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');

// 3. ⚠️ OK - Text content
await page.getByText('John Smith').click();
await page.getByLabel('Email').fill('test@example.com');

// 4. ❌ Avoid - CSS selectors
await page.locator('.btn-primary').click();
await page.locator('#submit').click();
```

---

## Actions

```typescript
// Click
await page.getByTestId('button').click();

// Double click
await page.getByTestId('button').dblclick();

// Right click
await page.getByTestId('button').click({ button: 'right' });

// Fill input
await page.getByTestId('input').fill('text');

// Clear and fill
await page.getByTestId('input').clear();
await page.getByTestId('input').fill('new text');

// Type (character by character)
await page.getByTestId('input').type('slow typing');

// Press key
await page.keyboard.press('Enter');
await page.keyboard.press('Control+A');

// Select dropdown option
await page.getByTestId('dropdown').selectOption('value');

// Check/uncheck
await page.getByTestId('checkbox').check();
await page.getByTestId('checkbox').uncheck();

// Upload file
await page.getByTestId('file-input').setInputFiles('path/to/file.pdf');

// Hover
await page.getByTestId('menu').hover();
```

---

## Assertions

```typescript
// Element visibility
await expect(page.getByTestId('element')).toBeVisible();
await expect(page.getByTestId('element')).toBeHidden();
await expect(page.getByTestId('element')).not.toBeVisible();

// Element state
await expect(page.getByTestId('button')).toBeEnabled();
await expect(page.getByTestId('button')).toBeDisabled();
await expect(page.getByTestId('checkbox')).toBeChecked();

// Text content
await expect(page.getByTestId('title')).toHaveText('Welcome');
await expect(page.getByTestId('title')).toContainText('Wel');
await expect(page.getByTestId('count')).toHaveText(/\d+ items/);

// Value
await expect(page.getByTestId('input')).toHaveValue('John');

// Attribute
await expect(page.getByTestId('link')).toHaveAttribute('href', '/page');

// Count
await expect(page.getByTestId('list-item')).toHaveCount(5);

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/dashboard\?id=\d+/);

// Title
await expect(page).toHaveTitle('My App');
await expect(page).toHaveTitle(/Insurance/);
```

---

## Waiting

```typescript
// Wait for element
await page.getByTestId('element').waitFor();
await page.getByTestId('element').waitFor({ state: 'visible' });
await page.getByTestId('element').waitFor({ state: 'hidden' });

// Wait for navigation
await page.waitForURL('/dashboard');
await page.waitForURL(/\/policies\/\d+/);

// Wait for load state
await page.waitForLoadState('load');
await page.waitForLoadState('domcontentloaded');
await page.waitForLoadState('networkidle');

// Wait for response
await page.waitForResponse(response => 
  response.url().includes('/api/users') && response.status() === 200
);

// Wait for selector
await page.waitForSelector('[data-testid="element"]');

// Wait for timeout (avoid if possible!)
await page.waitForTimeout(1000);  // Only as last resort
```

---

## Navigation

```typescript
// Go to URL
await page.goto('/');
await page.goto('http://localhost:4222/policies');

// Go back
await page.goBack();

// Go forward
await page.goForward();

// Reload
await page.reload();
```

---

## Browser Context

```typescript
// Get cookies
const cookies = await context.cookies();

// Set cookies
await context.addCookies([
  { name: 'session', value: 'abc123', url: 'http://localhost:4222' }
]);

// Clear cookies
await context.clearCookies();

// Local storage
await page.evaluate(() => localStorage.setItem('key', 'value'));
await page.evaluate(() => localStorage.clear());

// Save storage state (auth)
await context.storageState({ path: 'auth.json' });

// Load storage state
const context = await browser.newContext({ storageState: 'auth.json' });
```

---

## Screenshots & Videos

```typescript
// Take screenshot
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// Screenshot of element
await page.getByTestId('element').screenshot({ path: 'element.png' });

// Video recording (configure in playwright.config.ts)
use: {
  video: 'on',  // or 'retain-on-failure'
}
```

---

## Multiple Elements

```typescript
// Get all matching elements
const items = page.getByTestId('list-item');

// Count
const count = await items.count();

// Iterate
for (let i = 0; i < await items.count(); i++) {
  await items.nth(i).click();
}

// Get specific element
await items.first().click();
await items.last().click();
await items.nth(2).click();

// Filter
const activeItems = items.filter({ hasText: 'Active' });
```

---

## Configuration (playwright.config.ts)

```typescript
export default defineConfig({
  // Test directory
  testDir: './e2e/tests-examples',
  
  // Timeout per test
  timeout: 30000,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Parallel workers
  workers: process.env.CI ? 1 : 4,
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'results.xml' }]
  ],
  
  use: {
    // Base URL
    baseURL: 'http://localhost:4222',
    
    // Screenshots
    screenshot: 'only-on-failure',
    
    // Video
    video: 'retain-on-failure',
    
    // Trace
    trace: 'retain-on-failure',
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Timeout for actions
    actionTimeout: 10000,
  },
  
  // Dev server
  webServer: {
    command: 'npm start',
    port: 4222,
    reuseExistingServer: true,
  },
});
```

---

## Best Practices Checklist

### Selectors
- [ ] Use `data-testid` attributes
- [ ] Prefer `getByRole` for accessibility
- [ ] Avoid CSS selectors when possible
- [ ] Don't use brittle selectors like nth-child

### Waiting
- [ ] Let Playwright auto-wait
- [ ] Use `waitForLoadState` for navigation
- [ ] Avoid `waitForTimeout` (use sparingly)
- [ ] Wait for specific conditions, not arbitrary time

### Test Structure
- [ ] One test = one behavior
- [ ] Descriptive test names
- [ ] Tests are independent (any order)
- [ ] Use fixtures for common setup
- [ ] Clear state between tests

### Assertions
- [ ] Be specific (check actual content)
- [ ] Multiple assertions for complex state
- [ ] Use `.not` for negative assertions
- [ ] Verify both presence and absence

### Maintenance
- [ ] Use Page Objects or Fixtures
- [ ] DRY - Don't Repeat Yourself
- [ ] Keep tests focused and simple
- [ ] Review and refactor regularly

---

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:4222 | xargs kill -9
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reinstall Browsers
```bash
npx playwright install --force
```

### Debug Failing Test
```bash
npx playwright test --debug failing-test.spec.ts
```

### View Last Trace
```bash
npx playwright show-trace trace.zip
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Useful Links

- **Playwright Docs**: https://playwright.dev
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **Discord**: https://aka.ms/playwright/discord
- **GitHub**: https://github.com/microsoft/playwright
- **Best Practices**: See `04-test-writing-guide.md`

---

## Workshop-Specific

### File Structure
```
e2e/
├── fixtures.ts          # Custom fixtures
└── tests-examples/      # Test files
    ├── seed.spec.ts     # Setup test
    └── *.spec.ts        # Your tests
```

### Custom Fixture Usage
```typescript
import { test, expect } from '../fixtures';

test('use fixture', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.addPolicy({ /* data */ });
});
```

### Demo App URLs
- List: http://localhost:4222/policies
- New: http://localhost:4222/policies/new
- Edit: http://localhost:4222/policies/:id/edit

---

**Quick Start**: `npm install && npx playwright install && npm start && npx playwright test`

**Need Help?** Check the full docs in `/docs` folder or ask in workshop chat!
