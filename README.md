# Playwright Workshop Documentation

Welcome to the Playwright + AI Agents Testing Workshop! This documentation provides everything you need to learn modern test automation with Playwright and AI-assisted test generation.

## 📚 Documentation Structure

### For Workshop Attendees

Follow these guides in order:

1. **[Getting Started](docs/01-getting-started.md)** - Setup, installation, and running your first test
2. **[AI Agents Workflow](docs/02-ai-agents-workflow.md)** - Understanding Planner, Generator, and Healer agents
3. **[Using AI Agents](docs/03-using-ai-agents.md)** - Practical examples and prompts for each agent
4. **[Test Writing Guide](docs/04-test-writing-guide.md)** - Best practices for selectors, waits, and structure
5. **[Page Objects & Fixtures](docs/05-page-objects-and-fixtures.md)** - Patterns for maintainable test code
6. **[Debugging Flaky Tests](docs/06-debugging-flaky-tests.md)** - Identifying and fixing unreliable tests

### Quick Reference

- **[Cheatsheet](docs/cheatsheet.md)** - Quick reference for commands and patterns
- **[Glossary](docs/glossary.md)** - Common terms and definitions

### For Instructors

- **[Workshop Guide](docs/workshop-guide.md)** - Teaching plan, schedule, and demo script

### Examples

- **[examples/](examples/)** - Sample test plans and outputs from AI agents

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Start the demo application
npm start

# 4. Run tests
npx playwright test

# 5. View test report
npx playwright show-report
```

## 🎯 Workshop Objectives

By the end of this workshop, you will:

✅ Understand Playwright fundamentals
✅ Write reliable, maintainable tests
✅ Use AI agents to generate test plans and code
✅ Debug and fix flaky tests
✅ Apply best practices for test automation
✅ Be ready to implement Playwright in your projects

## 🛠️ Prerequisites

- Basic JavaScript/TypeScript knowledge
- Node.js 18+ installed
- VS Code (recommended for AI agents)
- GitHub Copilot (optional, for AI features)

## 📖 Learning Path

### Beginner Track (30 minutes)
1. Getting Started
2. Run existing tests
3. Understand test structure
4. Write your first test

### Intermediate Track (60 minutes)
1. Getting Started
2. AI Agents Workflow
3. Generate tests with AI
4. Apply best practices

### Advanced Track (90 minutes)
1. Complete all beginner/intermediate content
2. Page Objects & Fixtures
3. Debugging Flaky Tests
4. CI/CD integration

## 🏗️ Workshop Application

The demo application is an **Insurance Policy Management System** built with Angular 20:

- **Features**: Create, Read, Update, Delete insurance policies
- **Tech Stack**: Angular 20 (standalone components), localStorage persistence
- **URL**: http://localhost:4222
- **Routes**:
  - `/policies` - List view
  - `/policies/new` - Create policy
  - `/policies/:id/edit` - Edit policy

## 🤖 AI Agents Overview

This workshop introduces three specialized AI agents (chatmodes):

- **🎭 Planner** - Explores your app and creates test plans
- **🎭 Generator** - Converts test plans into executable code
- **🎭 Healer** - Automatically fixes failing tests

See [AI Agents Workflow](docs/02-ai-agents-workflow.md) for details.

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4222
lsof -ti:4222 | xargs kill -9

# Or use a different port
npm start -- --port 4223
```

### Playwright Browsers Not Installed
```bash
npx playwright install
```

### Tests Failing After Checkout
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### AI Agents Not Showing in VS Code
See [Getting Started - AI Agents Setup](docs/01-getting-started.md#ai-agents-setup)

## 📞 Support

- **Issues**: Open an issue in the GitHub repository
- **Questions**: Ask during the workshop or in discussion forum
- **Documentation**: All guides are in this `/docs` folder

## 🎓 Next Steps After Workshop

1. **Practice**: Try the AI agents on your own applications
2. **Integrate**: Add Playwright to your CI/CD pipeline
3. **Expand**: Write more tests for edge cases
4. **Share**: Teach your team what you learned
5. **Contribute**: Share your improvements back to the community

## 📚 Additional Resources

- **Official Playwright Docs**: https://playwright.dev
- **Playwright Discord**: https://aka.ms/playwright/discord
- **Best Practices**: See [Test Writing Guide](docs/04-test-writing-guide.md)
- **Community Examples**: https://github.com/microsoft/playwright

## 🎉 Let's Get Started!

Ready to begin? Head to **[Getting Started](docs/01-getting-started.md)** to set up your environment and run your first test.

---

**Workshop Version**: 1.0.0  
**Last Updated**: November 2025  
**Playwright Version**: Latest  
**Target Audience**: QA Engineers, Developers, Test Automation Engineers
