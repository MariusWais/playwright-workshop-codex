# Using AI Agents - Practical Guide

## Introduction

This guide provides hands-on examples for using the three AI agents: **Planner**, **Generator**, and **Healer**. Each section includes real prompts, expected outputs, and tips for getting the best results.

## Prerequisites

- ✅ Dev server running (`npm start`)
- ✅ VS Code with GitHub Copilot
- ✅ Workshop repository open
- ✅ Chatmodes configured in `.github/chatmodes/`

---

## 🎭 Planner Agent

### What Does Planner Do?

The Planner agent:
- Opens your application in a browser
- Navigates through pages and features
- Interacts with forms, buttons, and navigation
- Documents all discovered flows
- Generates comprehensive test plans in markdown

### When to Use Planner

- ✅ Starting a new testing project
- ✅ Exploring unfamiliar features
- ✅ Creating test coverage documentation
- ✅ Planning regression test suites
- ✅ Discovering edge cases

### Example Prompts

#### Basic Exploration

```
@planner Generate a test plan for the policy app
```

**What happens:**
1. Planner navigates to http://localhost:4222
2. Explores the empty state
3. Clicks "Add Policy" button
4. Fills out the form
5. Tests edit and delete operations
6. Documents all findings

**Output:** `test-plan.md` with comprehensive test scenarios

#### Focused Exploration

```
@planner Generate a test plan for managing insurance policies. 
Include scenarios for: add, edit, delete, view details, and persistence after reload.
```

**Output:** Test plan focused on CRUD operations

#### Validation Testing

```
@planner Create a test plan that checks form validation for required fields 
and invalid premium numbers.
```

**Output:** Test plan focused on validation scenarios

#### Comprehensive Coverage

```
@planner Explore the entire policy management app and create a comprehensive 
test plan covering:
- Empty state display
- Creating policies with various data
- Editing existing policies
- Deleting policies with and without confirmation
- Form validation and error messages
- Data persistence across page reloads
- Edge cases like very long names or large premium amounts
```

**Output:** Detailed test plan with 15+ scenarios

### Tips for Better Planner Results

✅ **Be specific about what to test**
```
# ❌ Vague
@planner Test the app

# ✅ Specific
@planner Generate a test plan for the policy form validation, 
focusing on required fields and error messages
```

✅ **Mention edge cases you care about**
```
@planner Create a test plan including edge cases like:
- Very long customer names (100+ characters)
- Negative premium amounts
- End date before start date
- Special characters in policy numbers
```

✅ **Specify user flows**
```
@planner Map out the complete user journey from:
1. Landing on empty state
2. Adding first policy
3. Editing the policy
4. Deleting it
5. Returning to empty state
```

### Planner Output Structure

Planner generates test plans with this structure:

```markdown
# Test Plan Title

## Overview
- Application description
- Key features
- Test objectives

## Test Scenarios

### Scenario 1: Name

**Objective**: What we're testing

**Preconditions**: Required setup

**Steps**:
1. Step one
2. Step two
3. Step three

**Expected Results**:
- Result 1
- Result 2

---

### Scenario 2: Name
...
```

### What to Do with Planner Output

1. **Review the test plan** - Check if it covers your needs
2. **Refine if needed** - Ask Planner to add missing scenarios
3. **Share with team** - Test plans are human-readable
4. **Use with Generator** - Feed test plans to Generator agent

---

## 🎭 Generator Agent

### What Does Generator Do?

The Generator agent:
- Reads test plans created by Planner (or manual specs)
- Executes test steps in a real browser
- Captures selectors as actions are performed
- Generates production-ready Playwright test files
- Follows project conventions (fixtures, patterns)

### When to Use Generator

- ✅ After Planner creates test plans
- ✅ Converting manual test cases to automation
- ✅ Generating tests for specific scenarios
- ✅ Creating tests from BDD specs

### Example Prompts

#### Generate from Test Plan

```
@generator Generate test for "Create New Policy - Happy Path"
```

**Prerequisites:** 
- Test plan exists with that scenario
- Dev server is running

**What happens:**
1. Generator reads the test plan
2. Opens browser to http://localhost:4222
3. Executes each step from the plan
4. Captures selectors (`data-testid`, roles)
5. Generates test file with assertions

**Output:** `e2e/tests-examples/create-policy-happy-path.spec.ts`

#### Generate with Specific Requirements

```
@generator Generate test for scenario #2 from the test plan.
Use only data-testid selectors and ensure all assertions verify visible elements.
```

**Output:** Test using `getByTestId()` exclusively

#### Generate from Custom Spec

