// spec: Create a new insurance policy with all required fields
// seed: e2e/tests/seed.spec.ts

import { test, expect } from './fixtures';
import { SELECTORS } from './selectors';
import * as fs from 'fs';
import * as path from 'path';

// Load all policy test data files
const testDataDir = path.join(__dirname, './test-data');
const testDataFiles = fs.readdirSync(testDataDir).filter(file => file.startsWith('create-policy-') && file.endsWith('.json'));

test.describe('Policy Creation', () => {
  for (const testDataFile of testDataFiles) {
    const testData = JSON.parse(fs.readFileSync(path.join(testDataDir, testDataFile), 'utf-8'));
    
    test(`Create New Policy - ${testData.policyNumber}`, async ({ page, policiesPage }) => {
      // Navigate to the policies page
      await policiesPage.goto();

      // Create a new policy using fixture with data from JSON
      await policiesPage.addPolicy({
        policyNumber: testData.policyNumber,
        customerName: testData.customerName,
        startDate: testData.startDate,
        endDate: testData.endDate,
        premiumAmount: testData.premiumAmount
      });

      // Verify navigation back to policies list
      await expect(page.getByText('Insurance Policies')).toBeVisible();

      // Verify the new policy appears in the list with correct data
      await policiesPage.verifyPolicyInList(
        testData.policyNumber, 
        testData.customerName, 
        testData.expectedDisplay.premiumAmount
      );
    });
  }
});
