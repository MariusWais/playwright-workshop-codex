import { test as base } from '@playwright/test';
import { SELECTORS } from './selectors';

// Define types for policy data
type PolicyData = {
  policyNumber: string;
  customerName: string;
  startDate: string;
  endDate: string;
  premiumAmount: string;
};

type PartialPolicyData = Partial<PolicyData>;

// Define the fixture type
type PolicyFixtures = {
  policiesPage: {
    goto: () => Promise<void>;
    addPolicy: (policyData: PolicyData) => Promise<void>;
    updatePolicy: (policyId: number, policyData: PartialPolicyData) => Promise<void>;
    editPolicyFields: (policyData: PartialPolicyData) => Promise<void>;
    deletePolicy: (policyId: number, confirm?: boolean) => Promise<void>;
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
      },

      // Add a new policy with the provided data
      addPolicy: async (policyData: PolicyData) => {
        await page.getByTestId(SELECTORS.ADD_POLICY_BUTTON).click();
        await page.getByTestId(SELECTORS.POLICY_NUMBER).fill(policyData.policyNumber);
        await page.getByTestId(SELECTORS.CUSTOMER_NAME).fill(policyData.customerName);
        await page.getByTestId(SELECTORS.START_DATE).fill(policyData.startDate);
        await page.getByTestId(SELECTORS.END_DATE).fill(policyData.endDate);
        await page.getByTestId(SELECTORS.PREMIUM_AMOUNT).fill(policyData.premiumAmount);
        await page.getByTestId(SELECTORS.SAVE_BUTTON).click();
      },

      // Update an existing policy
      updatePolicy: async (policyId: number, policyData: PartialPolicyData) => {
        await page.getByTestId(SELECTORS.editButton(policyId)).click();
        
        if (policyData.policyNumber) {
          await page.getByTestId(SELECTORS.POLICY_NUMBER).fill(policyData.policyNumber);
        }
        if (policyData.customerName) {
          await page.getByTestId(SELECTORS.CUSTOMER_NAME).fill(policyData.customerName);
        }
        if (policyData.startDate) {
          await page.getByTestId(SELECTORS.START_DATE).fill(policyData.startDate);
        }
        if (policyData.endDate) {
          await page.getByTestId(SELECTORS.END_DATE).fill(policyData.endDate);
        }
        if (policyData.premiumAmount) {
          await page.getByTestId(SELECTORS.PREMIUM_AMOUNT).fill(policyData.premiumAmount);
        }
        
        await page.getByTestId(SELECTORS.SAVE_BUTTON).click();
      },

      // Fill policy form fields (without clicking edit or save)
      editPolicyFields: async (policyData: PartialPolicyData) => {
        if (policyData.policyNumber) {
          await page.getByTestId(SELECTORS.POLICY_NUMBER).fill(policyData.policyNumber);
        }
        if (policyData.customerName) {
          await page.getByTestId(SELECTORS.CUSTOMER_NAME).fill(policyData.customerName);
        }
        if (policyData.startDate) {
          await page.getByTestId(SELECTORS.START_DATE).fill(policyData.startDate);
        }
        if (policyData.endDate) {
          await page.getByTestId(SELECTORS.END_DATE).fill(policyData.endDate);
        }
        if (policyData.premiumAmount) {
          await page.getByTestId(SELECTORS.PREMIUM_AMOUNT).fill(policyData.premiumAmount);
        }
      },

      // Delete a policy
      deletePolicy: async (policyId: number, confirm: boolean = true) => {
        page.once('dialog', async dialog => {
          if (confirm) {
            await dialog.accept();
          } else {
            await dialog.dismiss();
          }
        });
        await page.getByTestId(SELECTORS.deleteButton(policyId)).click();
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
