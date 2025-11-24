# Debugging Flaky Tests

> For later study - fixing unreliable tests

## What Makes Tests Flaky?

1. **Timing issues** - Race conditions, async operations
2. **Unstable selectors** - Elements that change or move
3. **Test interdependence** - Tests affecting each other's state
4. **External dependencies** - APIs, databases
5. **Environment differences** - CI vs local, browsers

---

## Common Fixes

### Timing Issues

```typescript
// Bad
test('submit form', async ({ page }) => {
  await page.click('#submit');
  await expect(page.locator('.success')).toBeVisible();
});

// Good
test('submit form', async ({ page }) => {
  await page.goto('/form');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('submit').click();
  await expect(page.getByTestId('success')).toBeVisible();
});
```

### Unstable Selectors

```typescript
// Bad - CSS changes break tests
await page.click('.btn-primary.large');

// Good - data-testid is stable
await page.getByTestId('submit-button').click();
```

### Test Independence

```typescript
// Bad - Tests depend on each other
test('create user', async ({ page }) => {
  await createUser({ email: 'test@example.com' });
});

test('login', async ({ page }) => {
  // Assumes previous test ran
  await login('test@example.com');
});

// Good - Each test is independent
test('create user', async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;
  await createUser({ email });
});

test('login', async ({ page }) => {
  const user = await createTestUser();
  await login(user.email);
});
```

### Clear State Between Tests

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});
```

### Test Slow Network with DevTools Throttling

To manually test your app under slow network conditions using browser DevTools:

**Chrome/Chromium DevTools:**
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Look for the throttling dropdown (usually shows "No throttling")
4. Select preset (Slow 3G, Fast 3G, etc.) or create custom throttling:
   - **Slow 3G**: ~400ms latency, ~400kb/s download
   - **Fast 3G**: ~150ms latency, ~1.6mb/s download
   - **4G**: ~4ms latency, ~4mb/s download
5. Reload the page to see how your app performs

**Custom Throttling:**
- Click dropdown → "Custom" to set your own values
- Adjust: Download speed (kb/s), Upload speed (kb/s), Latency (ms)
- Useful for testing edge cases: "5G", "Satellite", "Rural"

**Testing Flaky Behavior:**
```typescript
// In Playwright Debug Mode, open DevTools and throttle
npx playwright test --headed --debug

// Then throttle in DevTools while test runs to catch race conditions
// This simulates slow CI/CD pipeline networks
```

---

## Debugging Strategies

```bash
# Run test multiple times
npx playwright test --repeat-each=10 flaky.spec.ts

# See the browser
npx playwright test --headed --workers=1

# Step through
npx playwright test --debug

# View trace
npx playwright show-trace trace.zip
```

---
