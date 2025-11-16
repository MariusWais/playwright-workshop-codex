# Quick Reference Cheatsheet

> For quick lookup during the workshop

## Quick Setup (2 minutes)

```bash
npm install
npx playwright install
npm start
npx playwright test
```

## AI Agents - Copilot Chat

```
@planner Generate a test plan for the policy app

@generator Generate test for: [scenario from plan]

@healer Fix this failing test
```

## Running Tests

```bash
npx playwright test                 # Run all tests
npx playwright test --headed        # See the browser
npx playwright test --debug         # Step through
npx playwright test --ui            # Interactive UI
npx playwright show-report          # View results
```

## Selectors (Priority Order)

```typescript
// 1. Best
await page.getByTestId('button').click();

// 2. Good
await page.getByRole('button', { name: 'Submit' }).click();

// 3. OK
await page.getByText('Submit').click();

// 4. Avoid
await page.locator('.btn-primary').click();
```

## Common Patterns

```typescript
// Navigate
await page.goto('/');

// Click
await page.getByTestId('button').click();

// Fill input
await page.getByTestId('input').fill('text');

// Assert
await expect(page.getByText('Success')).toBeVisible();

// Wait for load
await page.waitForLoadState('networkidle');
```

## Test Structure

```typescript
import { test, expect } from '../fixtures';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act
    await page.getByTestId('button').click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

## Troubleshooting

```bash
# Port in use?
lsof -ti:4222 | xargs kill -9

# npm Installation issues?
npm -v
rm -rf node_modules package-lock.json
npm install

```

**Full docs**: See `/docs` folder  
**Need help?**: Check workshop guide or ask in chat
