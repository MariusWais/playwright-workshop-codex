# Flaky Tests and Common Pitfalls

## Introduction

Flaky tests - tests that sometimes pass and sometimes fail without code changes - are the bane of test automation. This guide covers the most common causes of flakiness in Playwright tests and how to fix them, based on real-world experience.

---

## What Makes Tests Flaky?

Flaky tests usually fail due to:
1. **Timing issues** - Race conditions, async operations
2. **Unstable selectors** - Elements that change or move
3. **Test interdependence** - Tests affecting each other's state
4. **External dependencies** - APIs, databases, third-party services
5. **Browser/environment differences** - Different behavior across browsers or CI

---

## Timing Issues

### Problem 1: Race Conditions

**Symptom**: Test sometimes fails with "element not found" or "element not clickable"

```typescript
// ❌ Bad - Race condition
test('submit form', async ({ page }) => {
  await page.goto('/form');
  await page.click('#submit'); // Might click before form loads
  await expect(page.locator('.success')).toBeVisible();
});
```

**Fix**: Use Playwright's auto-waiting

```typescript
// ✅ Good - Proper waiting
test('submit form', async ({ page }) => {
  await page.goto('/form');
  await page.waitForLoadState('networkidle'); // Wait for page to finish loading
  
  // Playwright automatically waits for element to be clickable
  await page.getByTestId('submit').click();
  
  // Playwright waits for element to be visible (up to 5s default)
  await expect(page.getByTestId('success-message')).toBeVisible();
});
```

### Problem 2: Animations

**Symptom**: Element is found but interaction fails because it's still animating

```typescript
// ❌ Bad - Clicking during animation
test('open modal', async ({ page }) => {
  await page.click('#open-modal');
  await page.click('#modal-button'); // Fails if modal is still animating in
});
```

**Fix**: Wait for stable state

```typescript
// ✅ Good - Wait for animation to complete
test('open modal', async ({ page }) => {
  await page.getByTestId('open-modal').click();
  
  // Wait for modal to be fully visible and stable
  const modal = page.getByTestId('modal');
  await modal.waitFor({ state: 'visible' });
  
  // Wait a tiny bit for animation (if necessary)
  await page.waitForTimeout(100); // Minimal wait
  
  // Or better - check if element is stable
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId('modal-button')).toBeEnabled();
  
  await modal.getByTestId('modal-button').click();
});
```

**Best fix**: Disable animations in tests

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Disable CSS animations and transitions
    actionTimeout: 10000,
  },
});

// In your app's test mode
// Add this CSS:
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

### Problem 3: Network Requests

**Symptom**: Test fails because data hasn't loaded yet

```typescript
// ❌ Bad - Checking before data loads
test('display user list', async ({ page }) => {
  await page.goto('/users');
  await expect(page.getByText('John Doe')).toBeVisible(); // Fails if API is slow
});
```

**Fix**: Wait for network to settle

```typescript
// ✅ Good - Wait for data to load
test('display user list', async ({ page }) => {
  await page.goto('/users');
  
  // Wait for network requests to complete
  await page.waitForLoadState('networkidle');
  
  // Or wait for specific API response
  await page.waitForResponse(response => 
    response.url().includes('/api/users') && response.status() === 200
  );
  
  await expect(page.getByText('John Doe')).toBeVisible();
});

// ✅ Better - Wait for loading indicator to disappear
test('display user list', async ({ page }) => {
  await page.goto('/users');
  
  // Wait for spinner to disappear
  await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
  
  await expect(page.getByText('John Doe')).toBeVisible();
});
```

### Problem 4: Form Auto-fill/Auto-complete

**Symptom**: Form values are overwritten by browser auto-fill or app logic

```typescript
// ❌ Bad - Browser auto-fill interferes
test('fill form', async ({ page }) => {
  await page.goto('/form');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('#submit');
  // Sometimes fails because browser auto-filled different values
});
```

