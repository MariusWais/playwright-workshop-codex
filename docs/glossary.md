# Glossary

## Playwright Terms

### Action
An interaction with a page element (click, fill, select, etc.). Playwright automatically waits for actions to be actionable before performing them.

### Assertion
A validation that checks if a condition is true. In Playwright, use `expect()` for assertions:
```typescript
await expect(page.getByText('Hello')).toBeVisible();
```

### Auto-waiting
Playwright's built-in mechanism that automatically waits for elements to be ready before performing actions. No need for manual `sleep()` or explicit waits in most cases.

### Browser Context
An isolated browser session (similar to an incognito window). Each context has its own cookies, localStorage, and cache. Perfect for parallel test isolation.

### Fixture
Playwright's dependency injection system. Fixtures provide setup/teardown logic and reusable test objects:
```typescript
test('my test', async ({ page, context }) => {
  // page and context are fixtures
});
```

### Headless Mode
Running browser tests without a visible UI window. Faster and used in CI/CD. Run with `npx playwright test`.

### Headed Mode
Running tests with visible browser window. Useful for debugging. Run with `npx playwright test --headed`.

### Locator
A way to find elements on a page. Locators are lazy and auto-wait:
```typescript
const button = page.getByTestId('submit'); // Locator
await button.click(); // Action on locator
```

### Page Object Model (POM)
Design pattern that encapsulates page interactions in reusable classes or objects, improving test maintainability.

### Selector
A string or pattern used to find elements on a page:
- `data-testid="submit"` - Test ID attribute
- `role=button` - ARIA role
- `.class-name` - CSS selector
- `text=Submit` - Text content

### Trace
A recording of test execution including screenshots, DOM snapshots, network requests, and console logs. View with `npx playwright show-trace trace.zip`.

### Worker
A parallel process running tests. Configure with `workers` in `playwright.config.ts`. More workers = faster test execution.

---

## AI Testing Agent Terms

### 🎭 Planner Agent
AI chatmode that explores your application and generates human-readable test plans in markdown format. First step in the agent workflow.

### 🎭 Generator Agent
AI chatmode that reads test plans and generates executable Playwright test files by interacting with the live application.

### 🎭 Healer Agent
AI chatmode that debugs and fixes failing tests by analyzing errors, inspecting DOM, and updating selectors or logic.

### Chatmode
A specialized AI agent configuration file (`.chatmode.md`) that defines the agent's behavior, focus, and instructions for specific tasks.

### Test Plan
Markdown document created by Planner agent containing test scenarios, steps, expected results, and preconditions. Acts as the blueprint for Generator.

### Agent Workflow
The three-step process: Planner (explore/plan) → Generator (create tests) → Healer (fix failures).

### Seed Test
A special test (usually `seed.spec.ts`) that sets up the application in a known state by clearing data, creating test users, etc. Run before other tests.

---

## Test Automation Concepts

### BDD (Behavior-Driven Development)
Testing approach that uses plain language (Given/When/Then) to describe test scenarios. Example:
```gherkin
Given I am on the login page
When I enter valid credentials
Then I should see the dashboard
```

### CI/CD (Continuous Integration/Continuous Deployment)
Automated pipeline that runs tests on every code change. Playwright integrates with GitHub Actions, Jenkins, GitLab CI, etc.

### Data-testid
HTML attribute specifically for testing: `<button data-testid="submit">`. Preferred selector type because it's stable and independent of styling.

### Flaky Test
A test that sometimes passes and sometimes fails without code changes. Usually caused by timing issues, unstable selectors, or test interdependence.

### Happy Path
The ideal scenario where everything works as expected. Example: successful login with valid credentials.

### Negative Test
Testing error conditions and invalid inputs. Example: login with wrong password should show error message.

### Regression Test
Testing existing functionality after changes to ensure nothing broke. Automated tests are perfect for regression testing.

### Smoke Test
Quick, high-level tests that verify basic functionality works. Run these first before detailed tests.

### Test Coverage
Percentage of application features/code tested by automated tests. Higher coverage = more confidence.

### Test Isolation
Each test is independent and doesn't rely on other tests. Tests can run in any order without affecting results.

---

## Testing Best Practices Terms

### DRY (Don't Repeat Yourself)
Principle of avoiding code duplication. Use fixtures or page objects instead of copying selector strings everywhere.

