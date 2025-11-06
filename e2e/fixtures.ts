import { test as base } from '@playwright/test';

// Define types for policy data
type PolicyData = {
  policyNumber: string;
  customerName: string;
  startDate: string;
  endDate: string;
  premiumAmount: string;
};

// Define the fixture type
type PolicyFixtures = {
  policiesPage: {
    goto: () => Promise<void>;
    addPolicy: (policyData: PolicyData) => Promise<void>;
    verifyPolicyInList: (policyNumber: string, customerName: string, premiumAmount: string) => Promise<void>;
  };
};

// Extend the base test with custom fixtures
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      // Navigate to the policies page
      goto: async () => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      },

      // Add a new policy with the provided data
      addPolicy: async (policyData: PolicyData) => {
        // Click the "Add Policy" button
        await page.getByTestId('add-policy').click();
        
        // Fill out the form
        await page.getByTestId('policyNumber').fill(policyData.policyNumber);
        await page.getByTestId('customerName').fill(policyData.customerName);
        await page.locator('#startDate').fill(policyData.startDate);
        await page.locator('#endDate').fill(policyData.endDate);
        await page.getByTestId('premiumAmount').fill(policyData.premiumAmount);
        
        // Submit the form
        await page.getByRole('button', { name: 'Save Policy' }).click();
        
        // Wait for navigation back to the list
        await page.waitForURL('/');
      },

      // Verify that a policy appears in the list
      verifyPolicyInList: async (policyNumber: string, customerName: string, premiumAmount: string) => {
        await page.getByText(policyNumber).waitFor({ state: 'visible' });
        await page.getByText(customerName).waitFor({ state: 'visible' });
        await page.getByText(`$${premiumAmount}`).waitFor({ state: 'visible' });
      },
    };

    await use(policiesPage);
  },
});

export { expect } from '@playwright/test';
