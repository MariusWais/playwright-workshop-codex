# Workshop Guide: AI-Assisted E2E Testing with Playwright

**Duration:** 1 hour  
**Goal:** Learn to use Planner, Generator, and Healer agents to create, run, and maintain Playwright tests

---

## Part 1: Setup & Verification

### Prerequisites Check

✅ Node.js 18+ installed  
✅ VS Code v1.105+ installed  
✅ GitHub Copilot active  
✅ Playwright Test for VS Code extension installed

### Quick Start

```bash
git clone https://github.com/MariusWais/playwright-workshop-codex.git
cd playwright-workshop-codex
npm install && npx playwright install
```

### Start App

```bash
npm start    # Terminal 1 - keep running
```

Open http://localhost:4222 → You should see "Insurance Policies" page

### Run Seed Test

```bash
npx playwright test --headed    # Terminal 2
```

✅ **Checkpoint:** Browser opens, test runs, report opens automatically

---

## Part 2: Create a Test Plan with Planner Agent

Open Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`):

```
@planner Generate a test plan for the insurance policy app
```

**What Planner does:**
- Explores your app routes and components
- Identifies CRUD operations
- Generates structured test scenarios
- Creates `test-plan.md` with steps and expected results

### Review Output

Open `test-plan.md` and review:
- Scenarios (create, edit, delete, validation)
- Preconditions and test data
- Step-by-step instructions
- Expected results

### Pro Tips

**Be specific:**
```
@planner Focus on form validation and error handling
@planner Include edge cases like empty list state
@planner Map complete flow: create → edit → delete → persistence
```

✅ **Checkpoint:** You have a `test-plan.md` with 10-15 scenarios

---

## Part 3: Test Code Generation

### Generate First Test

```
@generator Generate test for: Create New Policy using getByTestId selectors
```

**What Generator does:**
- Converts test plan scenarios into `.spec.ts` files
- Uses stable selectors (data-testid preferred)
- Adds assertions for UI state and data persistence
- Creates ready-to-run Playwright tests

### Review Generated Code

Open the generated `.spec.ts` file. Look for:
- Page navigation (`page.goto`)
- Form filling (`getByTestId().fill()`)
- Button clicks (`getByTestId().click()`)
- Assertions (`expect().toBeVisible()`)

### Run the Test

```bash
npx playwright test create-policy.spec.ts --headed
```

### Generate More Tests

```
@generator Generate test for: Edit Existing Policy
@generator Generate test for: Form Validation - Empty Fields
@generator Generate test for: Delete Policy with Confirmation
```

### Pro Tips

**Specify selectors:**
```
@generator using data-testid selectors
@generator prefer getByRole for accessibility
```

**Batch generate:**
```
@generator Generate tests for all scenarios in test-plan.md
```

✅ **Checkpoint:** You have 3-4 working test files that pass

---

## Part 4: Test Maintenance

### Intentionally Break a Test

Option A: Change a selector in your app template  
Option B: Modify a test to use wrong selector  
Option C: Choose your own way of destruction

### Run Tests to See Failure

```bash
npx playwright test --headed
```

Note the error message (e.g., "Element not found: save-button")

### Use Healer Agent

```
@healer Fix the create-policy test - Error: Element not found 'save-button'
```

**What Healer does:**
- Analyzes test failure output
- Inspects current app selectors
- Updates test code with correct selectors
- Adds missing waits or assertions
- Suggests stability improvements

### Review Fix

Check the updated test file:
- Corrected selectors
- Added explicit waits if needed
- Improved assertions

### Run Tests Again

```bash
npx playwright test --headed
```

✅ Tests should pass now

### Pro Tips

**Include error details:**
```
@healer Error: Timeout waiting for element '#submit'
@healer Fix timing issue where click doesn't register
```

**Batch healing:**
```
@healer Fix all failing tests
```

✅ **Checkpoint:** All tests passing after healing

---

## Part 5: Best Practices 

### Key Takeaways

**Selector Hierarchy (use in order):**
1. `getByTestId('save')` — Most stable
2. `getByRole('button', { name: 'Save' })` — Accessible
3. `getByText('Save')` — OK for unique text
4. `.locator('.btn')` — Avoid (brittle)

**Common Pitfalls:**
- ❌ Hard waits: `waitForTimeout(5000)`
- ✅ Auto-waits: `expect(locator).toBeVisible()`
- ❌ Shared test state (tests depend on each other)
- ✅ Isolated setup: each test creates own data
- ❌ Testing CSS classes
- ✅ Testing user outcomes

### Test Code Patterns

**Basic (no abstraction):**
```ts
test('create policy', async ({ page }) => {
  await page.getByTestId('add-policy').click();
  await page.getByTestId('policyNumber').fill('POL-001');
  await page.getByTestId('save').click();
  await expect(page.getByTestId('policy-number-1')).toHaveText('POL-001');
});
```

**With Fixture:**
```ts
test('create policy', async ({ page, policy }) => {
  await policy.create({ number: 'POL-001', customer: 'Alice' });
  await expect(page.getByTestId('policy-number-1')).toHaveText('POL-001');
});
```

**Page Object Model (POM):**
```ts
test('create policy', async ({ page }) => {
  const form = new PolicyFormPage(page);
  await form.openCreate();
  await form.fillAndSubmit({ number: 'POL-001', customer: 'Alice' });
  await expect(page.getByTestId('policy-number-1')).toHaveText('POL-001');
});
```

### Debugging Commands

```bash
npx playwright test --headed         # See browser
npx playwright test --debug          # Step through
npx playwright test --ui             # Interactive mode
npx playwright test --repeat-each=10 # Find flakes
npx playwright show-report           # View last report
```

### AI Agent Workflow Summary

```
Plan (Planner) → Generate (Generator) → Run → Heal (Healer) → Refine → Repeat
```

**When to use each:**
- **Planner:** New feature, need comprehensive coverage, team alignment
- **Generator:** Turn scenarios into code, bootstrap test suite
- **Healer:** After UI changes, selector drift, timing issues

### Next Steps

**Expand your test suite:**
- Add negative validation tests
- Test localStorage persistence across reloads
- Add multi-policy scenarios
- Test breadcrumb navigation

**Integrate with CI:**
- Add GitHub Actions workflow
- Run on every PR
- Track test results over time

**Deepen your knowledge:**
- Read `/docs/self-study/` for advanced patterns
- Explore page objects and fixtures
- Learn debugging strategies for flaky tests

---

## Quick Reference

### Essential Commands

```bash
npm start                       # Start app
npx playwright test             # Run all tests
npx playwright test --headed    # With browser
npx playwright test --debug     # Step through
npx playwright test file.spec   # Run specific file
```

### AI Agent Cheat Sheet

```
@planner Generate a test plan for [feature]
@generator Generate test for: [scenario]
@healer Fix [test-name] - Error: [message]
```

## Self-Study Resources

After the workshop, explore:

- **[agents-workflow-patterns.md](docs/self-study/agents-workflow-patterns.md)** — Sequential/parallel/hybrid workflows
- **[agents-advanced.md](docs/self-study/agents-advanced.md)** — Architecture & technical implementation
- **[test-writing-guide.md](docs/self-study/test-writing-guide.md)** — Playwright best practices
- **[page-objects-and-fixtures.md](docs/self-study/page-objects-and-fixtures.md)** — Advanced patterns
- **[debugging-flaky-tests.md](docs/self-study/debugging-flaky-tests.md)** — Troubleshooting strategies
- **[cheatsheet.md](docs/self-study/cheatsheet.md)** — Commands & quick reference
- **[glossary.md](docs/self-study/glossary.md)** — Terms & definitions

---