**Fix**: Use autocomplete="off" or clear fields first

```typescript
// ✅ Good - Ensure clean state
test('fill form', async ({ page }) => {
  await page.goto('/form');
  
  // Clear any auto-filled values
  await page.getByTestId('email').clear();
  await page.getByTestId('email').fill('test@example.com');
  
  await page.getByTestId('password').clear();
  await page.getByTestId('password').fill('password123');
  
  await page.getByTestId('submit').click();
});

// ✅ Better - Disable auto-complete in test environment
// <input data-testid="email" autocomplete="off" />
```

---

## Unstable Selectors

### Problem 5: Dynamic CSS Classes

**Symptom**: Test breaks when styling changes

```typescript
// ❌ Bad - CSS classes change frequently
await page.click('.btn-primary.rounded-lg.px-4');
await page.locator('.MuiButton-root.MuiButton-primary').click();
```

**Fix**: Use stable selectors

```typescript
// ✅ Good - data-testid never changes
await page.getByTestId('submit-button').click();

// ✅ Good - Role-based selectors
await page.getByRole('button', { name: 'Submit' }).click();
```

### Problem 6: Generated IDs

**Symptom**: Element IDs contain random strings

```typescript
// ❌ Bad - ID changes on every render
await page.click('#button-a3f5c9d2');
await page.click('#modal-e8b1a7f4');
```

**Fix**: Use stable attributes

```typescript
// ✅ Good - Add stable test IDs
<button data-testid="submit-button" id="button-a3f5c9d2">
  Submit
</button>

await page.getByTestId('submit-button').click();
```

### Problem 7: Dynamic Lists and Tables

**Symptom**: Row order changes, breaking index-based selectors

```typescript
// ❌ Bad - Relies on specific order
await page.locator('table tr').nth(2).click(); // Which row is this?
```

**Fix**: Select by content or unique identifier

```typescript
// ✅ Good - Select by content
await page.locator('tr', { hasText: 'John Doe' }).click();

// ✅ Better - Use unique test IDs
await page.getByTestId('user-row-123').click();

// Generate IDs based on data:
<tr data-testid={`user-row-${user.id}`}>
```

---

## Test Interdependence

### Problem 8: Shared State

**Symptom**: Tests pass individually but fail when run together

```typescript
// ❌ Bad - Tests share and modify global state
test('create user', async ({ page }) => {
  await createUser({ email: 'test@example.com' });
});

test('login as user', async ({ page }) => {
  // Assumes user from previous test exists
  await login('test@example.com', 'password');
});
```

**Fix**: Make tests independent

```typescript
// ✅ Good - Each test sets up its own data
test('create user', async ({ page }) => {
  const testEmail = `test-${Date.now()}@example.com`;
  await createUser({ email: testEmail });
  await expect(page.getByText(testEmail)).toBeVisible();
});

test('login as user', async ({ page }) => {
  // Create user specifically for this test
  const testUser = await createTestUser();
  await login(testUser.email, testUser.password);
  await expect(page).toHaveURL('/dashboard');
});
```

### Problem 9: Test Order Dependency

**Symptom**: Tests fail when run in different order

```typescript
// ❌ Bad - Test order matters
test.describe('User Flow', () => {
  test('1. sign up', async ({ page }) => { /* creates account */ });
  test('2. verify email', async ({ page }) => { /* verifies account from test 1 */ });
  test('3. complete profile', async ({ page }) => { /* updates account from test 1 */ });
});
```

**Fix**: Use fixtures or beforeEach hooks

```typescript
// ✅ Good - Each test is independent
test.describe('User Flow', () => {
  let testUser;
  
  test.beforeEach(async ({ page }) => {
    // Create fresh user for each test
    testUser = await createTestUser();
  });
  
  test('should allow user to sign up', async ({ page }) => {
    // Test signup in isolation
  });
  
  test('should allow user to verify email', async ({ page }) => {
    // Setup: user already created and needs to verify
    await setupUserPendingVerification();
    // Test: verification flow
  });
});
```

