# AI Agents: Advanced Topics

Deep dive into architecture, implementation, and advanced usage patterns.

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

## Advanced Topics

### Custom Agent Behavior

Modify chat modes to fit your needs:
- Adjust selector preferences (prefer role vs testid)
- Change test structure (BDD style vs traditional)
- Add custom validation patterns
- Include specific assertions for your domain

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

### Integration with CI/CD

**Example Azure DevOps Pipeline Workflow:**

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: UseNode@1
    inputs:
      version: '18.x'
    displayName: "Use Node.js 18"

  - script: npm ci
    displayName: "Install dependencies"

  - script: npx playwright install --with-deps
    displayName: "Install Playwright browsers"

  - script: npm test
    displayName: "Run Playwright tests"
    continueOnError: true

  # Collect logs only when tests fail
  - script: |
      echo "Capturing failed test logs..."
      mkdir -p test-output
      cp -r playwright-report test-output || true
    displayName: "Capture test failures"
    condition: failed()

  # **Healer step: automatic repair after failure**
  - script: npm run agent:heal
    displayName: "Run Playwright Healer Agent"
    condition: failed()

  - task: PublishTestResults@2
    displayName: "Publish JUnit results"
    inputs:
      testResultsFormat: "JUnit"
      testResultsFiles: "**/junit*.xml"
    condition: always()

  - task: PublishBuildArtifacts@1
    displayName: "Upload Playwright report"
    inputs:
      PathtoPublish: "playwright-report"
      ArtifactName: "playwright-report"
    condition: always()
    
```