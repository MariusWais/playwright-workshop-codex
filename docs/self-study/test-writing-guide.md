# Test Writing Best Practices

> **For deep-dive learning after the workshop**

## Introduction

Writing maintainable, reliable Playwright tests is an art. This guide distills years of experience into actionable practices that will make your test suite robust, fast, and easy to maintain.

---

## Selector Strategy

### Priority Order

Use selectors in this order of preference:

1. **`data-testid` attributes** (Most stable, use always if possible)
2. **Role-based selectors** (Accessibility-friendly but can be too unprecise)
3. **Text content** (For unique text, bad with multi language support)
4. **CSS selectors** (Last resort)

### 1. data-testid Attributes (Preferred)

**Why**: Immune to styling changes, clear intent, stable

```typescript
// Best - Centralized selector constants
import { SELECTORS } from './constants/selectors';
await page.getByTestId(SELECTORS.SUBMIT_BUTTON).click();
await page.getByTestId(SELECTORS.EMAIL_INPUT).fill('user@example.com');
await page.getByTestId(SELECTORS.ERROR_MESSAGE).isVisible();

// Good - Direct test identifier
await page.getByTestId('submit-button').click();
await page.getByTestId('email-input').fill('user@example.com');
await page.getByTestId('error-message').isVisible();
```

**Centralize selectors** (recommended):
```typescript
// constants/selectors.ts
export const SELECTORS = {
  SUBMIT_BUTTON: 'submit-button',
  EMAIL_INPUT: 'email-input',
  ERROR_MESSAGE: 'error-message',
  editButton: (id: number) => `edit-${id}`,
  deleteButton: (id: number) => `delete-${id}`,
};
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
- Single source of truth for all selectors
- Easy to find and update selectors
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
await page.waitForLoadState('networkidle'); // Wait for all network requests
await page.waitForLoadState('domcontentloaded'); // Wait for DOM ready
await page.waitForURL('/dashboard'); // Wait for URL change

// Wait for specific network requests
await page.waitForResponse(response => response.url().includes('/api/policies'));
const response = await page.waitForResponse('**/api/policies');

// Wait for network request to complete before action
await Promise.all([
  page.waitForResponse('**/api/policies'),
  page.getByTestId('add-policy').click()
]);

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

### Group Related Tests with "describe"

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
import { test as base } from '@playwright/test';
import { SELECTORS } from './constants/selectors';

export const test = base.extend({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
      },
      async addPolicy(data) {
        await page.getByTestId(SELECTORS.ADD_POLICY_BUTTON).click();
        await page.getByTestId(SELECTORS.POLICY_NUMBER).fill(data.policyNumber);
        await page.getByTestId(SELECTORS.CUSTOMER_NAME).fill(data.customerName);
        await page.getByTestId(SELECTORS.SAVE_BUTTON).click();
      }
    };
    await use(policiesPage);
  }
});

export { expect } from '@playwright/test';

// Usage in test
import { test, expect } from './fixtures';
import { SELECTORS } from './constants/selectors';

test('create policy', async ({ page, policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.addPolicy({
    policyNumber: 'POL-001',
    customerName: 'John Smith'
  });
  await expect(page.getByTestId(SELECTORS.POLICY_NUMBER)).toBeVisible();
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
