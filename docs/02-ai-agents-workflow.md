# Playwright Agents Architecture Overview

## Introduction

The Playwright AI-Assisted Testing workflow introduces three specialized AI agents (chatmodes) that transform how we approach test automation. Instead of writing tests manually, we use AI to explore applications, generate test plans, create executable tests, and automatically fix failures.

This architecture emerged from real-world experience with Playwright and represents a paradigm shift in test automation - moving from manual test writing to AI-assisted test generation and maintenance.

## The Three-Agent Workflow

### 🎭 Planner Agent

**Purpose**: Application exploration and test plan generation

**What it does**:
- Navigates through your application like a real user
- Discovers UI flows, forms, navigation patterns, and edge cases
- Generates comprehensive markdown test plans with scenarios and steps
- Documents expected behaviors and validation points

**When to use**:
- Starting a new testing project
- Exploring unfamiliar features
- Creating comprehensive test coverage documentation
- Planning regression test suites

**Output**: Structured markdown files with test scenarios, steps, and expected results

**Example workflow**:
```bash
# Activate planner mode
@planner Explore the policy management app and create a test plan

# Planner will:
# 1. Navigate through the application
# 2. Interact with forms, buttons, and navigation
# 3. Document all discovered flows
# 4. Generate test-plan.md with complete scenarios
```

**Key characteristics**:
- Uses browser automation to interact with the live app
- Creates human-readable test documentation
- No code generation - focuses on test design
- Can be reviewed by non-technical stakeholders (BAs, PMs)

---

### 🎭 Generator Agent

**Purpose**: Converting test plans into executable Playwright code

**What it does**:
- Reads markdown test plans created by Planner
- Executes test steps in a real browser
- Captures selectors and interactions as they happen
- Generates production-ready Playwright test files

**When to use**:
- After Planner has created test plans
- When converting manual test cases to automation
- Generating tests for specific scenarios

**Output**: TypeScript/JavaScript test files with proper structure and assertions

**Example workflow**:
```bash
# After planner creates test-plan.md
@generator Generate test for "Create New Policy - Happy Path"

# Generator will:
# 1. Read the test plan scenario
# 2. Execute each step in the browser
# 3. Capture getByTestId(), getByRole() selectors
# 4. Generate test file with assertions
# 5. Follow fixture patterns if they exist
```

**Key characteristics**:
- Generates ONE test per file in a describe block
- Uses comments matching test plan steps
- Follows project conventions (fixtures, page objects)
- Prefers `data-testid` attributes for stability
- Includes proper waits and assertions

**Generated test structure**:
```typescript
import { test, expect } from '../fixtures';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Step 1: Navigate to page
    await page.goto('/');
    
    // Step 2: Fill form field
    await page.getByTestId('input-field').fill('value');
    
    // Step 3: Submit form
    await page.getByTestId('submit-button').click();
    
    // Step 4: Verify result
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

---

### 🎭 Healer Agent

**Purpose**: Debugging and fixing failing tests automatically

**What it does**:
- Runs tests and captures failures
- Analyzes error messages and screenshots
- Updates selectors when UI changes
- Fixes timing issues and race conditions
- Marks unfixable tests with `test.fixme()` and explanations

**When to use**:
- Tests fail after UI changes
- Flaky tests appear
- After major refactoring
- CI/CD pipeline shows test failures

**Output**: Updated test files with fixed selectors and logic

**Example workflow**:
```bash
# When tests fail
@healer Fix the create-policy test

# Healer will:
# 1. Run the failing test
# 2. Capture error screenshots
# 3. Inspect current DOM structure
# 4. Update selectors (e.g., data-testid changes)
# 5. Add proper waits if timing issues exist
# 6. Re-run to verify fix
```

**Key characteristics**:
- Iterative debugging approach
- Uses browser DevTools to inspect elements
- Can handle multiple types of failures:
  - Selector changes
  - Timing issues
  - Assertion failures
  - Navigation problems
- Uses `test.fixme()` when tests can't be automatically fixed
- Documents why tests can't be fixed

**Common fixes**:
```typescript
// Before (broken selector)
await page.getByTestId('old-id').click();

// After (healer updates)
await page.getByTestId('new-id').click();

// Before (race condition)
await page.click('button');
await expect(page.getByText('Success')).toBeVisible();

// After (healer adds wait)
await page.click('button');
await page.waitForLoadState('networkidle');
await expect(page.getByText('Success')).toBeVisible();
```

---

## Workflow Integration

### Typical Development Cycle

```
1. PLAN
   @planner → Explore app → Generate test-plan.md

