# Local Workspace Setup Guide

This guide will help you set up your local development environment to run the Playwright BDD TypeScript framework for front-end testing.

## Prerequisites

### Required Software

#### 1. Node.js (Version 18+ recommended)
- **Download**: https://nodejs.org/
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```
- **Expected output**: Node.js 18.x+ and npm 9.x+

#### 2. Git
- **Download**: https://git-scm.com/
- **Verify installation**:
  ```bash
  git --version
  ```

#### 3. Visual Studio Code (Recommended IDE)
- **Download**: https://code.visualstudio.com/
- **Recommended Extensions**:
  - TypeScript and JavaScript Language Features
  - Playwright Test for VSCode
  - Cucumber (Gherkin) Full Support
  - ESLint
  - Prettier - Code formatter

## Repository Setup

### 1. Clone the Repository
```bash
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers needed for testing.

### 4. Verify Installation
```bash
# Check if build works
npm run build

# List available scripts
npm run
```

## Environment Configuration

### 1. Environment Files
The framework uses different environments (T3, T5, etc.). Default configurations are already set up in:
- `config/env/T3.ts` - PracticeTest environment
- `config/env/T5.ts` - SauceDemo environment

### 2. Test Environment Variables
You can set these environment variables for customization:
```bash
# Windows (Command Prompt)
set APP_ENV=T5
set HEADLESS=true

# Windows (PowerShell)
$env:APP_ENV="T5"
$env:HEADLESS="true"

# macOS/Linux
export APP_ENV=T5
export HEADLESS=true
```

## Running Front-End Tests

### Quick Start Commands

#### 1. SauceDemo Application Tests
```bash
# Run all SauceDemo tests
npm run test:saucedemo

# Run smoke tests (headless)
npm run test:smoke

# Run positive test scenarios
npm run test:positive

# Run negative test scenarios  
npm run test:negative

# Run tests with browser visible (headed mode)
npm run test:headed
```

#### 2. PracticeTest Application Tests
```bash
# Run all PracticeTest tests
npm run test:practicetest

# Run smoke tests
npm run test:practicetest:smoke

# Run positive scenarios
npm run test:practicetest:positive

# Run negative scenarios
npm run test:practicetest:negative

# Run with browser visible
npm run test:practicetest:headed
```

#### 3. API Testing (New Feature)
```bash
# Run API examples
npm run examples:api

# Run simple API test
npm run test:api:simple

# Run BDD API tests
npm run test:api:smoke
npm run test:api:posts
npm run test:api:users
npm run test:api:comments
```

### Test Applications

#### 1. SauceDemo (https://saucedemo.com)
- **Purpose**: E-commerce demo application
- **Test Scenarios**: Login, product browsing, cart operations
- **Credentials**: 
  - Valid: `standard_user` / `secret_sauce`
  - Invalid: Various invalid combinations for negative testing

#### 2. PracticeTest (https://practicetestautomation.com/practice-test-login/)
- **Purpose**: Simple login practice application
- **Test Scenarios**: Login validation, error handling
- **Credentials**:
  - Valid: `student` / `Password123`
  - Invalid: Various combinations for error testing

#### 3. JSONPlaceholder API (https://jsonplaceholder.typicode.com)
- **Purpose**: Free REST API for testing
- **Resources**: Posts, Users, Comments, Todos, Albums
- **Operations**: Full CRUD (Create, Read, Update, Delete)

## Development Workflow

### 1. Writing Tests

#### BDD Feature Files
Create feature files in Gherkin syntax:
```gherkin
@ui @login @saucedemo
Feature: SauceDemo Login
  As a user
  I want to login to SauceDemo
  So that I can access the application

  @smoke @positive
  Scenario: Successful login with valid credentials
    Given I am on the SauceDemo login page
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be redirected to the products page
```

#### Step Definitions
Implement step definitions in TypeScript:
```typescript
Given('I am on the SauceDemo login page', async function() {
  await this.page.goto('https://saucedemo.com');
});

When('I login with username {string} and password {string}', 
  async function(username: string, password: string) {
    await this.page.fill('[data-test="username"]', username);
    await this.page.fill('[data-test="password"]', password);
    await this.page.click('[data-test="login-button"]');
});
```

### 2. Running Specific Tests

