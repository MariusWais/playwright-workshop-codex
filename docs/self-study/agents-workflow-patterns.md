# AI Agents: Workflow Patterns

Real-world workflow patterns and development cycles using Planner, Generator, and Healer.

---

## Typical Development Cycle

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

---

## Sequential Workflow

**Best for**: New features, comprehensive test coverage

When you want thorough, exploratory test creation:

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

**Advantages:**
- Comprehensive coverage
- Better understanding of edge cases
- Generated tests capture complex workflows

**Disadvantages:**
- Takes more time upfront
- More tests to review

---

## Parallel Workflow

**Best for**: Specific features, quick test creation

When you need fast test generation for targeted features:

```bash
# Generate specific test without full exploration
@generator Create test for user login flow

# If it fails
@healer Fix the login test
```

**Advantages:**
- Fast test creation
- Focused on specific features
- Less overhead

**Disadvantages:**
- May miss edge cases
- Limited context about app behavior

---

## Hybrid Workflow

**Best for**: Ongoing maintenance, mixed coverage

Combine both approaches for optimal results:

```bash
# 1. Initial comprehensive planning (sequential)
@planner Generate complete test plan for policy management

# 2. Generate tests for core features (sequential)
@generator Generate tests for: create, edit, delete scenarios

# 3. Quick tests for new endpoints (parallel)
@generator Create test for new API endpoint

# 4. Heal as needed
@healer Fix failing tests
```

---

## Common Patterns

### Pattern 1: Test New Feature

```bash
# You added a new "Export to PDF" button

# Option A: Fast track
@generator Create test for export to PDF functionality
Use fixtures and selector constants for maintainability
npx playwright test export.spec.ts
@healer Fix if needed

# Option B: Thorough approach
@planner Create test plan for new PDF export feature
@generator Generate test for: PDF export happy path
@generator Generate test for: Export with no data
Reuse existing fixtures and selector constants
npx playwright test
@healer Fix any issues
```

### Pattern 2: Fix Broken Tests After UI Change

```bash
# You redesigned the form UI

# Run tests to see what breaks
npx playwright test

# Let Healer fix the issues
@healer Fix all failing tests due to form redesign

# Review and commit fixes
```

### Pattern 3: Comprehensive Test Suite for New Feature

```bash
# You're implementing a new "Report" feature

# Step 1: Planner explores and plans
@planner Create comprehensive test plan for reports feature

# Step 2: Generator creates tests from plan
@generator Generate test for scenario: Generate monthly report
@generator Generate test for scenario: Export report as CSV
Reuse fixtures and selector constants for consistency
@generator Generate test for scenario: Schedule recurring report
Extend fixtures with scheduling methods if needed

# Step 3: Run and review
npx playwright test --headed

# Step 4: Fix any issues
@healer Fix any selector or timing issues

# Step 5: Commit with confidence
git add . && git commit -m "feat: complete report feature tests"
```

### Pattern 4: Regression Testing After Refactor

```bash
# You refactored form handling code
# Selectors didn't change, but timing might be different

# Run existing tests
npx playwright test

# Healer handles any timing-related failures
@healer Fix any timing issues from refactored form code

# Commit
git add . && git commit -m "refactor: form handling code"
```

---

## When to Use Each Workflow

### Use **Sequential** when:
- Building a new feature from scratch
- Need comprehensive test coverage
- Have time for thorough testing
- Want to discover all edge cases
- Creating tests for critical user paths

### Use **Parallel** when:
- Adding quick tests for specific scenarios
- Have limited time for test creation
- Testing small, isolated features
- Don't need exhaustive coverage
- Running quick verification tests

### Use **Hybrid** when:
- Maintaining an existing test suite
- Adding new tests alongside old ones
- Balancing speed with thoroughness
- Have mixed coverage requirements

---

## Tips for Effective Workflows

### Before You Start

1. **Ensure app is stable**
   ```bash
   npm start
   # Visit http://localhost:4222 manually
   # Verify basic functionality works
   ```

2. **Check selectors are available**
   - Look for `data-testid` attributes in your app
   - If missing, add them first (faster than fixing later)

3. **Have test-plan.md ready** (for sequential)
   - Review the generated plan before generating tests

### During Generation

1. **Be specific in prompts**
   ```
   # Bad
   @generator Create tests
   
   # Good
   @generator Create test for: Create New Policy with all required fields
   
   # Best
   @generator Create test for: Create New Policy with all required fields
   Use policiesPage.addPolicy() fixture method
   Abstract all data-testid selectors to SELECTORS constant in constants/selectors.ts
   ```

2. **One scenario per generation**
   - Easier to review
   - Easier to fix if something breaks
   - Better test isolation
   - Specify architecture goals like using fixtures or constants for testids

3. **Run tests after each generation** (optional but helpful)
   ```bash
   @generator Generate test for scenario #1
   npx playwright test scenario1.spec.ts
   @generator Generate test for scenario #2
   ```

### After Generation

1. **Review generated tests**
   - Check assertions are correct
   - Verify test data makes sense
   - Look for hard-coded values that should be dynamic
   - Confirm all selectors are abstracted to constants
   - Verify fixtures are being used appropriately

2. **Fix common issues**
   - Wrong selectors → `@healer Fix the test`
   - Timing issues → Run `--debug` to see where it fails
   - Missing setup → Add to fixtures

3. **Commit frequently**
   ```bash
   git add . && git commit -m "test: add create policy tests"
   git add . && git commit -m "test: add policy editing tests"
   ```

---

## Handling Failures

### When Tests Fail

```bash
# See what broke
npx playwright test

# Option 1: Healer can fix it
@healer Fix the create-policy test

# Option 2: Debug manually
npx playwright test --debug

# Option 3: Use UI mode to inspect
npx playwright test --ui
```

### When Healer Can't Fix It

Sometimes Healer needs more information:

```bash
# Share the actual error
@healer Fix the policy test
Error: Element not found "policy-form"
Selector used: getByTestId('policy-form')

# Describe what changed
@healer Fix the edit test
The form was redesigned, old elements no longer exist
```

### When to Fix Manually

```typescript
// Healer might not understand complex business logic
// You might need to add custom assertions

// Generated code:
await expect(page.getByText('Policy saved')).toBeVisible();

// You update to be more specific:
await expect(page.getByText('Policy saved successfully')).toBeVisible();
await expect(policiesPage.getLastPolicyRow()).toContainText('Active');
```

---

## Integration with Git Workflow

### Commit Strategy

```bash
# After each generation round
git add e2e/tests-examples/
git commit -m "test: add new policy feature tests"

# After healing
git add e2e/tests-examples/
git commit -m "test: fix selectors after UI redesign"

# Clean separation of concerns
git add e2e/tests-examples/
git commit -m "test: update assertions for policy form"
```

### PR Review for Generated Tests

When reviewing PR with AI-generated tests:

1. **Check test names** - Are they descriptive?
2. **Review assertions** - Do they validate correct behavior?
3. **Verify setup** - Does `beforeEach` or fixtures handle setup?
4. **Look for maintainability** - Will this be easy to update?
5. **Test manually** - Do tests actually pass? Do they catch bugs?

---

## Continuous Improvement

### Track What Works

- Which prompts generate the best tests?
- What fixtures are most useful?
- Which scenarios Healer fixes easily vs struggles with?

### Adapt Your Approach

- If Planner misses edge cases → Be more specific in prompts
- If Generator creates brittle tests → Add more data-testid attributes
- If Healer struggles → Review the generated test first

### Share Best Practices

- Document effective prompts
- Share fixture patterns
- Record common Healer fixes
- Create test plan templates
