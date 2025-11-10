# Test Writing Best Practices

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
// ✅ Good - Explicit test identifier
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
// ✅ Good - Semantic and accessible
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
await page.getByRole('heading', { name: 'Welcome' }).isVisible();
```

**Benefits**:
- Tests how users interact with your app
- Encourages accessible markup
- Clear and readable

**Limitations**:
- Can break if labels change
- Multiple elements with same role need disambiguation

### 3. Text Content Selectors

**Why**: User-centric, readable

```typescript
// ✅ Good - For unique text
await page.getByText('No policies yet').isVisible();
await page.getByText('John Smith').click();

// ⚠️ Be careful with dynamic text
await page.getByText(/Policy.*created/i).isVisible(); // Use regex for flexibility
```

**Avoid for**:
- Translated content (use testid instead)
- Dynamic text that changes frequently
- Non-unique text

### 4. CSS Selectors (Avoid)

**Why**: Brittle, breaks with styling changes

```typescript
// ❌ Bad - Breaks when CSS changes
await page.locator('.btn-primary.large').click();
await page.locator('#user-form > div:nth-child(2) input').fill('text');

// ✅ Better - Use ID if it's stable
await page.locator('#unique-element-id').click();
```

**Only use when**:
- No other option exists
- You control the IDs and they're stable
- Form inputs with stable `id` attributes

---

## Auto-Waiting vs Manual Waiting

### Playwright's Built-in Auto-Waiting

Playwright automatically waits for elements to be:
- Attached to DOM
- Visible
- Stable (not animating)
- Enabled (for actions)

```typescript
// ✅ Good - Auto-waits for element
await page.getByTestId('button').click(); // Waits for button to be clickable

// ✅ Good - Auto-waits for assertion
await expect(page.getByText('Success')).toBeVisible(); // Waits up to 5s
```

### When to Add Manual Waits

**Network-dependent operations**:
```typescript
// ✅ Good - Wait for API calls to complete
await page.getByTestId('submit').click();
await page.waitForLoadState('networkidle');
await expect(page.getByText('Data loaded')).toBeVisible();
```

**Navigation**:
```typescript
// ✅ Good - Explicit navigation wait
await page.getByRole('link', { name: 'Dashboard' }).click();
await page.waitForURL('/dashboard');
await expect(page).toHaveURL('/dashboard');
```

**Animations**:
```typescript
// ⚠️ Sometimes needed - Wait for animation
await page.getByTestId('modal-trigger').click();
await page.waitForTimeout(300); // Wait for modal animation
await page.getByTestId('modal-content').isVisible();

// ✅ Better - Wait for element to be stable
await page.getByTestId('modal-content').waitFor({ state: 'visible' });
```

### Anti-Patterns

```typescript
// ❌ Bad - Arbitrary waits
await page.waitForTimeout(5000); // Why 5 seconds?

// ✅ Good - Wait for specific condition
await page.waitForSelector('[data-testid="content"]');
// or
await expect(page.getByTestId('content')).toBeVisible();

// ❌ Bad - Polling in loop
for (let i = 0; i < 10; i++) {
  if (await page.isVisible('[data-testid="element"]')) break;
  await page.waitForTimeout(500);
}

// ✅ Good - Use built-in waiting
await page.getByTestId('element').waitFor({ timeout: 5000 });
```

---

## Test Structure and Organization

### One Test, One Behavior

```typescript
// ❌ Bad - Testing multiple things
test('user flows', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'password');
  await page.click('#submit');
  
  // Create item
  await page.click('#add-item');
  await page.fill('#name', 'Item 1');
  await page.click('#save');
  
  // Edit item
  await page.click('#edit-1');
  await page.fill('#name', 'Item 1 Updated');
  await page.click('#save');
});

