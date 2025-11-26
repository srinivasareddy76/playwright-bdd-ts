# Playwright TypeScript Cucumber BDD Framework - Complete User Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Framework Structure](#framework-structure)
4. [Configuration](#configuration)
5. [Running Tests](#running-tests)
6. [Allure Reporting](#allure-reporting)
7. [Command Reference](#command-reference)
8. [Aliases and Shortcuts](#aliases-and-shortcuts)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Usage](#advanced-usage)

## Prerequisites

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

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 3. Install Allure Command Line Tool
```bash
# Using npm (recommended)
npm install -g allure-commandline

# Or using Homebrew (macOS)
brew install allure

# Or using Scoop (Windows)
scoop install allure
```

### 4. Verify Installation
```bash
# Build the project
npm run build

# Verify Allure installation
allure --version
```

## Framework Structure

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

## Configuration

### Environment Configuration
The framework supports multiple environments configured in `config/env/`:

- **T3**: Test environment for PracticeTest application
- **T5**: Test environment for SauceDemo application

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

## Allure Reporting

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

## Aliases and Shortcuts

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

## Support and Documentation

- **Framework Documentation**: See `README.md` and `GETTING_STARTED.md`
- **Playwright Documentation**: https://playwright.dev/
- **Cucumber Documentation**: https://cucumber.io/docs/
- **Allure Documentation**: https://docs.qameta.io/allure/

---

*This user guide covers the complete setup and usage of the Playwright TypeScript Cucumber BDD framework with Allure reporting. For additional help or feature requests, please refer to the project repository.*
