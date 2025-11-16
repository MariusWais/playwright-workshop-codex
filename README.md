# CODEx: Playwright Workshop - AI Agents & Test Automation

A hands-on 1-hour workshop on test automation with Playwright and AI-powered test generation using GitHub Copilot agents.

---

## Quick Start (5 minutes)

```bash
git clone https://github.com/MariusWais/playwright-workshop-codex.git
cd playwright-workshop-codex
npm install && npx playwright install
npm start                    # Terminal 1
npx playwright test --headed # Terminal 2
```

**Report opens automatically.** You're done! 🎉

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| VS Code | v1.105+ | IDE |
| GitHub Copilot | - | AI agents |
| Playwright Test for VS Code | - | Test runner in IDE |

[Get Started: Install Prerequisites →](docs/01-getting-started.md#prerequisites)

---

## Workshop Learning Path (1 hour)

| Time | Task | Document |
|------|------|----------|
| 0-15 min | Setup & verify | [Getting Started](docs/01-getting-started.md) |
| 15-60 min | Learn & practice | [Using AI Agents](docs/02-ai-agents-workflow.md) |

**Keep the AI Agents guide open** — it has everything: step-by-step workflow, commands, pro tips, and troubleshooting.

---

## What You'll Do

- ✅ Setup Playwright
- ✅ Use Planner (`@planner`) to explore and plan tests
- ✅ Use Generator (`@generator`) to generate test code
- ✅ Run tests and see results
- ✅ Use Healer (`@healer`) to fix failures
- ✅ Iterate and refine

---

## The Workshop Stack

**Demo App**: Insurance Policy Management System (Angular 20)
- **URL**: http://localhost:4222
- **Features**: Create, read, update, delete policies
- **Storage**: localStorage (persists across reloads)

**Main Flows**:
- List policies: `/policies`
- Create policy: `/policies/new`
- Edit policy: `/policies/:id/edit`

---

## Documentation Structure

### 📖 Workshop Documents (Read These)

1. **[Getting Started](docs/01-getting-started.md)** — Clone, install, run (2 min)
2. **[Using AI Agents](docs/02-ai-agents-workflow.md)** — Full reference + hands-on (50+ min)

### 📚 Deep-Dive Resources (Learn After Workshop)

For deeper learning, see `/docs/deep-dive/`:
- **agents-workflow-patterns.md** — Sequential/parallel/hybrid workflows
- **agents-advanced.md** — Architecture & technical implementation
- **test-writing-guide.md** — Playwright best practices
- **page-objects-and-fixtures.md** — Advanced patterns
- **debugging-flaky-tests.md** — Troubleshooting strategies
- **cheatsheet.md** — Commands & quick reference
- **glossary.md** — Terms & definitions

---

## Common Commands

```bash
npm start                      # Start demo app on port 4222
npx playwright test            # Run all tests (headless)
npx playwright test --headed   # Run with browser visible
npx playwright test --debug    # Step through each action
npx playwright test --ui       # Interactive test runner
npx playwright show-report     # View HTML report
```

---

## Troubleshooting

### Quick Fixes

| Issue | Fix |
|-------|-----|
| Port 4222 in use | `lsof -ti:4222 \| xargs kill -9` |
| Tests won't run | `npm install && npx playwright install` |
| Browser won't open | Check `npm start` is running |

### npm & Node Issues

**Check your Node version:**
```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 8.0.0 or higher
```

**If Node version is too old:**
- [Download Node.js 18+](https://nodejs.org/) and reinstall

**Clear npm cache:**
```bash
npm cache clean --force
```

**Full fresh install:**
```bash
# Remove all npm artifacts
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
npx playwright install --with-deps
```

**Still having issues?**
```bash
# Nuclear option (deletes cache, node_modules, lock files)
rm -rf node_modules package-lock.json ~/.npm
npm install
npx playwright install --force
```

---

## Ready to Begin?

### 👉 [Start Here: Getting Started](docs/01-getting-started.md)

Then move to: [Using AI Agents](docs/02-ai-agents-workflow.md)