// ✅ Good - Separate, focused tests
test.describe('User Management', () => {
  test('should allow user login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('user@test.com');
    await page.getByTestId('password').fill('password');
    await page.getByTestId('submit').click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
  
  test('should create a new item', async ({ page, authenticatedPage }) => {
    await page.getByTestId('add-item').click();
    await page.getByTestId('name').fill('Item 1');
    await page.getByTestId('save').click();
    
    await expect(page.getByText('Item 1')).toBeVisible();
  });
});
```

### Use Descriptive Test Names

```typescript
// ❌ Bad - Vague names
test('test login', async ({ page }) => { });
test('form validation', async ({ page }) => { });
test('test1', async ({ page }) => { });

// ✅ Good - Clear, specific names
test('should display error when logging in with invalid credentials', async ({ page }) => { });
test('should prevent form submission when required fields are empty', async ({ page }) => { });
test('should allow user to reset password via email link', async ({ page }) => { });
```

### Group Related Tests

```typescript
test.describe('Policy CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for all tests
    await page.goto('/policies');
  });
  
  test('should create a new policy', async ({ page }) => { });
  test('should edit an existing policy', async ({ page }) => { });
  test('should delete a policy with confirmation', async ({ page }) => { });
});

test.describe('Policy Validation', () => {
  test('should require policy number', async ({ page }) => { });
  test('should validate premium amount format', async ({ page }) => { });
  test('should prevent duplicate policy numbers', async ({ page }) => { });
});
```

---

## Fixtures and Page Objects

### Custom Fixtures (Recommended)

Fixtures encapsulate common workflows:

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

type PolicyFixtures = {
  policiesPage: {
    goto: () => Promise<void>;
    addPolicy: (data: PolicyData) => Promise<void>;
    deletePolicy: (id: string) => Promise<void>;
  };
};

export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
        await page.waitForLoadState('networkidle');
      },
      
      async addPolicy(data) {
        await page.getByTestId('add-policy').click();
        await page.getByTestId('policyNumber').fill(data.policyNumber);
        await page.getByTestId('customerName').fill(data.customerName);
        await page.getByTestId('save').click();
        await page.waitForURL('/policies');
      },
      
      async deletePolicy(id) {
        await page.getByTestId(`delete-${id}`).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
      }
    };
    
    await use(policiesPage);
  }
});

export { expect } from '@playwright/test';
```

**Usage**:
```typescript
import { test, expect } from './fixtures';

test('should create policy', async ({ page, policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.addPolicy({
    policyNumber: 'POL-001',
    customerName: 'John Doe'
  });
  
  await expect(page.getByText('POL-001')).toBeVisible();
});
```

### Page Object Model (Alternative)

```typescript
// pages/policies-page.ts
export class PoliciesPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/policies');
  }
  
  async addPolicy(data: PolicyData) {
    await this.page.getByTestId('add-policy').click();
    await this.page.getByTestId('policyNumber').fill(data.policyNumber);
    await this.page.getByTestId('save').click();
  }
}

// test.spec.ts
test('create policy', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.addPolicy({ policyNumber: 'POL-001' });
});
```

**Fixtures vs Page Objects**:
- ✅ Fixtures: Automatic setup/teardown, dependency injection
- ✅ Page Objects: Simple, OOP-style, easy to understand
- Both are valid - choose based on team preference

---

## Assertions Best Practices

### Be Specific

```typescript
// ❌ Bad - Too generic
await expect(page.locator('div')).toBeVisible();

// ✅ Good - Specific element
await expect(page.getByTestId('success-message')).toBeVisible();

// ❌ Bad - Doesn't validate content
await expect(page.getByTestId('error')).toBeVisible();

// ✅ Good - Validates actual error message
await expect(page.getByTestId('error')).toHaveText('Email is required');
```

### Multiple Assertions

```typescript
// ✅ Good - Multiple validations for complex state
test('should display policy details correctly', async ({ page }) => {
  const policyRow = page.getByTestId('policy-row-1');
  
  await expect(policyRow).toBeVisible();
  await expect(policyRow.getByTestId('policy-number')).toHaveText('POL-001');
  await expect(policyRow.getByTestId('customer-name')).toHaveText('John Smith');
  await expect(policyRow.getByTestId('premium')).toHaveText('$1,250.50');
});
```

### Negative Assertions

```typescript
// ✅ Good - Verify element is not present
await expect(page.getByTestId('error-message')).not.toBeVisible();
await expect(page.getByText('Loading...')).not.toBeAttached();

// ✅ Good - Verify button is disabled
await expect(page.getByTestId('submit')).toBeDisabled();
```

---

## Test Data Management

### Isolate Test Data