2. GENERATE
   @generator → Read test plan → Generate tests/*.spec.ts

3. RUN
   npx playwright test → Tests pass ✅

4. CODE CHANGES
   Developer updates UI → Tests fail ❌

5. HEAL
   @healer → Analyze failures → Fix tests → Tests pass ✅

6. ITERATE
   Repeat as application evolves
```

### Sequential Workflow

**Best for**: New features, comprehensive test coverage

```bash
# Step 1: Exploration
@planner Generate test plan for the entire policy app

# Step 2: Generate all tests
@generator Generate test for scenario #1
@generator Generate test for scenario #2
@generator Generate test for scenario #3

# Step 3: Run and fix
npx playwright test
@healer Fix any failing tests
```

### Parallel Workflow

**Best for**: Specific features, quick test creation

```bash
# Generate specific test without full exploration
@generator Create test for user login flow

# If it fails
@healer Fix the login test
```

---

## Architecture Benefits

### 1. **Speed**
- Generate tests in minutes, not hours
- Automatic exploration saves manual discovery time
- Instant test repairs when UI changes

### 2. **Quality**
- Tests follow best practices automatically
- Consistent structure across all tests
- Proper use of fixtures and page objects

### 3. **Maintainability**
- Self-healing tests reduce maintenance burden
- Clear comments map test steps to requirements
- Easy to understand and modify generated code

### 4. **Collaboration**
- Test plans are readable by non-developers
- BAs and QAs can review test scenarios
- Generated tests match documented behavior

### 5. **Learning**
- New team members learn Playwright patterns
- Generated code demonstrates best practices
- Comments explain why code works

---

## Technical Implementation

### Chat Modes (.github/chatmodes/)

Each agent is implemented as a custom chat mode:

```
.github/chatmodes/
├── 🎭 planner.chatmode.md    # Exploration & planning
├── 🎭 generator.chatmode.md  # Test generation
└── 🎭 healer.chatmode.md     # Test fixing
```

Chat modes contain:
- Agent personality and focus
- Specific instructions for the task
- Tool preferences (browser automation, code generation)
- Output format expectations

### Custom Fixtures (e2e/fixtures.ts)

Generator uses project-specific fixtures:

```typescript
// Fixtures encapsulate common workflows
export const test = base.extend<PolicyFixtures>({
  policiesPage: async ({ page }, use) => {
    const policiesPage = {
      goto: async () => { /* ... */ },
      addPolicy: async (data) => { /* ... */ },
      verifyPolicyInList: async (id) => { /* ... */ }
    };
    await use(policiesPage);
  }
});
```

Benefits:
- DRY tests (Don't Repeat Yourself)
- Consistent workflows
- Easy to update when flows change

---

## Real-World Experience

### What Works Well

✅ **Rapid test creation**: Generate 10-15 tests in an hour
✅ **UI exploration**: Discover edge cases you might miss manually
✅ **Selector stability**: Prefers `data-testid` for reliability
✅ **Self-documenting**: Comments make tests readable
✅ **Pattern learning**: Follows existing test conventions

### Current Limitations

⚠️ **Complex interactions**: Multi-step workflows may need manual refinement
⚠️ **Dynamic content**: Generated selectors may need adjustment
⚠️ **Test data**: May need to add proper test data management
⚠️ **Assertions**: Sometimes too generic, need specific business logic validation

### Best Practices Learned

1. **Start with data-testid attributes**: Add them to your app before generating tests
2. **Review generated tests**: AI is good but not perfect
3. **Use fixtures**: Define common workflows before generation
4. **Seed data properly**: Create a seed test that sets up clean state
5. **Iterate quickly**: Generate → Run → Heal → Repeat

---

## Getting Started

### Prerequisites

```bash
# 1. Install dependencies
npm install @playwright/test

# 2. Install browsers
npx playwright install

# 3. Setup Playwright agents (if using VS Code extension)
# Follow playwright-agents-setup.md
```

### Quick Start

```bash
# 1. Start your application
npm start

# 2. Plan tests
@planner Explore the app and create a test plan

# 3. Generate tests from plan
@generator Generate test for scenario #2

# 4. Run tests
npx playwright test

# 5. Fix any failures
@healer Fix failing tests
```

---

## Advanced Topics

### Custom Agent Behavior

Modify chat modes to fit your needs:
- Adjust selector preferences (prefer role vs testid)
- Change test structure (BDD style vs traditional)
- Add custom validation patterns
- Include specific assertions for your domain

### Integration with CI/CD

```yaml
# .github/workflows/test.yml
- name: Run Playwright tests
  run: npx playwright test
  
- name: Auto-heal on failure
  if: failure()
  run: |
    # Optionally trigger healer agent
    # This requires additional setup
```

### Test Plan Templates

Create templates for common scenarios:
- CRUD operations
- Form validations
- User authentication flows
- Error handling
- Edge cases

---

## Conclusion

The three-agent architecture (Planner → Generator → Healer) represents a fundamental shift in test automation:

- **From manual to AI-assisted**: Let AI do the heavy lifting
- **From brittle to self-healing**: Tests fix themselves when UI changes
- **From code-first to plan-first**: Document behavior before automation
- **From isolated to collaborative**: Test plans bridge technical and non-technical teams

This approach is particularly powerful for:
- Teams new to Playwright
- Projects with frequent UI changes
- Organizations wanting faster test coverage
- Anyone tired of maintaining brittle tests

The agents don't replace human expertise - they amplify it, allowing you to focus on test strategy while AI handles the repetitive work of test creation and maintenance.