### Problem 10: localStorage/Cookie Pollution

**Symptom**: Previous test's auth state affects current test

```typescript
// ❌ Bad - Auth state persists between tests
test('requires login', async ({ page }) => {
  await page.goto('/protected');
  // Sometimes passes if previous test logged in
});
```

**Fix**: Clear state between tests

```typescript
// ✅ Good - Clear state before each test
test.describe('Protected Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all browser state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  });
  
  test('requires login', async ({ page }) => {
    await page.goto('/protected');
    await expect(page).toHaveURL('/login');
  });
});

// ✅ Better - Use Playwright's built-in storage state isolation
// playwright.config.ts
export default defineConfig({
  use: {
    storageState: undefined, // Start with clean state
  },
});
```

---

## External Dependencies

### Problem 11: API Rate Limiting

**Symptom**: Tests fail in CI when running many times

```typescript
// ❌ Bad - Hits real API
test('fetch user data', async ({ page }) => {
  await page.goto('/dashboard');
  // Calls real API - might get rate limited
});
```

**Fix**: Mock API responses

```typescript
// ✅ Good - Mock the API
test('fetch user data', async ({ page }) => {
  // Intercept and mock the API call
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    });
  });
  
  await page.goto('/dashboard');
  await expect(page.getByText('John Doe')).toBeVisible();
});
```

### Problem 12: Third-Party Services

**Symptom**: Tests depend on external services being available

```typescript
// ❌ Bad - Depends on Stripe test API
test('process payment', async ({ page }) => {
  // Uses real Stripe test environment
  await fillPaymentForm();
  await submitPayment();
});
```

**Fix**: Use test mode or mocks

```typescript
// ✅ Good - Mock payment gateway
test('process payment', async ({ page }) => {
  // Mock Stripe API responses
  await page.route('**/api.stripe.com/**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, id: 'ch_test123' })
    });
  });
  
  await fillPaymentForm();
  await submitPayment();
  await expect(page.getByText('Payment successful')).toBeVisible();
});
```

---

## Browser and Environment Differences

### Problem 13: Browser-Specific Behavior

**Symptom**: Test passes in Chrome but fails in Firefox

```typescript
// ❌ Bad - Assumes Chrome-specific behavior
test('date picker', async ({ page }) => {
  await page.fill('input[type="date"]', '2024-01-01');
  // Different behavior in Firefox vs Chrome
});
```

**Fix**: Test in multiple browsers or use browser-agnostic approaches

```typescript
// ✅ Good - Test across browsers
test('date picker', async ({ page, browserName }) => {
  if (browserName === 'firefox') {
    // Firefox-specific approach
    await page.click('input[type="date"]');
    await page.keyboard.type('01/01/2024');
  } else {
    // Chrome/WebKit approach
    await page.fill('input[type="date"]', '2024-01-01');
  }
  
  await expect(page.getByTestId('selected-date')).toHaveText('2024-01-01');
});

// ✅ Better - Use custom date picker component with data-testid
// Avoid native date inputs in tests
```

### Problem 14: CI vs Local Environment

**Symptom**: Tests pass locally but fail in CI

**Common causes**:
- Different screen sizes
- Missing fonts/resources
- Faster/slower machines
- Different timezone

```typescript
// ✅ Good - Consistent configuration
// playwright.config.ts
export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 }, // Fixed size
    locale: 'en-US',
    timezoneId: 'America/New_York',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  
  // More retries in CI
  retries: process.env.CI ? 2 : 0,
  
  // Run serially in CI if tests share state
  workers: process.env.CI ? 1 : 4,
});
```

---

## Debugging Flaky Tests

### Strategy 1: Run Test Multiple Times