```
@generator Create a test that:
1. Clears existing policies
2. Creates three policies with different data
3. Verifies all three appear in the table
4. Edits the second policy
5. Verifies the changes
```

**Output:** Custom test following your specifications

#### Generate for Validation

```
@generator Generate test for form validation scenario:
1. Navigate to add policy form
2. Click in each required field without entering data
3. Verify error messages appear
4. Verify submit button remains disabled
```

**Output:** Validation-focused test

### Generated Test Structure

Generator creates tests with this pattern:

```typescript
import { test, expect } from '../fixtures';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page, policiesPage }) => {
    // Step 1: Setup/navigation
    await policiesPage.goto();
    
    // Step 2: Perform action
    await page.getByTestId('add-policy').click();
    
    // Step 3: Fill form
    await page.getByTestId('policyNumber').fill('POL-001');
    await page.getByTestId('customerName').fill('John Smith');
    
    // Step 4: Submit
    await page.getByTestId('save').click();
    
    // Step 5: Verify
    await expect(page).toHaveURL('/policies');
    await expect(page.getByText('POL-001')).toBeVisible();
  });
});
```

### Tips for Better Generator Results

✅ **Reference specific scenarios by name or number**
```
# ❌ Vague
@generator Generate tests from the test plan

# ✅ Specific
@generator Generate test for scenario #2: "Create New Policy - Happy Path"
```

✅ **Specify selector preferences**
```
@generator Generate test using only getByTestId selectors
@generator Generate test preferring getByRole for accessibility
```

✅ **Request specific patterns**
```
@generator Generate test using the policiesPage fixture for navigation
```

✅ **Mention edge cases to handle**
```
@generator Generate test that handles the confirmation dialog when deleting
```

### What to Do with Generated Tests

1. **Review the code** - Ensure it matches expectations
2. **Run the test** - Verify it passes
3. **Refine if needed** - Ask Generator to adjust
4. **Commit to repo** - Add to version control

---

## 🎭 Healer Agent

### What Does Healer Do?

The Healer agent:
- Runs failing tests
- Analyzes error messages and screenshots
- Inspects current DOM structure
- Updates selectors when UI changes
- Fixes timing issues
- Re-runs to verify fixes
- Marks unfixable tests with `test.fixme()`

### When to Use Healer

- ✅ Tests fail after UI changes
- ✅ Selector changes (data-testid updates)
- ✅ Flaky tests appear
- ✅ After major refactoring
- ✅ CI/CD pipeline shows failures

### Example Prompts

#### Fix Specific Test

```
@healer Fix the create-policy-happy-path test
```

**What happens:**
1. Healer runs the test
2. Captures error and screenshot
3. Inspects the current page structure
4. Identifies the problem (e.g., selector changed)
5. Updates the test code
6. Runs again to verify fix

**Common fixes:**
- Updated `data-testid` values
- Added waits for async operations
- Fixed navigation expectations
- Corrected assertion text

#### Fix All Failing Tests

```
@healer Fix all failing tests in e2e/tests-examples/
```

**Output:** Multiple test files updated

#### Fix with Specific Instructions

```
@healer Fix failing tests. If timing issues exist, add appropriate waits 
rather than arbitrary timeouts. Prefer waitForLoadState over waitForTimeout.
```

**Output:** Tests fixed with proper waiting strategies

#### Fix and Explain

```
@healer Fix the policy-crud.spec.ts test and summarize what selectors changed 
and why the test was failing.
```

**Output:** Fixed test + explanation of changes

### Example Healing Scenarios

#### Scenario 1: Selector Changed

**Before (failing):**
```typescript
await page.getByTestId('old-submit-button').click();
```

**Error:**
```
Error: element not found: getByTestId('old-submit-button')
```

**After (healed):**
```typescript
await page.getByTestId('save').click();  // Selector updated
```

#### Scenario 2: Timing Issue

**Before (failing):**
```typescript
await page.click('#submit');
await expect(page.locator('.success')).toBeVisible();
```

**Error:**
```
Timeout waiting for element to be visible
```

**After (healed):**
```typescript
await page.getByTestId('submit').click();
await page.waitForLoadState('networkidle');  // Added wait
await expect(page.getByTestId('success-message')).toBeVisible();
```

#### Scenario 3: Navigation Changed

**Before (failing):**
```typescript
await page.click('#save');
await expect(page).toHaveURL('/dashboard');
```

**Error:**
```
Expected URL to be '/dashboard', received '/policies'
```

**After (healed):**
```typescript
await page.getByTestId('save').click();
await expect(page).toHaveURL('/policies');  // Corrected URL
```

#### Scenario 4: Unfixable Test

