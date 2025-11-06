import { test, expect } from '../fixtures';

test.describe('Create New Policy - Happy Path', () => {
  test('should successfully create a new insurance policy with valid data', async ({ page, policiesPage }) => {
    // Step 1: Navigate to the policies list page
    await policiesPage.goto();

    // Clear existing data to start fresh
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Step 2: Click the "+ Add Policy" button
    await page.getByTestId('add-policy').click();

    // Step 3: Verify navigation to /policies/new
    await expect(page).toHaveURL('/policies/new');

    // Step 4: Verify form displays with heading "Add New Policy"
    await expect(page.getByRole('heading', { name: 'Add New Policy' })).toBeVisible();

    // Step 5: Fill in the policy number field: "POL-2024-001"
    await page.getByTestId('policyNumber').fill('POL-2024-001');

    // Step 6: Fill in the customer name field: "John Smith"
    await page.getByTestId('customerName').fill('John Smith');

    // Step 7: Fill in the start date field: "2024-01-01"
    await page.locator('#startDate').fill('2024-01-01');

    // Step 8: Fill in the end date field: "2024-12-31"
    await page.locator('#endDate').fill('2024-12-31');

    // Step 9: Fill in the premium amount field: "1250.50"
    await page.getByTestId('premiumAmount').fill('1250.50');

    // Step 10: Click the "Create Policy" button
    await page.getByTestId('save').click();

    // Step 11: Verify navigation back to /policies
    await expect(page).toHaveURL('/policies');

    // Step 12: Verify the new policy appears in the table with correct data
    // - Policy Number: POL-2024-001
    await expect(page.getByText('POL-2024-001')).toBeVisible();

    // - Customer Name: John Smith
    await expect(page.getByText('John Smith')).toBeVisible();

    // - Premium Amount: $1250.50
    await expect(page.getByText('$1250.50')).toBeVisible();

    // Verify the policy row contains all expected data
    const policyRow = page.locator('tr', { hasText: 'POL-2024-001' });
    await expect(policyRow).toBeVisible();
    await expect(policyRow).toContainText('John Smith');
    await expect(policyRow).toContainText('$1250.50');
  });
});