### Explicit Wait
Manually waiting for a specific condition:
```typescript
await page.waitForSelector('[data-testid="element"]');
await page.waitForLoadState('networkidle');
```

### Implicit Wait
Built-in waiting that Playwright does automatically. Prefer this over explicit waits when possible.

### Idempotent Test
A test that produces the same result every time it runs, regardless of how many times it's executed.

### Race Condition
When test timing creates unpredictable results. Example: clicking a button before it's fully loaded.

### Selector Priority
Recommended order for choosing selectors:
1. `data-testid` attributes
2. Role-based selectors
3. Text content
4. CSS selectors (last resort)

### Test Data Management
Strategy for creating, using, and cleaning up test data. Use unique IDs, clear state between tests.

### Test Pyramid
Testing strategy: Many unit tests → Fewer integration tests → Even fewer E2E tests. E2E tests (like Playwright) are at the top.

---

## Playwright-Specific Features

### Auto-retry Assertions
Assertions automatically retry until they pass or timeout:
```typescript
await expect(page.getByText('Loading...')).not.toBeVisible();
// Retries for 5 seconds by default
```

### Codegen
Playwright tool that records your browser actions and generates test code. Run with `npx playwright codegen`.

### Debug Mode
Run tests in step-by-step mode with `npx playwright test --debug`. Opens Playwright Inspector for debugging.

### Network Interception
Ability to mock, modify, or block network requests:
```typescript
await page.route('**/api/users', route => {
  route.fulfill({ status: 200, body: '[]' });
});
```

### Parallel Execution
Running multiple tests simultaneously using multiple workers. Speeds up test execution significantly.

### Screenshot on Failure
Automatic screenshot capture when test fails. Helps debug issues in CI.

### Storage State
Saved authentication state (cookies, localStorage) that can be reused across tests:
```typescript
// Save state
await context.storageState({ path: 'auth.json' });

// Reuse state
const context = await browser.newContext({ storageState: 'auth.json' });
```

### Test Reporter
Formats and displays test results. Options: `list`, `dot`, `html`, `json`, `junit`.

---

## Common Commands

### Run Tests
```bash
npx playwright test                    # Run all tests
npx playwright test file.spec.ts      # Run specific file
npx playwright test --headed           # Run with browser visible
npx playwright test --debug            # Run in debug mode
npx playwright test --ui               # Run with UI mode
```

### Generate Code
```bash
npx playwright codegen localhost:3000  # Record and generate test code
```

### View Reports
```bash
npx playwright show-report             # Show HTML report
npx playwright show-trace trace.zip    # View trace file
```

### Install Browsers
```bash
npx playwright install                 # Install all browsers
npx playwright install chromium        # Install specific browser
```

---

## Workshop-Specific Terms

### 01-angular-app / 02-angular-app
Sample applications used in workshop. Insurance policy management app built with Angular 20.

### Custom Fixtures (`e2e/fixtures.ts`)
Project-specific fixtures that encapsulate common workflows like creating policies, verifying data, etc.

### Policy Data
Test data structure for the workshop app:
```typescript
{
  policyNumber: string;
  customerName: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
}
```

### Test Plan Document
Markdown file (`test-plan.md`) created by Planner agent with 15+ test scenarios for the policy app.

---

## Quick Reference

**Most Important Terms for Beginners:**
- **Locator**: How you find elements
- **Action**: What you do with elements (click, fill, etc.)
- **Assertion**: Verifying expected results
- **Auto-waiting**: Playwright waits automatically
- **data-testid**: Best selector for tests
- **Fixture**: Reusable test setup
- **Headless**: Running without visible browser

**AI Agent Workflow:**
1. **Planner** - Explore app, create test plan
2. **Generator** - Generate tests from plan
3. **Healer** - Fix failing tests

**Golden Rules:**
- Use `data-testid` attributes
- Let Playwright auto-wait
- Make tests independent
- One test = one behavior
- Avoid hardcoded waits (`waitForTimeout`)

---

## Further Reading

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: See `test-writing-best-practices.md`
- **Flaky Tests**: See `flaky-tests-and-pitfalls.md`
- **Page Objects**: See `page-object-pattern.md`
- **Agent Architecture**: See `agents-architecture-overview.md`