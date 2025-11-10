# Page Object Pattern

## Introduction

The Page Object Model (POM) is a design pattern that creates an object-oriented abstraction of your web pages. Instead of scattering selectors and actions throughout your tests, you encapsulate them in reusable page classes.

In Playwright, you have two main approaches:
1. **Page Object Classes** (traditional OOP)
2. **Fixtures** (Playwright's recommended approach)

Both are valid - this guide covers both patterns with real-world examples.

---

## Why Use Page Objects?

### Without Page Objects (Anti-Pattern)

```typescript
// ❌ Repeated selectors and logic in every test
test('create policy 1', async ({ page }) => {
  await page.goto('/policies');
  await page.click('[data-testid="add-policy"]');
  await page.fill('[data-testid="policyNumber"]', 'POL-001');
  await page.fill('[data-testid="customerName"]', 'John Doe');
  await page.fill('[data-testid="premiumAmount"]', '1000');
  await page.click('[data-testid="save"]');
  await expect(page.locator('text=POL-001')).toBeVisible();
});

test('create policy 2', async ({ page }) => {
  await page.goto('/policies');
  await page.click('[data-testid="add-policy"]');  // Duplicated!
  await page.fill('[data-testid="policyNumber"]', 'POL-002');
  await page.fill('[data-testid="customerName"]', 'Jane Smith');
  await page.fill('[data-testid="premiumAmount"]', '2000');
  await page.click('[data-testid="save"]');
  await expect(page.locator('text=POL-002')).toBeVisible();
});
```

**Problems**:
- Code duplication
- Hard to maintain (change one selector = update 10 tests)
- Tests are verbose and hard to read
- No reusability

### With Page Objects

```typescript
// ✅ Clean, reusable, maintainable
test('create policy 1', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({
    number: 'POL-001',
    customer: 'John Doe',
    premium: 1000
  });
  await policiesPage.expectPolicyVisible('POL-001');
});

test('create policy 2', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({
    number: 'POL-002',
    customer: 'Jane Smith',
    premium: 2000
  });
  await policiesPage.expectPolicyVisible('POL-002');
});
```

**Benefits**:
- ✅ Selectors defined once
- ✅ Easy to maintain
- ✅ Tests read like plain English
- ✅ Reusable across tests

---

## Approach 1: Page Object Classes (Traditional)

### Basic Structure

```typescript
// pages/policies-page.ts
import { Page, Locator, expect } from '@playwright/test';

export class PoliciesPage {
  readonly page: Page;
  
  // Locators
  readonly addButton: Locator;
  readonly policyNumberInput: Locator;
  readonly customerNameInput: Locator;
  readonly premiumInput: Locator;
  readonly saveButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Define all locators in constructor
    this.addButton = page.getByTestId('add-policy');
    this.policyNumberInput = page.getByTestId('policyNumber');
    this.customerNameInput = page.getByTestId('customerName');
    this.premiumInput = page.getByTestId('premiumAmount');
    this.saveButton = page.getByTestId('save');
  }
  
  // Navigation
  async goto() {
    await this.page.goto('/policies');
    await this.page.waitForLoadState('networkidle');
  }
  
  // Actions
  async clickAddPolicy() {
    await this.addButton.click();
  }
  
  async fillPolicyForm(data: {
    number: string;
    customer: string;
    premium: number;
  }) {
    await this.policyNumberInput.fill(data.number);
    await this.customerNameInput.fill(data.customer);
    await this.premiumInput.fill(data.premium.toString());
  }
  
  async savePolicyForm() {
    await this.saveButton.click();
    await this.page.waitForURL('/policies');
  }
  
  // High-level workflow
  async createPolicy(data: {
    number: string;
    customer: string;
    premium: number;
  }) {
    await this.clickAddPolicy();
    await this.fillPolicyForm(data);
    await this.savePolicyForm();
  }
  
  // Assertions
  async expectPolicyVisible(policyNumber: string) {
    await expect(
      this.page.getByText(policyNumber)
    ).toBeVisible();
  }
  
  async expectPolicyCount(count: number) {
    const rows = this.page.locator('table tbody tr');
    await expect(rows).toHaveCount(count);
  }
}
```

### Usage in Tests

```typescript
// tests/policies.spec.ts
import { test, expect } from '@playwright/test';
import { PoliciesPage } from '../pages/policies-page';

test.describe('Policy Management', () => {
  let policiesPage: PoliciesPage;
  
  test.beforeEach(async ({ page }) => {
    policiesPage = new PoliciesPage(page);
    await policiesPage.goto();
  });
  
  test('should create a new policy', async () => {
    await policiesPage.createPolicy({
      number: 'POL-001',
      customer: 'John Doe',
      premium: 1500
    });
    
    await policiesPage.expectPolicyVisible('POL-001');
  });
  
  test('should display empty state when no policies exist', async () => {
    await policiesPage.expectPolicyCount(0);
  });
});
```

### Advanced: Component Objects

For complex pages, break into smaller component objects:

```typescript
// components/policy-form.ts
export class PolicyForm {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async fill(data: PolicyData) {
    await this.page.getByTestId('policyNumber').fill(data.number);
    await this.page.getByTestId('customerName').fill(data.customer);
    await this.page.getByTestId('startDate').fill(data.startDate);
    await this.page.getByTestId('endDate').fill(data.endDate);
    await this.page.getByTestId('premiumAmount').fill(data.premium.toString());
  }
  
  async submit() {
    await this.page.getByTestId('save').click();
  }
  
  async expectValidationError(field: string, message: string) {
    const errorLocator = this.page.locator(`[data-testid="${field}"] + .error-message`);
    await expect(errorLocator).toHaveText(message);
  }
}

// components/policy-table.ts
export class PolicyTable {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async clickEdit(policyId: string) {
    await this.page.getByTestId(`edit-${policyId}`).click();
  }
  
  async clickDelete(policyId: string) {
    await this.page.getByTestId(`delete-${policyId}`).click();
  }
  
  async expectRowCount(count: number) {
    await expect(this.page.locator('table tbody tr')).toHaveCount(count);
  }
  
  async expectPolicyInRow(policyNumber: string, customer: string) {
    const row = this.page.locator('tr', { hasText: policyNumber });
    await expect(row).toContainText(customer);
  }
}

// pages/policies-page.ts
import { PolicyForm } from '../components/policy-form';
import { PolicyTable } from '../components/policy-table';

export class PoliciesPage {
  readonly page: Page;
  readonly form: PolicyForm;
  readonly table: PolicyTable;
  
  constructor(page: Page) {
    this.page = page;
    this.form = new PolicyForm(page);
    this.table = new PolicyTable(page);
  }
  
  async goto() {
    await this.page.goto('/policies');
  }
  
  async createPolicy(data: PolicyData) {
    await this.page.getByTestId('add-policy').click();
    await this.form.fill(data);
    await this.form.submit();
    await this.page.waitForURL('/policies');
  }
}

// Usage
test('create policy', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({ /* data */ });
  await policiesPage.table.expectRowCount(1);
});
```

---

## Approach 2: Fixtures (Playwright Recommended)

### What Are Fixtures?

Fixtures are Playwright's built-in dependency injection system. They provide:
- Automatic setup and teardown
- Lazy initialization
- Easy mocking and overriding
- Better TypeScript support

### Basic Fixture

```typescript
// fixtures.ts
import { test as base, expect } from '@playwright/test';

type PolicyData = {
  number: string;
  customer: string;
  premium: number;
};

type PolicyFixtures = {
  policiesPage: {
    goto: () => Promise<void>;
    createPolicy: (data: PolicyData) => Promise<void>;
    editPolicy: (id: string, data: Partial<PolicyData>) => Promise<void>;
    deletePolicy: (id: string) => Promise<void>;
    expectPolicyVisible: (policyNumber: string) => Promise<void>;
  };
};

export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    // Setup: create the page object
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
        await page.waitForLoadState('networkidle');
      },
      
      async createPolicy(data: PolicyData) {
        await page.getByTestId('add-policy').click();
        await page.getByTestId('policyNumber').fill(data.number);
        await page.getByTestId('customerName').fill(data.customer);
        await page.getByTestId('premiumAmount').fill(data.premium.toString());
        await page.getByTestId('save').click();
        await page.waitForURL('/policies');
      },
      
      async editPolicy(id: string, data: Partial<PolicyData>) {
        await page.getByTestId(`edit-${id}`).click();
        if (data.number) await page.getByTestId('policyNumber').fill(data.number);
        if (data.customer) await page.getByTestId('customerName').fill(data.customer);
        if (data.premium) await page.getByTestId('premiumAmount').fill(data.premium.toString());
        await page.getByTestId('save').click();
        await page.waitForURL('/policies');
      },
      
      async deletePolicy(id: string) {
        await page.getByTestId(`delete-${id}`).click();
        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
      },
      
      async expectPolicyVisible(policyNumber: string) {
        await expect(page.getByText(policyNumber)).toBeVisible();
      }
    };
    
    // Provide the fixture to the test
    await use(policiesPage);
    
    // Teardown (optional)
    // Clean up after test if needed
  }
});

export { expect } from '@playwright/test';
```

### Usage in Tests

```typescript
// tests/policies.spec.ts
import { test, expect } from '../fixtures';

test.describe('Policy Management', () => {
  test('should create a new policy', async ({ page, policiesPage }) => {
    await policiesPage.goto();
    await policiesPage.createPolicy({
      number: 'POL-001',
      customer: 'John Doe',
      premium: 1500
    });
    await policiesPage.expectPolicyVisible('POL-001');
  });
  
  test('should edit existing policy', async ({ page, policiesPage }) => {
    await policiesPage.goto();
    await policiesPage.createPolicy({
      number: 'POL-001',
      customer: 'John Doe',
      premium: 1500
    });
    
    await policiesPage.editPolicy('1', {
      premium: 2000
    });
    
    await expect(page.getByText('$2000.00')).toBeVisible();
  });
});
```

### Advanced: Authenticated Fixture

```typescript
// fixtures.ts
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures & PolicyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.getByTestId('email').fill('test@example.com');
    await page.getByTestId('password').fill('password123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
    
    // Provide authenticated page
    await use(page);
    
    // Logout after test
    await page.goto('/logout');
  },
  
  policiesPage: async ({ authenticatedPage: page }, use) => {
    // Same as before but uses authenticated page
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
      },
      // ... rest of methods
    };
    
    await use(policiesPage);
  }
});

// Usage
test('create policy as authenticated user', async ({ authenticatedPage, policiesPage }) => {
  // Already logged in!
  await policiesPage.goto();
  await policiesPage.createPolicy({ /* data */ });
});
```

---

## Page Objects vs Fixtures: When to Use What?

### Use Page Object Classes When:

✅ Team is familiar with OOP
✅ You want traditional class-based structure
✅ You need inheritance (BasePage → LoginPage)
✅ Simple setup without complex dependencies

### Use Fixtures When:

✅ You want automatic setup/teardown
✅ You need dependency injection
✅ You have complex test setup (auth, data seeding)
✅ You want lazy initialization
✅ You follow Playwright's recommended patterns

### Hybrid Approach (Best of Both)

Combine both: use Page Object classes with fixture injection

```typescript
// pages/policies-page.ts
export class PoliciesPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/policies');
  }
  
  async createPolicy(data: PolicyData) {
    // ... implementation
  }
}

// fixtures.ts
type PolicyFixtures = {
  policiesPage: PoliciesPage;
};

export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = new PoliciesPage(page);
    await use(policiesPage);
  }
});

// tests/policies.spec.ts
import { test } from '../fixtures';

test('create policy', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.createPolicy({ /* data */ });
});
```

---

## Best Practices

### 1. Keep Page Objects Focused

```typescript
// ❌ Bad - God object doing everything
export class ApplicationPage {
  async login() { }
  async createPolicy() { }
  async editUser() { }
  async generateReport() { }
  // 50 more methods...
}

// ✅ Good - One page object per page/feature
export class LoginPage { }
export class PoliciesPage { }
export class UsersPage { }
export class ReportsPage { }
```

### 2. Use Descriptive Method Names

```typescript
// ❌ Bad - Unclear names
async click1() { }
async fill() { }
async check() { }

// ✅ Good - Clear intent
async clickAddPolicyButton() { }
async fillPolicyNumber(value: string) { }
async expectValidationError(message: string) { }
```

### 3. Return Page Objects for Chaining

```typescript
// ✅ Good - Fluent interface
export class PoliciesPage {
  async goto() {
    await this.page.goto('/policies');
    return this;
  }
  
  async clickAddPolicy() {
    await this.page.getByTestId('add-policy').click();
    return new PolicyFormPage(this.page);
  }
}

// Usage - method chaining
const formPage = await policiesPage.goto().clickAddPolicy();
await formPage.fillForm(data).submit();
```

### 4. Group Assertions in Page Objects

```typescript
export class PoliciesPage {
  // Actions
  async createPolicy(data: PolicyData) { }
  
  // Assertions (grouped separately)
  async expectPolicyVisible(number: string) {
    await expect(this.page.getByText(number)).toBeVisible();
  }
  
  async expectPolicyCount(count: number) {
    await expect(this.page.locator('table tbody tr')).toHaveCount(count);
  }
  
  async expectEmptyState() {
    await expect(this.page.getByText('No policies yet')).toBeVisible();
  }
}
```

### 5. Handle Waiting in Page Objects

```typescript
export class PoliciesPage {
  async createPolicy(data: PolicyData) {
    await this.page.getByTestId('add-policy').click();
    await this.fillForm(data);
    await this.page.getByTestId('save').click();
    
    // Wait for navigation in the page object
    await this.page.waitForURL('/policies');
    await this.page.waitForLoadState('networkidle');
  }
}

// Test is clean
test('create policy', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.createPolicy(data); // All waiting handled internally
  await policiesPage.expectPolicyVisible('POL-001');
});
```

---

## Real-World Example

Complete example with both patterns:

### Page Object Class Version

```typescript
// pages/policies-page.ts
export class PoliciesPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/policies');
    await this.page.waitForLoadState('networkidle');
  }
  
  async createPolicy(data: PolicyData) {
    await this.page.getByTestId('add-policy').click();
    await this.page.getByTestId('policyNumber').fill(data.number);
    await this.page.getByTestId('customerName').fill(data.customer);
    await this.page.getByTestId('startDate').fill(data.startDate);
    await this.page.getByTestId('endDate').fill(data.endDate);
    await this.page.getByTestId('premiumAmount').fill(data.premium.toString());
    await this.page.getByTestId('save').click();
    await this.page.waitForURL('/policies');
  }
  
  async expectPolicyVisible(policyNumber: string) {
    const row = this.page.locator('tr', { hasText: policyNumber });
    await expect(row).toBeVisible();
  }
}

// test.spec.ts
test('create policy', async ({ page }) => {
  const policiesPage = new PoliciesPage(page);
  await policiesPage.goto();
  await policiesPage.createPolicy({
    number: 'POL-001',
    customer: 'John Doe',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    premium: 1500
  });
  await policiesPage.expectPolicyVisible('POL-001');
});
```

### Fixture Version

```typescript
// fixtures.ts
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() {
        await page.goto('/policies');
        await page.waitForLoadState('networkidle');
      },
      
      async createPolicy(data: PolicyData) {
        await page.getByTestId('add-policy').click();
        await page.getByTestId('policyNumber').fill(data.number);
        await page.getByTestId('customerName').fill(data.customer);
        await page.getByTestId('startDate').fill(data.startDate);
        await page.getByTestId('endDate').fill(data.endDate);
        await page.getByTestId('premiumAmount').fill(data.premium.toString());
        await page.getByTestId('save').click();
        await page.waitForURL('/policies');
      },
      
      async expectPolicyVisible(policyNumber: string) {
        await expect(page.locator('tr', { hasText: policyNumber })).toBeVisible();
      }
    };
    
    await use(policiesPage);
  }
});

// test.spec.ts
test('create policy', async ({ policiesPage }) => {
  await policiesPage.goto();
  await policiesPage.createPolicy({
    number: 'POL-001',
    customer: 'John Doe',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    premium: 1500
  });
  await policiesPage.expectPolicyVisible('POL-001');
});
```

---

## Conclusion

Both Page Object Model and Fixtures achieve the same goal: **maintainable, reusable test code**.

**Choose Page Object Classes** if:
- Your team prefers OOP
- You want simple, class-based structure
- You don't need complex setup/teardown

**Choose Fixtures** if:
- You want Playwright's recommended pattern
- You need automatic setup/teardown
- You have complex dependencies
- You want lazy initialization

**Or combine both** for the best of both worlds!

The key principles remain the same:
- Encapsulate page interactions
- Keep selectors in one place
- Make tests readable
- Reduce duplication
- Easy to maintain