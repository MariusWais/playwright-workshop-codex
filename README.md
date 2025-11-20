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

| Time | Topic | Focus |
|------|-------|-------|
| 0-10 min | Setup & Verification | Install, run app, run seed test |
| 10-22 min | Test Planning (Planner) | Explore app, generate test scenarios |
| 22-40 min | Test Generation (Generator) | Create executable test code |
| 40-52 min | Test Maintenance (Healer) | Fix failures, stabilize tests |
| 52-60 min | Best Practices & Wrap-Up | Pitfalls, architectures, next steps |

### 👉 [Open Workshop Guide](WORKSHOP.md)

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

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 4222 in use | `lsof -ti:4222 \| xargs kill -9` |
| Tests won't run | `npm install && npx playwright install` |
| Browser won't open | Check `npm start` is running |
| Node version < 18 | [Download Node.js 18+](https://nodejs.org/) |
| Fresh install needed | `rm -rf node_modules package-lock.json && npm install` |


