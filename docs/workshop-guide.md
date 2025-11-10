# Workshop Guide (For Instructors)

## Overview

This is the complete teaching guide for the **Playwright + AI Agents Testing Workshop**. It includes timing, talking points, demo scripts, and troubleshooting tips.

## Workshop Details

- **Duration**: 60 minutes
- **Format**: Hands-on, live coding
- **Audience**: QA Engineers, Developers, Test Automation Engineers
- **Prerequisites**: Basic JavaScript/TypeScript knowledge
- **Tools**: VS Code, Node.js 18+, GitHub Copilot (optional)

---

## Schedule (60 minutes)

### 0–10 min: Setup and Introduction
- **Goal**: Get everyone's environment ready
- **Activities**: Clone repo, npm install, start app

### 10–25 min: Playwright Fundamentals
- **Goal**: Understand basic test writing
- **Activities**: Review test structure, selectors, assertions

### 25–45 min: AI-Assisted Test Generation
- **Goal**: Use AI agents to generate tests
- **Activities**: Planner → Generator → Healer workflow

### 45–55 min: Improve and Fix Tests
- **Goal**: Apply best practices and fix issues
- **Activities**: Refine tests, add fixtures, fix flaky tests

### 55–60 min: Wrap-up
- **Goal**: Q&A and next steps
- **Activities**: CI/CD discussion, resources, questions

---

## Detailed Lesson Plan

### **Section 1: Setup (0-10 min)**

#### Talking Points
- "Welcome! Today we'll learn Playwright and AI-assisted test generation"
- "We'll be testing a real Angular insurance policy management app"
- "By the end, you'll be able to generate tests using AI agents"

#### Demo Script

```bash
# 1. Clone repository
git clone [REPO_URL]
cd playwright-workshop-codex/demo-app

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Start the dev server
npm start
```

**Checkpoint**: Open http://localhost:4222 in browser - everyone should see the app

```bash
# 5. Run existing tests
npx playwright test

# 6. View report
npx playwright show-report
```

**Checkpoint**: Tests should pass, report should open

#### Common Issues & Fixes

**Port already in use:**
```bash
lsof -ti:4222 | xargs kill -9
npm start
```

**Browsers not installing:**
```bash
npx playwright install --force
```

**npm install fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### **Section 2: Playwright Fundamentals (10-25 min)**

#### Talking Points
- "Playwright is a modern E2E testing framework"
- "Key advantages: auto-waiting, multi-browser, great developer experience"
- "Let's look at test structure and best practices"

#### Demo: Show Existing Test

Open `e2e/tests-examples/seed.spec.ts`:

```typescript
import { test, expect } from '../fixtures';

test.describe('Seed Test', () => {
  test('should clear existing policies', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Verify empty state
    await expect(page.getByText('No policies yet')).toBeVisible();
  });
});
```

**Explain:**
- Import from fixtures (custom helpers)
- `test.describe()` groups tests
- `async/await` for actions
- `expect()` for assertions
- Auto-waiting (no manual sleeps)

#### Demo: Selectors Priority

Show selector examples in VS Code:

```typescript
// ✅ Best - data-testid
await page.getByTestId('add-policy').click();

// ✅ Good - Role-based (accessibility)
await page.getByRole('button', { name: 'Submit' }).click();

// ⚠️ OK - Text content
await page.getByText('John Smith').click();

// ❌ Avoid - CSS selectors
await page.locator('.btn-primary').click();
```

**Key Message**: Use `data-testid` for stability

#### Interactive: Write a Simple Test

Guide attendees to create `my-test.spec.ts`:

```typescript
import { test, expect } from '../fixtures';

test('should have a title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Insurance/);
});
```

Run: `npx playwright test my-test`

**Checkpoint**: Everyone's test should pass

---

### **Section 3: AI Agents (25-45 min)**

#### Talking Points
- "Now the exciting part - AI-assisted test generation!"
- "We have 3 specialized agents: Planner, Generator, Healer"
- "Let's use them to build a full test suite"

