import { test, expect } from '../fixtures';

test.describe('Test group', () => {
  test('seed', async ({ page, policiesPage }) => {
    // Navigate to the policies page
    await policiesPage.goto();
    
    // Verify we're on the policies list page
    await expect(page.getByRole('heading', { name: 'Insurance Policies' })).toBeVisible();
  });
});
