# Page Objects and Fixtures

> **For deep-dive learning after the workshop**

## Introduction

The Page Object Model (POM) is a design pattern that creates an object-oriented abstraction of your web pages. In Playwright, you have two main approaches:

1. **Page Object Classes** (traditional OOP)
2. **Fixtures** (Playwright's recommended approach)

---

## Why Use Page Objects?

### Without Page Objects (Anti-Pattern)

```typescript
// Repeated selectors in every test
test('create policy 1', async ({ page }) => {
  await page.goto('/policies');
  await page.click('[data-testid="add-policy"]');
  await page.fill('[data-testid="policyNumber"]', 'POL-001');
  // ... repeated in every test
});
```

**Problems**: Code duplication, hard to maintain, tests are verbose

### With Page Objects

```typescript
// Clean, reusable, maintainable
test('create policy', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({ number: 'POL-001' });
});
```

---

## Approach 1: Page Object Classes

```typescript
// pages/policies-page.ts
import { Page, Locator, expect } from '@playwright/test';

// Selector constants
const ADD_POLICY_BTN = 'add-policy';
const POLICY_NUMBER_INPUT = 'policyNumber';
const CUSTOMER_NAME_INPUT = 'customerName';
const SAVE_BTN = 'save';

export class PoliciesPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/policies');
    await this.page.waitForLoadState('networkidle');
  }
  
  async createPolicy(data: { number: string; customer: string }) {
    await this.page.getByTestId(ADD_POLICY_BTN).click();
    await this.page.getByTestId(POLICY_NUMBER_INPUT).fill(data.number);
    await this.page.getByTestId(CUSTOMER_NAME_INPUT).fill(data.customer);
    await this.page.getByTestId(SAVE_BTN).click();
  }
  
  async expectPolicyVisible(policyNumber: string) {
    await expect(this.page.getByText(policyNumber)).toBeVisible();
  }
}

// test.spec.ts
test('create policy', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({ number: 'POL-001', customer: 'John' });
  await policiesPage.expectPolicyVisible('POL-001');
});
```

---

## Approach 2: Fixtures (Playwright Recommended)

```typescript
// fixtures.ts
import { test as base, expect } from '@playwright/test';

// Selector constants
const ADD_POLICY_BTN = 'add-policy';
const POLICY_NUMBER_INPUT = 'policyNumber';
const CUSTOMER_NAME_INPUT = 'customerName';
const SAVE_BTN = 'save';

export const test = base.extend({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
      },
      
      async createPolicy(data) {
        await page.getByTestId(ADD_POLICY_BTN).click();
        await page.getByTestId(POLICY_NUMBER_INPUT).fill(data.number);
        await page.getByTestId(CUSTOMER_NAME_INPUT).fill(data.customer);
        await page.getByTestId(SAVE_BTN).click();
      },
      
      async expectPolicyVisible(policyNumber: string) {
        await expect(page.getByText(policyNumber)).toBeVisible();
      }
    };
    
    await use(policiesPage);
  }
});

export { expect };

// test.spec.ts
import { test, expect } from '../fixtures';

test('create policy', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.createPolicy({ number: 'POL-001', customer: 'John' });
});
```

---

## When to Use Which

### Use Page Object Classes When:
- Team is familiar with OOP
- Simple setup without complex dependencies
- You want inheritance (BasePage → LoginPage)

### Use Fixtures When:
- You want automatic setup/teardown
- You have complex test setup (auth, data seeding)
- You follow Playwright's recommended patterns

### Best Practice: Hybrid Approach

Combine both - use Page Object classes with fixture injection:

```typescript
// pages/policies-page.ts
export class PoliciesPage {
  constructor(private page: Page) {}
  // Methods...
}

// fixtures.ts
export const test = base.extend({
  policiesPage: async ({ page }, use) => {
    await use(new PoliciesPage(page));
  }
});
```

---

## Best Practices

1. **Keep Page Objects Focused** - One object per page/feature
2. **Use Descriptive Method Names** - `clickAddPolicyButton()` not `click1()`
3. **Group Assertions** - Keep assertions in separate methods
4. **Handle Waiting** - Wait logic goes in page object, tests stay clean
5. **Return Page Objects** - Support method chaining for fluent interface

---

**See Also**: `test-writing-guide.md` for comprehensive practices