#### Demo: Planner Agent (5 min)

**Show chatmodes in `.github/chatmodes/`**:
- `🎭 planner.chatmode.md`
- `🎭 generator.chatmode.md`
- `🎭 healer.chatmode.md`

**Open Copilot Chat** (Cmd+I):

```
@planner Generate a test plan for the policy app
```

**What happens:**
1. Planner opens browser
2. Navigates through app
3. Interacts with forms
4. Creates `test-plan.md`

**Show output**: Open generated `test-plan.md`

**Explain structure:**
- Test scenarios
- Steps
- Expected results
- Preconditions

**Key Message**: "Planner explores your app and documents test cases"

#### Demo: Generator Agent (10 min)

**In Copilot Chat**:

```
@generator Generate test for scenario #2: Create New Policy - Happy Path
```

**What happens:**
1. Generator reads test plan
2. Opens browser
3. Executes each step
4. Captures selectors
5. Creates test file

**Show output**: Open generated test file

**Walk through code:**
```typescript
// Step 1: Navigate
await policiesPage.goto();

// Step 2: Click add button
await page.getByTestId('add-policy').click();

// Step 3: Fill form
await page.getByTestId('policyNumber').fill('POL-001');
// ... more fields

// Step 4: Submit
await page.getByTestId('save').click();

// Step 5: Verify
await expect(page.getByText('POL-001')).toBeVisible();
```

**Run the test**:
```bash
npx playwright test create-policy-happy-path
```

**Checkpoint**: Test should pass

**Key Message**: "Generator converts test plans into working code"

#### Demo: Healer Agent (10 min)

**Introduce a failure** (edit the test to use wrong selector):

```typescript
// Break it intentionally
await page.getByTestId('wrong-selector').click();
```

**Run test**:
```bash
npx playwright test create-policy-happy-path
```

**Show failure** - element not found

**In Copilot Chat**:

```
@healer Fix the create-policy-happy-path test
```

**What happens:**
1. Healer runs test
2. Sees error
3. Inspects DOM
4. Updates selector
5. Re-runs to verify

**Show fixed code**:
```typescript
// Healer fixed it
await page.getByTestId('add-policy').click();
```

**Key Message**: "Healer automatically fixes broken tests"

#### Interactive: Generate More Tests (10 min)

Have attendees generate their own tests:

**Prompt ideas:**
```
@generator Generate test for scenario #3: Form Validation

@generator Generate test for deleting a policy

@generator Generate test for editing a policy
```

**Checkpoint**: Each person should have 2-3 generated tests

---

### **Section 4: Improve Tests (45-55 min)**

#### Talking Points
- "Generated tests are good, but we can make them better"
- "Let's apply best practices and fixtures"

#### Demo: Using Fixtures

**Show `e2e/fixtures.ts`**:

```typescript
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      async goto() { /* ... */ },
      async addPolicy(data) { /* ... */ }
    };
    await use(policiesPage);
  }
});
```

**Refactor a test to use fixtures**:

**Before:**
```typescript
await page.goto('/');
await page.getByTestId('add-policy').click();
await page.getByTestId('policyNumber').fill('POL-001');
// ... many lines
```

**After:**
```typescript
await policiesPage.goto();
await policiesPage.addPolicy({
  policyNumber: 'POL-001',
  customerName: 'John Doe',
  premium: 1500
});
```

**Key Message**: "Fixtures make tests cleaner and more maintainable"

#### Demo: Fixing Flaky Tests

**Show common flaky test pattern**:

```typescript
// ❌ Flaky - race condition
await page.click('#submit');
await expect(page.locator('.success')).toBeVisible();
```

**Fix it**:

```typescript
// ✅ Stable - proper waiting
await page.getByTestId('submit').click();
await page.waitForLoadState('networkidle');
await expect(page.getByTestId('success-message')).toBeVisible();
```

