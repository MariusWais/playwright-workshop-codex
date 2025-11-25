// spec: Edit an existing insurance policy
// seed: e2e/tests/seed.spec.ts

import { test, expect } from './fixtures';
import { SELECTORS } from './selectors';

test.describe('Policy Editing', () => {
  test('Edit Existing Policy', async ({ page, policiesPage }) => {
    // Navigate to the policies page
    await policiesPage.goto();

    // Create a test policy using fixture
    await policiesPage.addPolicy({
      policyNumber: 'POL-EDIT',
      customerName: 'John Doe',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premiumAmount: '1500'
    });

    // Click edit and verify form is pre-populated with existing data
    await page.getByTestId(SELECTORS.editButton(1)).click();
    await expect(page.getByText('Edit Policy')).toBeVisible();
    await expect(page.getByTestId(SELECTORS.POLICY_NUMBER)).toHaveValue('POL-EDIT');
    await expect(page.getByTestId(SELECTORS.CUSTOMER_NAME)).toHaveValue('John Doe');

    // Update all fields using fixture
    await policiesPage.editPolicyFields({
      policyNumber: 'POL-EDITED',
      customerName: 'Jane Doe',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      premiumAmount: '2500'
    });
    await page.getByTestId(SELECTORS.SAVE_BUTTON).click();

    // Verify navigation back to policies list
    await expect(page.getByText('Insurance Policies')).toBeVisible();

    // Verify the policy reflects all updated values
    await policiesPage.verifyPolicyInList('POL-EDITED', 'Jane Doe', '2500.00');
  });
});
