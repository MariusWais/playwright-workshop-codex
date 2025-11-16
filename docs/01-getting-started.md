# Getting Started

## Introduction

Welcome to the Codex Playwright workshop 2025! This guide will get you up and running in minutes. By the end, you'll have:
- ✅ Playwright installed and configured
- ✅ The demo application running
- ✅ Your first test executed
- ✅ AI agents set up (optional)

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)
- **Playwright Plugin for VSCode** (optional, for AI features) [Download here](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- **GitHub Copilot** (optional, for AI features)

## Quick Setup (5 minutes)

### Step 1: Clone and Install

```bash
# Clone the workshop repository
git clone https://github.com/MariusWais/playwright-workshop-codex.git
cd playwright-workshop-codex

# Install dependencies
npm install

# Install Playwright browsers (Chrome, Firefox, WebKit)
npx playwright install
```

### Step 2: Start the Demo Application

```bash
# Start the Angular dev server
npm start
```

The application will be available at: **http://localhost:4222**

Open your browser and verify you see the Insurance Policy Management app.

### Step 3: Run Your First Test

Open a new terminal (keep the dev server running) and run:

```bash
# Run all tests
npx playwright test

# Run tests with visible browser
npx playwright test --headed

# Run specific test file
npx playwright test e2e/tests-examples/seed.spec.ts
```

🎉 **Success!** If tests pass, you're ready to continue.

### Step 4: View Test Report

```bash
# Generate and open HTML report
npx playwright show-report
```

---

## Understanding the Project Structure

```
demo-app/
├── e2e/
│   ├── fixtures.ts              # Custom test fixtures
│   └── tests-examples/
│       └── seed.spec.ts         # Example seed test
├── src/
│   └── app/                     # Angular application
├── docs/                        # Workshop documentation
├── playwright.config.ts         # Playwright configuration
└── package.json
```

### Key Files

**`playwright.config.ts`** - Playwright configuration
```typescript
export default defineConfig({
  testDir: './e2e/tests-examples',
  use: {
    baseURL: 'http://localhost:4222',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm start',
    port: 4222,
    reuseExistingServer: true,
  },
});
```

**`e2e/fixtures.ts`** - Reusable test helpers
```typescript
// Custom fixtures for the policy app
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    // Setup page helpers
    const policiesPage = {
      async goto() { /* ... */ },
      async addPolicy(data) { /* ... */ }
    };
    await use(policiesPage);
  }
});
```

---

## Writing Your First Test

Create a new file: `e2e/tests-examples/my-first-test.spec.ts`

```typescript
import { test, expect } from '../fixtures';

test.describe('My First Tests', () => {
  test('should display the policies page', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Check the page title
    await expect(page).toHaveTitle(/Insurance Policies/i);
    
    // Verify heading is visible
    await expect(
      page.getByRole('heading', { name: 'Insurance Policies' })
    ).toBeVisible();
  });
  
  test('should have an add policy button', async ({ page }) => {
    await page.goto('/');
    
    // Find button by test ID
    const addButton = page.getByTestId('add-policy');
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('+ Add Policy');
  });
});
```

Run your test:
```bash
npx playwright test my-first-test
```

---

## AI Agents Setup (Optional)

The workshop includes three AI agents (chatmodes) for test automation:
- **🎭 Planner** - Explores app and creates test plans
- **🎭 Generator** - Generates test code from plans
- **🎭 Healer** - Fixes failing tests

### Prerequisites for AI Agents

- VS Code with GitHub Copilot installed
- Copilot Chat enabled
- Workshop repository open in VS Code

### Setting Up Chatmodes

The chatmodes are already configured in `.github/chatmodes/`:

```
.github/chatmodes/
├── 🎭 planner.chatmode.md
├── 🎭 generator.chatmode.md
└── 🎭 healer.chatmode.md
```

### Using AI Agents

1. **Open Copilot Chat** in VS Code (Ctrl+Cmd+I or Cmd+I)

2. **Activate an agent** by typing:
```
@planner Generate a test plan for the policy app
```

3. **The agent will**:
   - Navigate through your application in a browser
   - Document the flows and features
   - Generate a markdown test plan

See [Using AI Agents](03-using-ai-agents.md) for detailed examples.

### Troubleshooting AI Agents

**Chatmodes not appearing?**
- Ensure you're in the workshop repository folder
- Restart VS Code
- Check that `.github/chatmodes/` exists
- Verify GitHub Copilot is active

**Agents not working as expected?**
- Make sure the dev server is running (http://localhost:4222)
- Check that Playwright is installed: `npx playwright --version`
- Try restarting the chat session

---

## Running Tests in Different Modes

### Debug Mode
```bash
# Step through test execution
npx playwright test --debug
```

### UI Mode (Interactive)
```bash
# Visual test runner
npx playwright test --ui
```

### Headed Mode (See Browser)
```bash
# Watch tests run in browser
npx playwright test --headed
```

### Specific Browser
```bash
# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Watch Mode
```bash
# Re-run tests on file changes
npx playwright test --watch
```

---

## Configuration Options

Edit `playwright.config.ts` to customize:

### Change Base URL
```typescript
use: {
  baseURL: 'http://localhost:3000',  // Your app URL
}
```

### Increase Timeout
```typescript
use: {
  actionTimeout: 10000,  // 10 seconds
}
```

### Enable Video Recording
```typescript
use: {
  video: 'on',  // or 'retain-on-failure'
}
```

### Run Tests in Parallel
```typescript
workers: 4,  // Number of parallel workers
```

### Add Retries for Flaky Tests
```typescript
retries: process.env.CI ? 2 : 0,  // Retry twice in CI
```

---

## Understanding Test Output

### Test Results

```
Running 3 tests using 3 workers

  ✓  1 seed.spec.ts:4:7 › should clear existing policies (234ms)
  ✓  2 my-first-test.spec.ts:4:7 › should display the policies page (156ms)
  ✓  3 my-first-test.spec.ts:12:7 › should have an add policy button (98ms)

  3 passed (1.2s)
```

- ✓ = Passed
- ✗ = Failed
- ○ = Skipped

### Viewing Failures

When a test fails:
```bash
# View trace file
npx playwright show-trace test-results/my-test/trace.zip

# View screenshot
open test-results/my-test/test-failed-1.png
```

---

## Common Commands Cheat Sheet

```bash
# Installation
npm install                          # Install dependencies
npx playwright install              # Install browsers

# Running Tests
npx playwright test                 # Run all tests
npx playwright test --headed        # Show browser
npx playwright test --debug         # Debug mode
npx playwright test --ui            # UI mode
npx playwright test file.spec.ts   # Run specific file

# Code Generation
npx playwright codegen localhost:4222  # Record actions

# Reports and Traces
npx playwright show-report          # HTML report
npx playwright show-trace trace.zip # View trace

# Application
npm start                           # Start dev server
npm run build                       # Build app
```

---

## Next Steps

Now that you have Playwright running:

1. ✅ **Explore the Demo App** - Click around at http://localhost:4222
2. ✅ **Run Existing Tests** - See `e2e/tests-examples/seed.spec.ts`
3. ✅ **Learn AI Agents** - See [AI Agents Workflow](02-ai-agents-workflow.md)
4. ✅ **Write More Tests** - See [Test Writing Guide](04-test-writing-guide.md)
5. ✅ **Try the Agents** - See [Using AI Agents](03-using-ai-agents.md)

---

## Troubleshooting

### Port 4222 Already in Use

```bash
# Find and kill process
lsof -ti:4222 | xargs kill -9

# Or start on different port
npm start -- --port 4223
```

### Tests Timing Out

Increase timeout in `playwright.config.ts`:
```typescript
use: {
  actionTimeout: 30000,  // 30 seconds
}
```

### Browsers Not Installed

```bash
npx playwright install
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Application Not Loading

Check that:
- Dev server is running (`npm start`)
- Port 4222 is accessible
- No firewall blocking localhost
- Node.js version is 18+

---

## Getting Help

- **Documentation**: See other guides in `/docs`
- **Playwright Docs**: https://playwright.dev
- **Workshop Issues**: GitHub repository issues
- **Community**: Playwright Discord

---

## What's Next?

Continue your learning journey:

➡️ **Next**: [AI Agents Workflow](02-ai-agents-workflow.md) - Learn how to use AI to generate tests

Or jump to specific topics:
- [Using AI Agents](03-using-ai-agents.md) - Practical examples
- [Test Writing Guide](04-test-writing-guide.md) - Best practices
- [Page Objects & Fixtures](05-page-objects-and-fixtures.md) - Advanced patterns

Happy testing! 🎭
