import { test as base } from '@playwright/test';

type PolicyFixtures = {
  policiesPage: {
    goto: () => Promise<void>;
  };
};

// Extend the base test with custom fixtures
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      // Navigate to the policies page
      goto: async () => {
        await page.goto('/');
      },
    };

    await use(policiesPage);
  },
});

export { expect } from '@playwright/test';
