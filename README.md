
# Playwright BDD TypeScript Framework - Complete Guide

A comprehensive Behavior-Driven Development (BDD) testing framework built with Playwright, TypeScript, and Cucumber. Features multi-environment support, database utilities, API testing capabilities, Allure reporting, and PFX client certificate support.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Framework Architecture](#framework-architecture)
3. [Prerequisites & Installation](#prerequisites--installation)
4. [Configuration](#configuration)
5. [Test Data & Credentials](#test-data--credentials)
6. [Running Tests](#running-tests)
7. [Allure Reporting](#allure-reporting)
8. [Command Reference](#command-reference)
9. [Aliases & Shortcuts](#aliases--shortcuts)
10. [Troubleshooting](#troubleshooting)
11. [Advanced Usage](#advanced-usage)
12. [Extending the Framework](#extending-the-framework)
13. [Development](#development)
14. [Features](#features)

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control
- **Java**: Version 8 or higher (required for Allure reporting)

### Installation
```bash
# Clone the repository
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Allure Command Line Tool
npm install -g allure-commandline

# Build the project
npm run build
```

### Run Tests
```bash
# Run all SauceDemo tests with reports
npm run test:saucedemo

# Run smoke tests only
npm run test:smoke

# Run positive test scenarios
npm run test:positive

# Run negative test scenarios  
npm run test:negative

# Run utilities demo
npm run test:utilities

# Generate and view Allure report
npm run allure:serve
```

## 🏗️ Framework Architecture

### Core Components
- **Page Object Model**: Structured page representations with reusable methods
- **BDD Step Definitions**: Cucumber step implementations for common actions
- **Environment Management**: Multi-environment configuration with validation
- **Test Context**: Shared state management across test scenarios
- **Reporting**: HTML, JSON, and Allure test reports with screenshots
- **Utilities**: Comprehensive utility classes for data generation, file operations, and more

### Supported Testing Types
- **UI Testing**: Web application testing with Playwright
- **API Testing**: REST API testing with certificate support (ready to enable)
- **Database Testing**: Oracle and PostgreSQL testing utilities (ready to enable)
- **Cross-browser**: Chromium, Firefox, WebKit support

## 📁 Project Structure

```
playwright-bdd-ts/
├── config/                     # Environment configurations
│   ├── env/
│   │   └── test/
│   │       ├── T3.json        # Test environment T3
│   │       └── T5.json        # Test environment T5
│   ├── index.ts               # Configuration loader
│   └── schema.ts              # Configuration schema
├── src/
│   ├── applications/          # Application-specific tests
│   │   ├── examples/          # Example features and steps
│   │   ├── jsonplaceholder/   # API testing examples
│   │   ├── practicetest/      # Practice test site
│   │   └── saucedemo/         # SauceDemo site tests
│   ├── common/                # Shared components
│   │   ├── features/          # Common feature files
│   │   ├── pages/             # Base page objects
│   │   ├── steps/             # Common step definitions
│   │   └── support/           # Support utilities
│   └── utils/                 # Utility classes
├── cucumber.config.ts         # Cucumber configuration
├── playwright.config.ts       # Playwright configuration
├── package.json              # Project dependencies and scripts
└── run-utilities-demo.js     # Utilities demonstration script
```

## Prerequisites & Installation

### System Requirements
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control
- **Java**: Version 8 or higher (required for Allure reporting)

### Verify Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check Java version (for Allure)
java -version
```

### Complete Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts
```

#### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Install Playwright browsers
npx playwright install
```

#### 3. Install Allure Command Line Tool
```bash
# Using npm (recommended)
npm install -g allure-commandline

# Or using Homebrew (macOS)
brew install allure

# Or using Scoop (Windows)
scoop install allure
```

#### 4. Verify Installation
```bash
# Build the project
npm run build

# Verify Allure installation
allure --version

# Run utilities demo to verify setup
npm run test:utilities
```

## Configuration

### Environment Configuration
The framework supports multiple environments configured in `config/env/`:

- **T3**: Test environment for PracticeTest application (https://practicetestautomation.com)
- **T5**: Test environment for SauceDemo application (https://saucedemo.com)

#### Environment-Specific Settings
Each environment has its own JSON configuration file:

```json
// config/env/test/T5.json (SauceDemo)
{
  "name": "Test Environment T5 - SauceDemo",
  "group": "test",
  "app": {
    "baseUrl": "https://saucedemo.com",
    "username": "standard_user",
    "password": "secret_sauce"
  }
}
```

#### Runtime Configuration Overrides
Override configuration via environment variables:
```bash
# Override base URL
export APP_BASE_URL="https://custom-saucedemo.com"

# Override credentials
export APP_USERNAME="custom_user"
export APP_PASSWORD="custom_password"
```

### Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your specific settings:
```env
# Default environment
APP_ENV=T5

# Browser settings
HEADLESS=true
BROWSER=chromium

# Test settings
TIMEOUT=30000
```

## Test Data & Credentials

### SauceDemo Test Users
All SauceDemo users use the password: `secret_sauce`

- **standard_user** - Normal user for standard testing
- **locked_out_user** - Locked account (for error testing scenarios)
- **problem_user** - User with visual/functional issues
- **performance_glitch_user** - Slow performance user (10s timeout)
- **error_user** - User with application-specific errors
- **visual_user** - User with visual differences

### PracticeTest Credentials
- **Username**: `student`
- **Password**: `Password123`

### API Testing Endpoints
**JSONPlaceholder API** (Base URL: `https://jsonplaceholder.typicode.com`)

Available endpoints:
- `/posts` - Blog posts (100 items)
- `/users` - Users (10 items)
- `/comments` - Comments (500 items)
- `/albums` - Albums (100 items)
- `/photos` - Photos (5000 items)
- `/todos` - Todos (200 items)

## Running Tests

### Basic Test Execution

#### 1. Build and Run All Tests
```bash
npm test
```

#### 2. Run Tests by Tags
```bash
# Run smoke tests
npm run test:smoke

# Run UI tests
npm run test:ui

# Run API tests
npm run test:api

# Run positive test cases
npm run test:positive

# Run negative test cases
npm run test:negative
```

#### 3. Run Application-Specific Tests
```bash
# Run SauceDemo tests
npm run test:saucedemo

# Run PracticeTest tests
npm run test:practicetest
```

#### 4. Run Utilities Demo
```bash
npm run test:utilities
```

### Advanced Test Execution

#### Run Tests with Custom Environment
```bash
# Set environment variable and run tests
cross-env APP_ENV=T3 npm test

# Run with headed browser
cross-env HEADLESS=false npm run test:saucedemo
```

#### Cross-Platform Environment Variables
Different operating systems handle environment variables differently:

**Linux/macOS:**
```bash
APP_ENV=T5 npm run test
export APP_ENV=T5
```

**Windows CMD:**
```cmd
set APP_ENV=T5 && npm run test
```

**Windows PowerShell:**
```powershell
$env:APP_ENV="T5"; npm run test
```

**cross-env Solution (Recommended - Works Everywhere):**
```bash
# Install cross-env globally for convenience
npm install -g cross-env

# Use with any command
npx cross-env APP_ENV=T5 npm run test:saucedemo
npx cross-env APP_ENV=T3 npm run test:practicetest

# Multiple environment variables
npx cross-env APP_ENV=T5 HEADLESS=false npm run test
```

#### Run Specific Feature Files
```bash
# Build first
npm run build

# Run specific feature
npx cucumber-js src/applications/saucedemo/features/saucedemo_login.feature \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/**/steps/**/*.js' \
  --format progress-bar
```

### Test Categories
- **@smoke**: Critical functionality tests
- **@positive**: Happy path scenarios
- **@negative**: Error handling and validation
- **@data_driven**: Parameterized test scenarios
- **@performance**: Performance-related tests

## Allure Reporting

### Setup and Installation
Allure is already configured in the project. The required dependencies are included in `package.json`:

```json
{
  "devDependencies": {
    "allure-cucumberjs": "^2.15.0",
    "allure-commandline": "^2.25.0"
  }
}
```

### Generate and View Allure Reports

#### 1. Run Tests with Allure Reporter
```bash
# Run utilities demo (includes Allure reporting)
npm run test:utilities

# Or run any test with Allure format
npm run build
npx cucumber-js src/applications/examples/features/utilities-demo.feature \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/examples/step-definitions/**/*.js' \
  --format allure-cucumberjs/reporter
```

#### 2. Generate Allure Report
```bash
# Generate static HTML report
npm run allure:generate

# Serve report with live server
npm run allure:serve

# Open existing report
npm run allure:open
```

#### 3. Clean Allure Results
```bash
# Clean all Allure artifacts
npm run allure:clean
```

### Allure Report Features
- **Test Results Overview**: Pass/fail statistics, execution time
- **Test Cases Details**: Step-by-step execution with screenshots
- **Categories**: Automatic categorization of failures
- **Timeline**: Execution timeline and parallel execution view
- **Attachments**: Screenshots, logs, and other artifacts
- **History**: Trend analysis across multiple test runs
- **Graphs & Analytics**: 
  - Status distribution (passed/failed/broken/skipped)
  - Test duration analysis
  - Severity level breakdown
  - Trend analysis over multiple runs
- **Behaviors**: Tests organized by user stories and features
- **Environment Info**: Test environment details and configuration

### Allure Directory Structure
```
playwright-bdd-ts/
├── allure-results/          # Raw test execution data
│   ├── *-result.json       # Individual test results
│   ├── *-container.json    # Test suite containers
│   └── *-attachment.*      # Screenshots and logs
├── allure-report/          # Generated HTML report
│   ├── index.html         # Main report entry point
│   ├── data/              # Report data files
│   └── plugins/           # Report plugins and widgets
└── test-results/          # Additional report formats
    ├── *.html            # Cucumber HTML reports
    └── *.json            # Cucumber JSON reports
```

### Customizing Allure Reports
Add annotations to your step definitions for enhanced reporting:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { allure } from 'allure-cucumberjs';

Given('I perform a test action', async function () {
  await allure.step('Detailed step description', async () => {
    // Test implementation
  });
  
  // Add attachments
  await allure.attachment('Test Data', JSON.stringify(testData), 'application/json');
  
  // Add severity and labels
  await allure.severity('critical');
  await allure.feature('User Authentication');
  await allure.story('Login Functionality');
});
```

## Command Reference

### Build Commands
```bash
npm run build          # Compile TypeScript to JavaScript
npm run clean          # Remove dist directory
```

### Code Quality Commands
```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

### Test Commands
```bash
npm test               # Run all tests
npm run test:ui        # Run UI tests (@ui tag)
npm run test:api       # Run API tests (@api tag)
npm run test:smoke     # Run smoke tests (@smoke tag)
npm run test:positive  # Run positive tests (@positive tag)
npm run test:negative  # Run negative tests (@negative tag)
npm run test:saucedemo # Run SauceDemo application tests
npm run test:practicetest # Run PracticeTest application tests
npm run test:utilities # Run utilities demonstration
```

### Allure Commands
```bash
npm run allure:generate # Generate Allure HTML report
npm run allure:serve    # Serve Allure report with live server
npm run allure:open     # Open existing Allure report
npm run allure:clean    # Clean Allure results and reports
```

## Aliases & Shortcuts

### Bash Aliases (Add to ~/.bashrc or ~/.zshrc)
```bash
# Framework aliases
alias pbt='cd /path/to/playwright-bdd-ts'
alias pbt-build='npm run build'
alias pbt-test='npm test'
alias pbt-smoke='npm run test:smoke'
alias pbt-ui='npm run test:ui'
alias pbt-api='npm run test:api'
alias pbt-demo='npm run test:utilities'

# Allure aliases
alias allure-gen='npm run allure:generate'
alias allure-serve='npm run allure:serve'
alias allure-open='npm run allure:open'
alias allure-clean='npm run allure:clean'

# Development aliases
alias pbt-lint='npm run lint:fix'
alias pbt-format='npm run format'
alias pbt-clean='npm run clean && npm run build'
```

### PowerShell Aliases (Add to PowerShell profile)
```powershell
# Framework aliases
function pbt { Set-Location "C:\path\to\playwright-bdd-ts" }
function pbt-build { npm run build }
function pbt-test { npm test }
function pbt-smoke { npm run test:smoke }
function pbt-demo { npm run test:utilities }

# Allure aliases
function allure-gen { npm run allure:generate }
function allure-serve { npm run allure:serve }
function allure-clean { npm run allure:clean }
```

### Package.json Scripts Shortcuts
The framework includes convenient npm scripts:
```json
{
  "scripts": {
    "test": "npm run build && cucumber-js",
    "smoke": "npm run test:smoke",
    "demo": "npm run test:utilities",
    "report": "npm run allure:serve"
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript build cache
npm run clean
npm run build
```

#### 2. Playwright Browser Issues
```bash
# Reinstall Playwright browsers
npx playwright install

# Install system dependencies (Linux)
npx playwright install-deps
```

#### 3. Allure Report Issues
```bash
# Verify Java installation
java -version

# Reinstall Allure
npm uninstall -g allure-commandline
npm install -g allure-commandline

# Clear Allure results
npm run allure:clean
```

#### 4. Configuration Issues
```bash
# Verify environment configuration
cat config/env/test/T5.json

# Check environment variable
echo $APP_ENV

# Reset to default environment
export APP_ENV=T5
```

#### 5. Test Execution Issues
```bash
# Run with verbose logging
DEBUG=* npm test

# Run single test for debugging
npm run build
npx cucumber-js src/applications/examples/features/utilities-demo.feature \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/examples/step-definitions/**/*.js' \
  --format progress-bar \
  --tags "@smoke"
```

#### 6. Windows-Specific Issues

**PowerShell Execution Policy Error:**
```powershell
# Fix execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Environment Variables in Windows:**
```cmd
# CMD
set APP_ENV=T5 && npm run test:saucedemo

# PowerShell
$env:APP_ENV="T5"; npm run test:saucedemo

# cross-env (recommended)
npx cross-env APP_ENV=T5 npm run test:saucedemo
```

#### 7. Performance Issues

**Expected Performance Thresholds:**
- Standard user login: < 5 seconds
- Performance glitch user: < 10 seconds
- API responses: < 2 seconds

**Performance Testing:**
```bash
# Test login performance
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@performance"

# Performance glitch user testing
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@performance_glitch"
```

## Advanced Usage

### Custom Test Execution

#### 1. Run Tests with Custom Tags
```bash
npm run build
npx cucumber-js \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/**/steps/**/*.js' \
  --tags "@smoke and @positive" \
  --format progress-bar
```

#### 2. Parallel Test Execution
```bash
npm run build
npx cucumber-js \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/**/steps/**/*.js' \
  --parallel 2 \
  --format progress-bar
```

#### 3. Custom Reporting
```bash
npm run build
npx cucumber-js \
  --require 'dist/src/common/steps/**/*.js' \
  --require 'dist/src/applications/**/steps/**/*.js' \
  --format progress-bar \
  --format json:test-results/custom-report.json \
  --format html:test-results/custom-report.html \
  --format allure-cucumberjs/reporter
```

### Environment-Specific Execution
```bash
# Test environment T3 (PracticeTest)
cross-env APP_ENV=T3 HEADLESS=true npm run test:practicetest

# Test environment T5 (SauceDemo) with headed browser
cross-env APP_ENV=T5 HEADLESS=false npm run test:saucedemo
```

### CI/CD Integration
```bash
# Typical CI pipeline commands
npm ci                    # Clean install
npm run lint             # Code quality check
npm run build            # Build project
npm run test:smoke       # Run smoke tests
npm run allure:generate  # Generate reports
```

## Extending the Framework

### Adding New Applications
1. **Create Application Directory Structure:**
```bash
mkdir -p src/applications/newapp/{pages,steps,features,data}
```

2. **Add Page Objects:**
```typescript
// src/applications/newapp/pages/NewAppPage.ts
import { BasePage } from '../../common/pages/BasePage';

export class NewAppPage extends BasePage {
  // Page-specific methods
}
```

3. **Add Step Definitions:**
```typescript
// src/applications/newapp/steps/newapp.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('I am on the new app page', async function() {
  // Implementation
});
```

4. **Add Feature Files:**
```gherkin
# src/applications/newapp/features/newapp.feature
Feature: New Application Testing
  
  Scenario: Basic functionality
    Given I am on the new app page
    When I perform an action
    Then I should see the expected result
```

5. **Add Environment Configuration:**
```json
// config/env/test/NEW.json
{
  "name": "New Application Environment",
  "group": "test",
  "app": {
    "baseUrl": "https://newapp.example.com",
    "username": "testuser",
    "password": "testpass"
  }
}
```

### Adding New Environments
1. **Create Configuration File:**
```bash
# For production environment
mkdir -p config/env/prod
```

2. **Add Environment Config:**
```json
// config/env/prod/PROD.json
{
  "name": "Production Environment",
  "group": "prod",
  "app": {
    "baseUrl": "https://app.production.com"
  }
}
```

3. **Test New Environment:**
```bash
npx cross-env APP_ENV=PROD npm run test
```

### Adding Custom Utilities
1. **Create Utility Class:**
```typescript
// src/utils/CustomUtils.ts
export class CustomUtils {
  static customMethod(): string {
    return 'Custom functionality';
  }
}
```

2. **Export from Index:**
```typescript
// src/utils/index.ts
export { CustomUtils } from './CustomUtils';
```

3. **Use in Step Definitions:**
```typescript
import { CustomUtils } from '../../utils';

// Use CustomUtils.customMethod()
```

### Adding New Page Objects
```typescript
// src/pages/NewPage.ts
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  async performAction(): Promise<void> {
    // Implementation
  }
}
```

### Adding New Step Definitions
```typescript
// src/steps/new.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/CustomWorld';

Given('I perform a new action', async function (this: CustomWorld) {
  // Implementation
});
```

## 🛠️ Development

### Building the Project
```bash
npm run build          # Compile TypeScript to JavaScript
npm run clean          # Remove dist directory
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

### Database Integration (Ready to Enable)
```typescript
// Uncomment database utilities in src/utils/
// Enable database steps in src/steps/database.steps.ts.disabled
```

### API Testing (Ready to Enable)
```typescript
// Uncomment API client in src/utils/
// Enable API steps in src/steps/api.steps.ts.disabled
```

## 🏆 Features

### ✅ Implemented
- Complete BDD framework with TypeScript
- SauceDemo website integration
- Multi-environment configuration
- Page Object Model architecture
- Comprehensive test reporting (HTML, JSON, Allure)
- Automatic screenshot capture
- Structured logging
- Test context management
- Error handling and cleanup
- Comprehensive utility classes
- Cross-platform environment variable support
- Performance testing capabilities

### 🔄 Ready to Enable
- Oracle database testing utilities
- PostgreSQL database testing utilities
- REST API testing with certificates
- Visual regression testing
- Cross-browser testing

## 📈 Test Execution Summary

**Framework Status**: ✅ OPERATIONAL

- **Total Test Scenarios**: 20+
- **Passing Tests**: All core scenarios passing
- **Framework Components**: 30+ TypeScript files
- **Step Definitions**: 50+ implemented steps
- **Page Objects**: Complete SauceDemo integration
- **Reporting**: HTML/JSON/Allure reports with screenshots
- **Utilities**: 8 comprehensive utility classes

### Sample Test Results
```
✅ Utilities Demo Execution Results:
3 scenarios (3 passed, 0 failed)
15 steps (15 passed, 0 skipped, 0 failed)
Execution time: 173ms

📊 Allure Report Generated:
- Status: 100% passed
- Duration: 0-80ms per test
- Severity: 3 normal priority tests
- Features: Utilities Demonstration
- Environment: T5 (test)
```

## Quick Start Checklist

- [ ] Install Node.js 16+ and Java 8+
- [ ] Clone repository and run `npm install`
- [ ] Install Playwright browsers: `npx playwright install`
- [ ] Install Allure: `npm install -g allure-commandline`
- [ ] Build project: `npm run build`
- [ ] Run demo: `npm run test:utilities`
- [ ] View Allure report: `npm run allure:serve`
- [ ] Set up aliases for convenience
- [ ] Create `.env` file with your settings

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new functionality
3. Update documentation
4. Ensure TypeScript compilation passes
5. Test across different environments

## Support and Documentation

- **Framework Documentation**: This comprehensive guide
- **Playwright Documentation**: https://playwright.dev/
- **Cucumber Documentation**: https://cucumber.io/docs/
- **Allure Documentation**: https://docs.qameta.io/allure/

## 📝 License

This project is licensed under the MIT License.

---

**Ready for immediate use and further development!** 🚀

*This guide provides everything needed to install, configure, and use the Playwright TypeScript Cucumber BDD framework with Allure reporting effectively. For additional help or feature requests, please refer to the project repository.*

