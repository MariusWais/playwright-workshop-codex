import { test } from '../fixtures';

test.describe('Test group', () => {
  test('seed', async ({ policiesPage }) => {
    await policiesPage.goto();
  });
});
