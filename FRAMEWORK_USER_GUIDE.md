# Playwright BDD TypeScript Framework - User Guide

## Table of Contents
1. [Framework Overview](#framework-overview)
2. [Architecture & Design](#architecture--design)
3. [Core Components](#core-components)
4. [Libraries & Dependencies](#libraries--dependencies)
5. [Configuration Management](#configuration-management)
6. [Test Structure & Organization](#test-structure--organization)
7. [Page Object Model](#page-object-model)
8. [Step Definitions](#step-definitions)
9. [Test Data Management](#test-data-management)
10. [Reporting & Logging](#reporting--logging)
11. [Environment Management](#environment-management)
12. [Running Tests](#running-tests)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)
15. [Framework Enhancement](#framework-enhancement)

---

## Framework Overview

This is a comprehensive **Playwright BDD TypeScript Framework** designed for end-to-end web application testing. It combines the power of Playwright for browser automation with Cucumber BDD for behavior-driven development, all implemented in TypeScript for type safety and better maintainability.

### Key Features
- **BDD Support**: Cucumber integration for Gherkin feature files
- **Multi-Browser**: Chrome, Firefox, Safari, Edge support
- **Cross-Platform**: Windows, macOS, Linux compatibility
- **TypeScript**: Full type safety and IntelliSense support
- **Page Object Model**: Structured and maintainable page objects
- **Environment Management**: Multi-environment configuration support
- **Comprehensive Logging**: Detailed test execution logging
- **Flexible Reporting**: Multiple report formats
- **Database Integration**: Oracle and PostgreSQL support (disabled modules)
- **API Testing**: REST API testing capabilities (disabled module)

---

## Architecture & Design

### Framework Structure
```
playwright-bdd-ts/
├── src/
│   ├── applications/           # Application-specific test modules
│   │   ├── saucedemo/         # SauceDemo application tests
│   │   └── practice-test-automation/  # Practice Test Automation tests
│   ├── common/                # Shared framework components
│   │   ├── config/            # Configuration management
│   │   ├── hooks/             # Test lifecycle hooks
│   │   ├── pages/             # Base page objects
│   │   ├── steps/             # Common step definitions
│   │   └── world/             # Test context management
│   ├── utils/                 # Utility functions
│   ├── api.disabled/          # API testing module (disabled)
│   └── db.disabled/           # Database module (disabled)
├── config/                    # Environment configurations
├── features/                  # Cucumber feature files
├── reports/                   # Test execution reports
└── dist/                      # Compiled JavaScript output
```

### Design Patterns
- **Page Object Model (POM)**: Encapsulates page elements and actions
- **Factory Pattern**: Dynamic page object creation
- **Singleton Pattern**: Configuration and browser management
- **Strategy Pattern**: Environment-specific configurations
- **Observer Pattern**: Event-driven test lifecycle management

---

## Core Components

### 1. Test Context Management (`src/common/world/`)

#### **CustomWorld.ts**
- **Purpose**: Central test context management and dependency injection
- **Key Features**:
  - Browser instance management
  - Page object factory integration
  - Configuration access
  - Test data storage
  - Scenario-specific context isolation

```typescript
// Usage Example
const world = new CustomWorld();
await world.init();
const loginPage = world.pageFactory.getLoginPage();
```

#### **PageFactory.ts**
- **Purpose**: Dynamic page object creation and management
- **Benefits**:
  - Centralized page object instantiation
  - Lazy loading of page objects
  - Type-safe page object access
  - Memory efficient object management

### 2. Configuration Management (`src/common/config/`)

#### **ConfigManager.ts**
- **Purpose**: Environment-specific configuration loading and management
- **Features**:
  - Multi-environment support (T1, T2, T3, T4, T5)
  - Dynamic configuration loading
  - Type-safe configuration access
  - Environment validation

#### **Environment Configurations** (`config/`)
- **T1-T5.json**: Environment-specific settings
- **Includes**: URLs, database connections, API endpoints, certificates

### 3. Browser Management (`src/common/config/`)

#### **BrowserManager.ts**
- **Purpose**: Playwright browser lifecycle management
- **Capabilities**:
  - Multi-browser support (Chrome, Firefox, Safari, Edge)
  - Headless/headed mode configuration
  - Browser context isolation
  - Performance optimization
  - Screenshot and video recording

### 4. Logging System (`src/utils/`)

#### **Logger.ts**
- **Purpose**: Comprehensive test execution logging
- **Features**:
  - Structured JSON logging
  - Multiple log levels (info, warn, error, debug)
  - Timestamp integration
  - Test correlation tracking
  - File and console output

---

## Libraries & Dependencies

### Core Testing Libraries

#### **Playwright (@playwright/test)**
- **Purpose**: Browser automation and testing
- **Why Used**: 
  - Fast and reliable browser automation
  - Multi-browser support
  - Built-in waiting mechanisms
  - Network interception capabilities
  - Mobile device emulation

#### **Cucumber (@cucumber/cucumber)**
- **Purpose**: BDD test execution engine
- **Why Used**:
  - Gherkin syntax support
  - Business-readable test scenarios
  - Step definition management
  - Hooks and lifecycle management
  - Parallel execution support

### Development & Build Tools

#### **TypeScript (typescript)**
- **Purpose**: Type-safe JavaScript development
- **Benefits**:
  - Compile-time error detection
  - Enhanced IDE support
  - Better code maintainability
  - Refactoring safety
  - Documentation through types

#### **Node.js & npm**
- **Purpose**: Runtime environment and package management
- **Usage**:
  - Test execution runtime
  - Dependency management
  - Script automation
  - Build process orchestration

### Utility Libraries

#### **fs-extra**
- **Purpose**: Enhanced file system operations
- **Usage**:
  - Configuration file reading
  - Report generation
  - Test data management
  - Directory operations

#### **path**
- **Purpose**: Cross-platform path handling
- **Usage**:
  - File path resolution
  - Configuration loading
  - Report output paths

---

## Configuration Management

### Environment Configuration Structure

```json
{
  "environment": "T5",
  "type": "test",
  "appUrl": "https://saucedemo.com",
  "database": {
    "type": "PostgreSQL",
    "subtype": "Cloud",
    "oracle": {
      "host": "t5-oracle.host",
      "port": 1521,
      "serviceName": "T5DB"
    },
    "postgresql": {
      "host": "t5-pg.host",
      "port": 5432,
      "database": "t5_testdb"
    }
  },
  "certificates": {
    "origin": "https://api.t5.example.com"
  }
}
```

### Configuration Usage

```typescript
// Load environment configuration
const config = ConfigManager.getConfig('T5');

// Access configuration values
const appUrl = config.appUrl;
const dbConfig = config.database;
```

### Environment Variables

- **APP_ENV**: Target environment (T1, T2, T3, T4, T5)
- **HEADLESS**: Browser mode (true/false)
- **BROWSER**: Browser type (chromium, firefox, webkit)
- **TIMEOUT**: Test timeout in milliseconds

---

## Test Structure & Organization

### Feature Files Structure

```gherkin
Feature: SauceDemo Login Functionality
  As a user of SauceDemo
  I want to be able to login
  So that I can access the application

  @ui @saucedemo @login @smoke @positive
  Scenario: Successful login with standard user
    Given I am on the SauceDemo login page
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    And the page title should contain "Products"
```

### Application Modules

#### **SauceDemo Module** (`src/applications/saucedemo/`)
- **Purpose**: E-commerce application testing
- **Components**:
  - Login functionality
  - Product catalog
  - Shopping cart
  - Checkout process

#### **Practice Test Automation Module** (`src/applications/practice-test-automation/`)
- **Purpose**: Practice website testing scenarios
- **Components**:
  - Login scenarios
  - Exception handling
  - Element interactions

---

## Page Object Model

### Base Page Structure

```typescript
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }

  // Common page operations
  async navigateTo(url: string): Promise<void>
  async waitForPageLoad(): Promise<void>
  async takeScreenshot(name: string): Promise<void>
}
```

### Page Object Implementation

```typescript
export class SauceDemoLoginPage extends BasePage {
  // Locators
  private readonly usernameInput = '[data-test="username"]';
  private readonly passwordInput = '[data-test="password"]';
  private readonly loginButton = '[data-test="login-button"]';

  // Actions
  async enterUsername(username: string): Promise<void>
  async enterPassword(password: string): Promise<void>
  async clickLogin(): Promise<void>
  async login(username: string, password: string): Promise<void>

  // Verifications
  async isLoginPageDisplayed(): Promise<boolean>
  async getErrorMessage(): Promise<string>
}
```

### Page Factory Usage

```typescript
// Get page objects through factory
const loginPage = pageFactory.getSauceDemoLoginPage();
const inventoryPage = pageFactory.getSauceDemoInventoryPage();

// Use page objects in tests
await loginPage.navigateToLoginPage();
await loginPage.login('standard_user', 'secret_sauce');
await inventoryPage.verifyInventoryPageDisplayed();
```

---

## Step Definitions

### Common Steps (`src/common/steps/`)

#### **CommonSteps.ts**
- **Purpose**: Reusable step definitions across applications
- **Includes**:
  - Navigation steps
  - Verification steps
  - Wait conditions
  - Screenshot capture

### Application-Specific Steps

#### **SauceDemo Steps** (`src/applications/saucedemo/steps/`)
- **LoginSteps.ts**: Login-related step definitions
- **InventorySteps.ts**: Product catalog step definitions
- **CartSteps.ts**: Shopping cart step definitions

#### **Step Definition Pattern**

```typescript
Given('I am on the SauceDemo login page', async function (this: CustomWorld) {
  const loginPage = this.pageFactory.getSauceDemoLoginPage();
  await loginPage.navigateToLoginPage();
});

When('I login with username {string} and password {string}', 
  async function (this: CustomWorld, username: string, password: string) {
    const loginPage = this.pageFactory.getSauceDemoLoginPage();
    await loginPage.login(username, password);
  }
);

Then('I should be logged in successfully', async function (this: CustomWorld) {
  const inventoryPage = this.pageFactory.getSauceDemoInventoryPage();
  await inventoryPage.verifyInventoryPageDisplayed();
});
```

---

## Test Data Management

### Test Data Structure

```typescript
interface TestUser {
  username: string;
  password: string;
  role: string;
  permissions: string[];
}

interface TestProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

### Data Management Strategies

1. **Static Test Data**: Hardcoded in step definitions
2. **Configuration-Based**: Stored in environment configs
3. **Dynamic Generation**: Runtime data creation
4. **External Sources**: JSON files, databases, APIs

### Example Usage

```typescript
// Static data
const testUsers = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' }
};

// Dynamic data
const generateTestUser = (): TestUser => ({
  username: `user_${Date.now()}`,
  password: 'test_password',
  role: 'standard',
  permissions: ['read', 'write']
});
```

---

## Reporting & Logging

### Logging Configuration

```typescript
// Logger usage in tests
this.logger.info('Starting login test', { username: 'standard_user' });
this.logger.error('Login failed', { error: errorMessage });
this.logger.debug('Page elements loaded', { elementCount: 10 });
```

### Log Output Format

```json
{
  "level": "info",
  "message": "Starting scenario: Successful login with standard user",
  "timestamp": "2025-09-02 19:10:12",
  "context": {
    "scenario": "scenario-1756840212364-v90mgpghu",
    "tags": ["@ui", "@saucedemo", "@login", "@smoke", "@positive"]
  }
}
```

### Report Generation

- **Cucumber Reports**: HTML and JSON formats
- **Playwright Reports**: Built-in test reports
- **Custom Reports**: Framework-specific reporting
- **Screenshots**: Automatic capture on failures
- **Videos**: Test execution recordings

---

## Environment Management

### Supported Environments

| Environment | Type | Purpose | Database |
|-------------|------|---------|----------|
| T1 | Development | Local development | Oracle (Local) |
| T2 | Integration | Integration testing | Oracle (Cloud) |
| T3 | Staging | Pre-production testing | PostgreSQL (Local) |
| T4 | Performance | Performance testing | PostgreSQL (Cloud) |
| T5 | Test | Functional testing | PostgreSQL (Cloud) |

### Environment Switching

```bash
# Set environment via environment variable
export APP_ENV=T5

# Or pass during test execution
APP_ENV=T3 npm run test:smoke
```

### Configuration Loading

```typescript
// Automatic environment detection
const config = ConfigManager.getConfig(); // Uses APP_ENV

// Explicit environment loading
const t5Config = ConfigManager.getConfig('T5');
```

---

## Running Tests

### Available Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "test:smoke": "npm run build && cp -r config dist/ && APP_ENV=T5 HEADLESS=true cucumber-js src/applications/saucedemo/features/saucedemo_login.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'",
    "test:regression": "npm run build && cp -r config dist/ && cucumber-js --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar",
    "test:saucedemo": "npm run build && cp -r config dist/ && cucumber-js src/applications/saucedemo/features/ --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/saucedemo/steps/**/*.js' --format progress-bar",
    "test:practice": "npm run build && cp -r config dist/ && cucumber-js src/applications/practice-test-automation/features/ --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/practice-test-automation/steps/**/*.js' --format progress-bar"
  }
}
```

### Test Execution Examples

```bash
# Run smoke tests
npm run test:smoke

# Run all SauceDemo tests
npm run test:saucedemo

# Run practice automation tests
npm run test:practice

# Run with specific environment
APP_ENV=T3 npm run test:smoke

# Run in headed mode
HEADLESS=false npm run test:smoke

# Run with specific browser
BROWSER=firefox npm run test:smoke

# Run with tags
cucumber-js --tags "@smoke and @positive"

# Run specific feature
cucumber-js src/applications/saucedemo/features/saucedemo_login.feature
```

### Parallel Execution

```bash
# Run tests in parallel
cucumber-js --parallel 4

# Run with specific worker count
cucumber-js --parallel 2 --tags "@regression"
```

---

## Best Practices

### Code Organization

1. **Separation of Concerns**: Keep page objects, steps, and utilities separate
2. **Single Responsibility**: Each class/method should have one purpose
3. **DRY Principle**: Avoid code duplication through shared utilities
4. **Consistent Naming**: Use clear, descriptive names for files and methods

### Test Design

1. **Independent Tests**: Each test should be able to run independently
2. **Data Isolation**: Use unique test data to avoid conflicts
3. **Proper Cleanup**: Clean up test data and browser contexts
4. **Meaningful Assertions**: Use descriptive assertion messages

### Page Object Guidelines

1. **Encapsulation**: Keep locators and actions within page objects
2. **Abstraction**: Hide implementation details from test steps
3. **Reusability**: Design page objects for maximum reuse
4. **Maintainability**: Use stable locators and clear method names

### Step Definition Best Practices

1. **Reusable Steps**: Create generic steps that can be reused
2. **Clear Language**: Use business-friendly language in Gherkin
3. **Parameter Handling**: Use proper parameter types and validation
4. **Error Handling**: Implement proper error handling and reporting

---

## Troubleshooting

### Common Issues

#### **Build Errors**
```bash
# Clear dist folder and rebuild
rm -rf dist/
npm run build
```

#### **Configuration Issues**
```bash
# Verify environment variable
echo $APP_ENV

# Check configuration file exists
ls config/T5.json
```

#### **Browser Launch Failures**
```bash
# Install browser dependencies
npx playwright install
npx playwright install-deps
```

#### **Test Timeouts**
```typescript
// Increase timeout in configuration
const config = {
  timeout: 60000, // 60 seconds
  navigationTimeout: 30000 // 30 seconds
};
```

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run test:smoke

# Run single test with debugging
cucumber-js --tags "@debug" --format progress-bar
```

### Log Analysis

```bash
# View recent logs
tail -f logs/test-execution.log

# Search for errors
grep "ERROR" logs/test-execution.log

# Filter by scenario
grep "scenario-123" logs/test-execution.log
```

---

## Framework Enhancement

### Adding New Applications

1. **Create Application Directory**
   ```bash
   mkdir src/applications/new-app
   mkdir src/applications/new-app/pages
   mkdir src/applications/new-app/steps
   mkdir src/applications/new-app/features
   ```

2. **Implement Page Objects**
   ```typescript
   export class NewAppLoginPage extends BasePage {
     // Implement page-specific methods
   }
   ```

3. **Add to Page Factory**
   ```typescript
   getNewAppLoginPage(): NewAppLoginPage {
     return new NewAppLoginPage(this.page);
   }
   ```

4. **Create Step Definitions**
   ```typescript
   Given('I am on the new app login page', async function() {
     // Implementation
   });
   ```

### Adding New Environments

1. **Create Configuration File**
   ```bash
   cp config/T5.json config/T6.json
   ```

2. **Update Configuration**
   ```json
   {
     "environment": "T6",
     "type": "production",
     "appUrl": "https://prod.example.com"
   }
   ```

3. **Update ConfigManager** (if needed)
   ```typescript
   const validEnvironments = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
   ```

### Adding New Features

1. **Database Integration** (Currently Disabled)
   - Enable `src/db.disabled/` module
   - Implement database connection managers
   - Add database step definitions

2. **API Testing** (Currently Disabled)
   - Enable `src/api.disabled/` module
   - Implement API client utilities
   - Add API step definitions

3. **Mobile Testing**
   - Add mobile device configurations
   - Implement mobile-specific page objects
   - Add mobile test scenarios

4. **Visual Testing**
   - Integrate visual comparison libraries
   - Add screenshot comparison utilities
   - Implement visual regression tests

### Performance Optimization

1. **Parallel Execution**
   - Configure worker processes
   - Implement test isolation
   - Optimize resource usage

2. **Browser Optimization**
   - Implement browser pooling
   - Configure browser launch options
   - Optimize page load strategies

3. **Test Data Optimization**
   - Implement data caching
   - Use test data factories
   - Optimize database queries

### Maintenance Guidelines

1. **Regular Updates**
   - Keep dependencies updated
   - Update browser versions
   - Review and update configurations

2. **Code Quality**
   - Run linting tools
   - Implement code reviews
   - Maintain test coverage

3. **Documentation**
   - Keep documentation updated
   - Document new features
   - Maintain troubleshooting guides

---

## Conclusion

This Playwright BDD TypeScript Framework provides a robust foundation for web application testing with comprehensive features for maintainability, scalability, and reliability. The modular architecture allows for easy extension and customization based on specific project requirements.

For questions, issues, or enhancement requests, refer to the troubleshooting section or extend the framework following the guidelines provided in this document.