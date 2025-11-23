# CODEx: Playwright Workshop - AI Agents & Test Automation

A hands-on 1-hour workshop on test automation with Playwright and AI-powered test generation using GitHub Copilot agents.

---

## Quick Start (5 minutes)

```bash
# Clone workshop project from Github
git clone https://github.com/MariusWais/playwright-workshop-codex.git

# Open the project folder
cd playwright-workshop-codex

# Install npm packages
npm install

# Install playwright browsers
npx playwright install

# Start demo app
npm start

# TODO: open new Terminal Window

# Run seed test
npx playwright test --headed 
```

**Report opens automatically.** You ran your first test! 🎉

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| VS Code | v1.105+ | IDE |
| GitHub Copilot | - | AI agents |
| Playwright Test for VS Code | - | Test runner in IDE |

---

## Workshop Agenda (1 Hour)

| Topic | Focus |
|-------|-------|
| Setup & Verification | Install, run app, run seed test |
| Test Design (Planner Agent) | Explore app, generate test scenarios |
| Test Coding (Generator Agent) | Create executable test code |
| Test Maintenance (Healer Agent) | Fix failures, stabilize tests |
| Best Practices & Wrap-Up | Pitfalls, architectures |

### 👉 [Open Workshop Guide](WORKSHOP.md)


---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 4222 in use | `lsof -ti:4222 \| xargs kill -9` |
| Tests won't run | `npm install && npx playwright install` |
| Browser won't open | Check `npm start` is running |
| Node version < 18 | [Download Node.js 18+](https://nodejs.org/) |
| Fresh install needed | `rm -rf node_modules package-lock.json && npm install` |


---

## Self-Study Resources (After Workshop)

Explore `/docs/self-study/` for deeper learning:
- **agents-workflow-patterns.md** — Sequential/parallel/hybrid workflows
- **agents-advanced.md** — Architecture & technical implementation
- **test-writing-guide.md** — Playwright best practices
- **page-objects-and-fixtures.md** — Advanced patterns
- **debugging-flaky-tests.md** — Troubleshooting strategies
- **cheatsheet.md** — Commands & quick reference
- **glossary.md** — Terms & definitions