**Before (failing):**
```typescript
test('check database state', async ({ page }) => {
  // Test relies on specific database data that no longer exists
});
```

**After (healed):**
```typescript
test.fixme('check database state', async ({ page }) => {
  // FIXME: Test relies on specific database seed data that was removed.
  // Needs to be updated with new test data strategy.
});
```

### Tips for Better Healer Results

✅ **Be specific about the problem**
```
# ❌ Vague
@healer Fix tests

# ✅ Specific
@healer Fix the create-policy test that's failing due to "element not found" error
```

✅ **Provide context**
```
@healer The UI was recently updated with new data-testid attributes. 
Fix the failing tests by updating selectors.
```

✅ **Set constraints**
```
@healer Fix timing issues without using waitForTimeout. 
Use waitForLoadState or waitForSelector instead.
```

✅ **Request explanations**
```
@healer Fix the test and explain what was wrong and how you fixed it
```

### What to Do After Healing

1. **Review changes** - Understand what was fixed
2. **Run tests again** - Ensure they're stable
3. **Look for patterns** - If many tests need similar fixes, update fixtures
4. **Commit changes** - Save the fixes

---

## Complete Workflow Example

### End-to-End Test Generation

#### Step 1: Explore and Plan

```
@planner Generate a comprehensive test plan for the insurance policy app. 
Cover CRUD operations, validation, empty states, and data persistence.
```

**Output:** `test-plan.md` with 15 scenarios

#### Step 2: Generate Tests

```
@generator Generate test for scenario #1: Empty State Display
```

```
@generator Generate test for scenario #2: Create New Policy - Happy Path
```

```
@generator Generate test for scenario #3: Form Validation
```

**Output:** Three test files in `e2e/tests-examples/`

#### Step 3: Run Tests

```bash
npx playwright test
```

**Result:** 2 passed, 1 failed (validation test)

#### Step 4: Heal Failures

```
@healer Fix the form validation test that's failing
```

**Output:** Updated test with corrected selectors

#### Step 5: Verify

```bash
npx playwright test
```

**Result:** 3 passed ✅

---

## Best Practices

### For Planner

✅ **Start broad, then refine**
```
1. @planner Generate initial test plan
2. Review output
3. @planner Add edge cases for form validation
```

✅ **Be explicit about requirements**
- Mention specific user flows
- List edge cases
- Specify error scenarios

✅ **Use Planner output for documentation**
- Share with BAs and PMs
- Review in team meetings
- Keep as living documentation

### For Generator

✅ **Use fixtures when available**
```
@generator Use the policiesPage fixture for common operations
```

✅ **Request specific patterns**
```
@generator Follow the Page Object pattern
```

✅ **Generate one test at a time**
- Easier to review
- Faster feedback
- Better quality

### For Healer

✅ **Run tests first to see failures**
```bash
npx playwright test  # See what's broken
```

✅ **Fix in batches**
- Fix tests in same feature together
- Look for common patterns

✅ **Review healed code**
- Understand what changed
- Learn from fixes
- Update fixtures if needed

---

## Troubleshooting

### Agents Not Responding

**Check:**
- Dev server is running
- You're in the correct directory
- Chatmodes exist in `.github/chatmodes/`
- GitHub Copilot is active

### Planner Can't Navigate App

**Fix:**
```bash
# Restart dev server
npm start

# Check app is accessible
open http://localhost:4222
```

### Generator Creates Wrong Selectors

**Refine:**
```
@generator Regenerate using data-testid attributes only
```

### Healer Can't Fix Test

**Manual intervention needed:**
- Review the test logic
- Check if requirements changed
- Update fixtures if workflow changed

---

## Quick Reference

### Planner Prompts
```
@planner Generate test plan for [feature]
@planner Explore [specific flow] and document edge cases
@planner Create test plan focusing on [validation/errors/happy path]
```

### Generator Prompts
```
@generator Generate test for scenario #[N]
@generator Create test for [description]
@generator Generate test using [specific pattern]
```

### Healer Prompts
```
@healer Fix [test-name]
@healer Fix all failing tests
@healer Fix [test] and explain the changes
```

---

## Next Steps

Now that you know how to use the AI agents:

1. ✅ **Practice** - Try each agent on the demo app
2. ✅ **Combine** - Use all three in sequence
3. ✅ **Refine** - Learn what prompts work best
4. ✅ **Apply** - Use on your own applications

**Continue learning:**
- [Test Writing Guide](04-test-writing-guide.md) - Improve generated tests
- [Page Objects & Fixtures](05-page-objects-and-fixtures.md) - Better structure
- [Debugging Flaky Tests](06-debugging-flaky-tests.md) - Make tests stable

Happy automating! 🎭