```bash
# Run test 10 times to catch intermittent failures
for i in {1..10}; do npx playwright test flaky.spec.ts; done

# Or use Playwright's repeat option
npx playwright test flaky.spec.ts --repeat-each=10
```

### Strategy 2: Enable Tracing

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on', // Always capture traces
    screenshot: 'on',
    video: 'on',
  },
});
```

View trace:
```bash
npx playwright show-trace trace.zip
```

### Strategy 3: Add Debug Logging

```typescript
test('flaky test', async ({ page }) => {
  console.log('Step 1: Navigate');
  await page.goto('/');
  
  console.log('Step 2: Check element');
  const element = page.getByTestId('button');
  console.log('Element visible?', await element.isVisible());
  
  console.log('Step 3: Click');
  await element.click();
});
```

### Strategy 4: Slow Motion

```typescript
// Run in slow motion to see what's happening
test.use({ slowMo: 1000 }); // 1 second between actions

test('debug test', async ({ page }) => {
  // ... test code
});
```

### Strategy 5: Headed Mode

```bash
# See the browser during test execution
npx playwright test --headed --workers=1
```

---

## Prevention Checklist

**Before Writing Tests:**
- [ ] Add `data-testid` to all interactive elements
- [ ] Ensure app has loading states (spinners, skeletons)
- [ ] Consider test mode with animations disabled
- [ ] Plan for test data isolation

**While Writing Tests:**
- [ ] Avoid arbitrary `waitForTimeout()`
- [ ] Use auto-waiting (getByTestId, expect)
- [ ] Don't rely on element order in lists
- [ ] Make tests independent (can run in any order)
- [ ] Clear state between tests

**When Tests Fail:**
- [ ] Check traces and screenshots
- [ ] Run locally in headed mode
- [ ] Run test 10 times to confirm flakiness
- [ ] Check if CI-specific (viewport, timing)
- [ ] Add explicit waits for async operations

**In CI:**
- [ ] Enable retries (2-3 for flaky tests)
- [ ] Capture traces on failure
- [ ] Run with workers=1 if tests share state
- [ ] Set consistent viewport and locale

---

## Real-World Example: Fixing a Flaky Test

**Initial flaky test**:
```typescript
test('submit form', async ({ page }) => {
  await page.goto('/form');
  await page.click('#submit');
  await expect(page.locator('.success')).toBeVisible();
});
```

**Failure modes**:
- Sometimes button isn't clickable yet
- Sometimes success message takes time to appear
- Sometimes form validation runs async

**Fixed version**:
```typescript
test('submit form', async ({ page }) => {
  // Step 1: Navigate and wait for page to load
  await page.goto('/form');
  await page.waitForLoadState('networkidle');
  
  // Step 2: Wait for form to be ready
  await expect(page.getByTestId('submit-button')).toBeEnabled();
  
  // Step 3: Submit form
  await page.getByTestId('submit-button').click();
  
  // Step 4: Wait for loading indicator to disappear
  await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
  
  // Step 5: Verify success message
  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByTestId('success-message')).toHaveText('Form submitted successfully');
});
```

**What changed**:
- ✅ Used `data-testid` instead of CSS selectors
- ✅ Added `waitForLoadState` for initial page load
- ✅ Verified button is enabled before clicking
- ✅ Waited for loading indicator to clear
- ✅ Specific assertion on success message text

---

## Conclusion

Flaky tests undermine confidence in your test suite. The root causes are usually:
- **Timing**: Add proper waits, use auto-waiting
- **Selectors**: Use stable `data-testid` attributes
- **State**: Isolate tests, clear state between runs
- **Environment**: Consistent configuration across local and CI

When you encounter flakiness:
1. Reproduce it multiple times
2. Enable tracing and screenshots
3. Run in headed mode to observe
4. Fix the root cause, don't just add retries
5. Verify fix by running 10+ times

A stable test suite is a valuable asset. Invest time in fixing flaky tests - it pays off exponentially.