**Key Message**: "Use Playwright's auto-waiting, avoid arbitrary timeouts"

#### Interactive: Improve Your Tests

Have attendees:
1. Review their generated tests
2. Add fixtures if applicable
3. Run tests multiple times to check stability

---

### **Section 5: Wrap-up (55-60 min)**

#### Talking Points
- "You now have the skills to use Playwright and AI agents"
- "Let's talk about next steps"

#### CI/CD Integration

Show example GitHub Actions workflow:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Key Message**: "Easy to integrate with your CI/CD pipeline"

#### Resources

Share these resources:
- Workshop docs: `/docs`
- Playwright docs: https://playwright.dev
- Discord: https://aka.ms/playwright/discord
- GitHub: Workshop repository

#### Q&A

Common questions:

**Q: Can I use agents on my own app?**
A: Yes! The chatmodes work with any web application.

**Q: Do I need GitHub Copilot?**
A: For AI agents, yes. But Playwright itself doesn't require it.

**Q: How do I handle authentication?**
A: Use storage state to save auth cookies, or create an auth fixture.

**Q: What about API testing?**
A: Playwright can test APIs too! See `page.request` API.

**Q: How do I run tests in parallel?**
A: Configure `workers` in `playwright.config.ts`.

---

## Instructor Tips

### Before Workshop

- [ ] Test all commands on fresh clone
- [ ] Ensure dev server starts correctly
- [ ] Pre-generate some test examples
- [ ] Have backup test files ready
- [ ] Test Copilot chat modes work
- [ ] Prepare troubleshooting commands

### During Workshop

- [ ] Start recording (if applicable)
- [ ] Share screen with VS Code
- [ ] Use zoom for code visibility
- [ ] Pause for questions frequently
- [ ] Check chat for questions
- [ ] Have assistant monitor chat/issues

### After Workshop

- [ ] Share recording link
- [ ] Share completed code examples
- [ ] Send follow-up resources
- [ ] Collect feedback
- [ ] Update materials based on feedback

---

## Backup Plans

### If AI Agents Don't Work

**Plan B**: Show pre-recorded demo
**Plan C**: Manual test writing walkthrough

### If App Won't Start

**Plan B**: Use deployed version (prepare beforehand)
**Plan C**: Use different sample app

### If Tests Are Flaky

**Plan B**: Run in headed mode to show what's happening
**Plan C**: Use pre-recorded test runs

---

## Success Metrics

Workshop is successful if attendees can:

- ✅ Write a basic Playwright test
- ✅ Use @planner to explore an app
- ✅ Use @generator to create tests
- ✅ Use @healer to fix broken tests
- ✅ Understand selector best practices
- ✅ Know how to find help and resources

---

## Post-Workshop

### Follow-up Email Template

```
Subject: Playwright Workshop - Resources & Next Steps

Hi everyone,

Thanks for attending the Playwright + AI Agents workshop!

Resources:
- Workshop repo: [LINK]
- Documentation: /docs folder
- Playwright docs: https://playwright.dev

Next steps:
1. Try the AI agents on your own app
2. Integrate Playwright in your CI/CD
3. Join the Playwright Discord community

Questions? Reply to this email or open an issue in the workshop repo.

Happy testing!
[Your Name]
```

---

## Continuous Improvement

### Collect Feedback

- Survey after workshop
- Monitor GitHub issues
- Track completion rates
- Note common questions

### Update Materials

- Fix any bugs found
- Add missing documentation
- Update for new Playwright features
- Improve based on feedback

---

## Quick Command Reference for Demos

```bash
# Setup
npm install
npx playwright install
npm start

# Run tests
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui

# View results
npx playwright show-report
npx playwright show-trace trace.zip

# Code generation
npx playwright codegen localhost:4222

# AI Agents
@planner Generate test plan for policy app
@generator Generate test for scenario #2
@healer Fix create-policy test
```

---

Good luck with the workshop! 🎭