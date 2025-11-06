# Cheatsheet: Playwright Agents Workshop

- Run agents: npx playwright init-agents --loop=vscode
- Planner -> generates specs/*.md
- Generator -> generates tests/ from specs
- Healer -> repairs failing tests
- Seed test: tests/seed.spec.ts must exist and set up app state
- Prefer data-testid attributes for stable selectors
- In CI: npx playwright test --workers=1
