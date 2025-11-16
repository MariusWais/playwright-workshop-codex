# Test Writing Best Practices

> **For deep-dive learning after the workshop**

## Introduction

Writing maintainable, reliable Playwright tests is an art. This guide distills years of experience into actionable practices that will make your test suite robust, fast, and easy to maintain.

---

## Selector Strategy

### Priority Order

Use selectors in this order of preference:

1. **`data-testid` attributes** (Most stable)
2. **Role-based selectors** (Accessibility-friendly)
3. **Text content** (For unique text)
4. **CSS selectors** (Last resort)

### 1. data-testid Attributes (Preferred)

**Why**: Immune to styling changes, clear intent, stable

```typescript
// Good - Explicit test identifier
await page.getByTestId('submit-button').click();
await page.getByTestId('email-input').fill('user@example.com');
await page.getByTestId('error-message').isVisible();
```

**Add to your HTML**:
```html
<button data-testid="submit-button">Submit</button>
<input data-testid="email-input" type="email" />
<div data-testid="error-message">Error!</div>
```

**Benefits**:
- Tests don't break when CSS classes change
- Clear intention for testing
- Easy to find in code reviews
- AI agents prefer these selectors

### 2. Role-Based Selectors

**Why**: Accessibility-first, semantic, user-focused

```typescript
// Good - Semantic and accessible
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
await page.getByRole('heading', { name: 'Welcome' }).isVisible();
```

### 3. Text Content Selectors

```typescript
// Good - For unique text
await page.getByText('No policies yet').isVisible();
await page.getByText(/Policy.*created/i).isVisible(); // Regex
```

### 4. CSS Selectors (Avoid)

```typescript
// Bad - Breaks when CSS changes
await page.locator('.btn-primary.btn-lg').click();
```

---

## Auto-Waiting vs Manual Waiting

Playwright automatically waits for elements before actions. Use manual waits only when needed:

```typescript
// Auto-waiting (preferred)
await page.getByTestId('button').click(); // Waits for clickable

// Manual waits - only when needed
await page.waitForLoadState('networkidle');
await page.waitForURL('/dashboard');

// Avoid - arbitrary waits
await page.waitForTimeout(5000); // Why 5 seconds?
```

---

## Test Structure

### One Test, One Behavior

```typescript
// Good - Focused tests
test('should create a new policy', async ({ page }) => {
  // Test only one behavior
});

test('should display error for missing fields', async ({ page }) => {
  // Test only validation
});
```

### Use Descriptive Test Names

```typescript
// Good - Clear, specific names
test('should display error when logging in with invalid credentials', async ({ page }) => {
  // ...
});
```

### Group Related Tests

```typescript
test.describe('Policy CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/policies');
  });
  
  test('should create a new policy', async ({ page }) => { });
  test('should edit an existing policy', async ({ page }) => { });
  test('should delete a policy', async ({ page }) => { });
});
```

---

## Fixtures and Page Objects

### Using Fixtures (Recommended)

```typescript
// fixtures.ts
export const test = base.extend({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
      },
      async createPolicy(data) {
        // Implementation
      }
    };
    await use(policiesPage);
  }
});

// Usage in test
test('create policy', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.createPolicy(data);
});
```

---

## Assertions Best Practices

### Be Specific

```typescript
// Good - Validates actual content
await expect(page.getByTestId('error')).toHaveText('Email is required');

// Bad - Too generic
await expect(page.locator('div')).toBeVisible();
```

---

## Common Anti-Patterns

- Hardcoded waits (`waitForTimeout`)
- Testing implementation details
- Not using Page Objects or Fixtures
- Tests that aren't independent
- Brittle CSS selectors

---

**See Also**: `06-debugging-flaky-tests.md` for fixing unreliable tests