```typescript
// ✅ Good - Each test has own data
test('create policy', async ({ page }) => {
  const testData = {
    policyNumber: `POL-${Date.now()}`, // Unique
    customerName: 'Test User',
  };
  
  await createPolicy(testData);
  await expect(page.getByText(testData.policyNumber)).toBeVisible();
});
```

### Clear State Between Tests

```typescript
// ✅ Good - Seed test to reset state
test.describe('Policies', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });
  
  test('test 1', async ({ page }) => { });
  test('test 2', async ({ page }) => { });
});
```

### Use Fixtures for Setup

```typescript
// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.getByTestId('email').fill('test@example.com');
    await page.getByTestId('password').fill('password');
    await page.getByTestId('submit').click();
    await page.waitForURL('/dashboard');
    
    await use(page);
    
    // Cleanup after test
    await page.goto('/logout');
  }
});
```

---

## CI/CD Stability

### Run Tests in Parallel Safely

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : 4, // Serial in CI, parallel locally
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
});
```

### Handle Flaky Tests

```typescript
// ❌ Bad - Ignoring flakiness
test('flaky test', async ({ page }) => {
  await page.goto('/');
  await page.click('button'); // Sometimes fails
});

// ✅ Good - Fix the root cause
test('stable test', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('button').waitFor({ state: 'visible' });
  await page.getByTestId('button').click();
});

// ⚠️ Temporary - Mark as flaky while debugging
test.describe.configure({ retries: 3 });
test('investigating flakiness', async ({ page }) => {
  // ... test that occasionally fails
});
```

### Use test.fail() for Known Issues

```typescript
// ✅ Good - Document known failures
test('feature currently broken', async ({ page }) => {
  test.fail(); // Test is expected to fail
  // ... test code
});

test('works in Chrome but not Firefox', async ({ page, browserName }) => {
  test.fail(browserName === 'firefox', 'Bug #123 - Firefox support pending');
  // ... test code
});
```

---

## Common Anti-Patterns to Avoid

### 1. Hardcoded Waits

```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForLoadState('networkidle');
await expect(page.getByTestId('content')).toBeVisible();
```

### 2. Overly Complex Tests

```typescript
// ❌ Bad - Test does too much
test('complete user journey', async ({ page }) => {
  // 50 lines of test code testing 10 different things
});

// ✅ Good - Break into focused tests
test('step 1', async ({ page }) => { });
test('step 2', async ({ page }) => { });
```

### 3. Testing Implementation Details

```typescript
// ❌ Bad - Testing internal state
test('check component state', async ({ page }) => {
  const state = await page.evaluate(() => window.__app_state__);
  expect(state.user.loggedIn).toBe(true);
});

// ✅ Good - Test user-visible behavior
test('user sees dashboard after login', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### 4. Not Using Page Object or Fixtures

```typescript
// ❌ Bad - Repeated code
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.click('#login');
  // ... same 10 lines
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  await page.click('#login');
  // ... same 10 lines again
});

// ✅ Good - Reusable fixtures
test('test 1', async ({ authenticatedPage }) => {
  // Already logged in
});
```

---

## Quick Reference Checklist

**Before Writing Tests:**
- [ ] Add `data-testid` attributes to key elements
- [ ] Define fixtures for common workflows
- [ ] Plan test data strategy

**While Writing Tests:**
- [ ] Use specific selectors (`data-testid` or role-based)
- [ ] One test = one behavior
- [ ] Descriptive test names
- [ ] Avoid hardcoded waits
- [ ] Specific assertions

**Before Committing:**
- [ ] Tests pass locally
- [ ] Tests pass in headed mode (see animations)
- [ ] No arbitrary `waitForTimeout()`
- [ ] Clear test names and comments
- [ ] Tests are independent (can run in any order)

**In CI/CD:**
- [ ] Tests run with retries
- [ ] Screenshots on failure
- [ ] Trace files for debugging
- [ ] Serial execution if tests share state

---

## Conclusion

Great Playwright tests are:
- **Stable**: Use reliable selectors, proper waits
- **Fast**: Parallel execution, no arbitrary delays
- **Readable**: Clear names, good structure
- **Maintainable**: Fixtures/page objects, DRY principle
- **Focused**: One behavior per test

Follow these practices and your test suite will be a valuable asset, not a maintenance burden.