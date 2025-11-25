// spec: Delete a policy with confirmation dialog
// seed: e2e/tests/seed.spec.ts

import { test, expect } from './fixtures';
import { SELECTORS } from './selectors';

test.describe('Policy Deletion', () => {
  test('Delete Policy with Confirmation', async ({ page, policiesPage }) => {
    // Navigate to the policies page
    await policiesPage.goto();

    // Create a test policy using fixtures
    await policiesPage.addPolicy({
      policyNumber: 'POL-DELETE',
      customerName: 'Test User',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premiumAmount: '1000'
    });

    // Verify the policy appears in the list
    await expect(page.getByText('POL-DELETE')).toBeVisible();
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('$1000.00')).toBeVisible();

    // Delete the policy using fixture (with confirmation)
    await policiesPage.deletePolicy(1);

    // Verify empty state appears after deletion
    await expect(page.getByText('No policies yet')).toBeVisible();
    await expect(page.getByText('Get started by adding your first insurance policy')).toBeVisible();
  });
});