#### By Tags
```bash
# Run only smoke tests
npm run test:smoke

# Run specific tags (modify cucumber command)
npx cucumber-js --tags "@positive and @login"
npx cucumber-js --tags "not @skip"
```

#### By Feature File
```bash
# Run specific feature
npx cucumber-js src/applications/saucedemo/features/saucedemo_login.feature
```

### 3. Debugging Tests

#### Headed Mode (Browser Visible)
```bash
npm run test:headed
```

#### Debug Mode with Breakpoints
```bash
# Set environment variable
set PWDEBUG=1
npm run test:headed
```

#### VSCode Debugging
1. Set breakpoints in your TypeScript files
2. Use VSCode's "Run and Debug" panel
3. Create launch configuration for Cucumber tests

## Project Structure

```
playwright-bdd-ts/
├── src/
│   ├── applications/           # Test applications
│   │   ├── saucedemo/         # SauceDemo tests
│   │   ├── practicetest/      # PracticeTest tests
│   │   └── jsonplaceholder/   # API tests
│   ├── common/                # Shared utilities
│   │   ├── pages/            # Page Object Models
│   │   ├── steps/            # Common step definitions
│   │   └── support/          # Test utilities
│   ├── api/                  # API testing framework
│   └── utils/                # Utility functions
├── config/                   # Environment configurations
├── test-results/            # Test reports and artifacts
├── logs/                    # Application logs
└── dist/                    # Compiled JavaScript
```

## Troubleshooting

### Common Issues

#### 1. "Missing script: 'build'" Error
```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install

# Verify scripts
npm run
```

#### 2. Playwright Browser Issues
```bash
# Reinstall browsers
npx playwright install

# Install system dependencies (Linux)
npx playwright install-deps
```

#### 3. TypeScript Compilation Errors
```bash
# Clean and rebuild
npm run clean
npm run build

# Check TypeScript version
npx tsc --version
```

#### 4. Port/Network Issues
- Ensure no firewall blocking
- Check if applications are accessible:
  - https://saucedemo.com
  - https://practicetestautomation.com/practice-test-login/
  - https://jsonplaceholder.typicode.com

### Performance Tips

#### 1. Faster Test Execution
```bash
# Run tests in parallel (modify cucumber config)
# Use headless mode for CI/CD
export HEADLESS=true

# Reduce timeout for faster feedback
# Configure in playwright.config.ts
```

#### 2. Selective Test Execution
```bash
# Run only changed tests
# Use tags for test categorization
# Skip slow tests during development
```

## IDE Setup (Visual Studio Code)

### 1. Recommended Settings (.vscode/settings.json)
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.feature": "cucumber"
  }
}
```

### 2. Launch Configuration (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Cucumber Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/cucumber-js",
      "args": [
        "--require", "dist/src/common/steps/**/*.js",
        "--require", "dist/src/applications/**/steps/**/*.js",
        "src/applications/saucedemo/features/saucedemo_login.feature"
      ],
      "env": {
        "APP_ENV": "T5",
        "HEADLESS": "false"
      },
      "preLaunchTask": "npm: build"
    }
  ]
}
```

### 3. Tasks Configuration (.vscode/tasks.json)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## Next Steps

### 1. Verify Setup
```bash
# Test SauceDemo application
npm run test:smoke

# Test API framework
npm run test:api:simple

# Test PracticeTest application
npm run test:practicetest:smoke
```

### 2. Explore Documentation
- `FRAMEWORK_USER_GUIDE.md` - Complete framework documentation
- `API_TESTING_GUIDE.md` - API testing guide
- `QUICK_SETUP_GUIDE.md` - Quick reference

### 3. Start Development
1. Choose an application to test (SauceDemo/PracticeTest)
2. Write new feature files or extend existing ones
3. Implement step definitions
4. Run tests and iterate

### 4. Advanced Features
- Database testing (Oracle/PostgreSQL)
- API testing with authentication
- Custom page objects and utilities
- CI/CD integration

## Support

If you encounter any issues:

1. **Check Documentation**: Review the comprehensive guides
2. **Verify Prerequisites**: Ensure all software is properly installed
3. **Test Connectivity**: Verify access to test applications
4. **Check Logs**: Review logs in the `logs/` directory
5. **Update Dependencies**: Run `npm update` for latest packages

The framework is designed to be robust and well-documented. Most issues can be resolved by following the troubleshooting steps above.

Happy Testing! 🚀