# Using AI Agents

Learn the complete workflow: Planner → Generator → Healer → Run → Iterate

---

## The Three AI Agents

### Planner: `@planner Generate a test plan for the policy app`
**What**: Explores your app and creates test scenarios in markdown  
**Output**: `test-plan.md` with detailed scenarios and steps

### Generator: `@generator Generate test for: Create New Policy`
**What**: Converts test plans into executable test code  
**Output**: `.spec.ts` test files ready to run

### Healer: `@healer Fix the create-policy test`
**What**: Automatically fixes failing tests  
**Output**: Updated tests with fixed selectors and timing

---

## Step-by-Step Workflow

### 1. Create Test Plan (Planner)

Open Copilot Chat (Ctrl+Shift+I):

```
@planner Generate a test plan for the policy app
```

Planner explores your app and creates `test-plan.md` with scenarios.

**Pro tips:**
- Be specific: `@planner Generate a test plan for creating and editing policies`
- Include edge cases: `@planner Include form validation and error handling`
- Map user flows: `@planner Map the complete journey: create → edit → delete`

---

### 2. Generate Tests (Generator)

After reviewing the test plan:

```
@generator Generate test for: Create New Policy
```

Generator creates a `.spec.ts` file ready to run.

**Pro tips:**
- Specify selectors: `@generator using data-testid selectors`
- Generate multiple: `@generator Generate tests for all scenarios in test-plan.md`

---

### 3. Run Tests

```bash
npx playwright test --headed
```

Tests run with browser visible. Report opens automatically.

**Other useful commands:**
```bash
npx playwright test --debug     # Step through each action
npx playwright test --ui        # Interactive UI mode
npx playwright test file.spec   # Run specific file
```

---

### 4. Fix Issues (Healer)

If tests fail:

```
@healer Fix the create-policy test
```

Healer analyzes errors and updates the test code.

**Pro tips:**
- Include error details: `@healer Error: Element not found 'save-button'`
- Describe the issue: `@healer Fix timing issue where click doesn't register`
- Multiple tests: `@healer Fix all failing tests`

---

### 5. Iterate

Run tests again → if failures remain → run Healer again → repeat

---

## Quick Reference: Commands & Tips

### AI Agent Commands

**Planner Examples:**
```
@planner Generate a test plan for the policy app
@planner Create a test plan for form validation scenarios
@planner Include edge cases like empty submissions
```

**Generator Examples:**
```
@generator Generate test for: Create New Policy
@generator using data-testid selectors
@generator from test-plan.md scenarios
```

**Healer Examples:**
```
@healer Fix the create-policy test
@healer Error: Element not found "save-button"
@healer Fix timing issue in edit-policy test
```

### Essential Playwright Commands

```bash
npm start                       # Start app (Terminal 1)
npx playwright test --headed    # Run tests with browser
npx playwright test --debug     # Step through
npx playwright test --ui        # Interactive UI mode
```

### Selector Priority (Use in this order)

```typescript
// 1. BEST - Most stable
page.getByTestId('button-id')

// 2. GOOD - Accessible and semantic
page.getByRole('button', { name: 'Submit' })

// 3. OK - For unique text
page.getByText('Submit')

// 4. AVOID - Brittle CSS
page.locator('.btn-primary')
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 4222 in use | `lsof -ti:4222 \| xargs kill -9` |
| Copilot not responding | Restart VS Code |
| Tests won't run | `npm install && npx playwright install` |
| Browser won't open | Check `npm start` is running |

---

## Tips for Success

- **Planner**: Be specific about what to test (form validation, happy path, error cases)
- **Generator**: Always mention selector preference (data-testid is most stable)
- **Healer**: Include error details from test output for faster fixes
- **Iterate**: Run → fix → run again until all tests pass

---

## For More Details

- **Quick reference**: `/docs/deep-dive/cheatsheet.md`
- **Test writing guide**: `/docs/deep-dive/test-writing-guide.md`
- **Debugging flaky tests**: `/docs/deep-dive/debugging-flaky-tests.md`
- **Page objects & fixtures**: `/docs/deep-dive/page-objects-and-fixtures.md`
- **Glossary**: `/docs/deep-dive/cheatsheet.md#glossary`

---

## For Deep Learning

After the workshop, explore:
- **Workflow patterns**: `/docs/deep-dive/agents-workflow-patterns.md`
- **Advanced topics**: `/docs/deep-dive/agents-advanced.md`
- **Test writing**: `/docs/deep-dive/test-writing-guide.md`
- **Debugging**: `/docs/deep-dive/debugging-flaky-tests.md`
- **Page objects**: `/docs/deep-dive/page-objects-and-fixtures.md`
- **Cheatsheet**: `/docs/deep-dive/cheatsheet.md`