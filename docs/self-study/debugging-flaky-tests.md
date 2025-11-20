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

**Full guide**: See `/docs/deep-dive/debugging-flaky-tests.md`
