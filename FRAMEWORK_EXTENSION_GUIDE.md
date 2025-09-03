# Framework Extension Guide - Adding New Environments & Applications

This guide explains how to extend the Playwright BDD TypeScript framework to support new environments (U1, QD1, etc.) and new applications.

## 🎯 Framework Architecture Overview

The framework is designed for easy extensibility:

```
playwright-bdd-ts/
├── config/env/                    # Environment configurations
│   ├── dev/     (D1, D2, D3)     # Development environments
│   ├── test/    (T1, T3, T5)     # Test environments  
│   ├── uat/     (U1, U2, U3, U4) # UAT environments
│   └── onprem/  (QD1, QD2, QD3)  # On-premise environments
├── src/applications/              # Application-specific tests
│   ├── saucedemo/                # SauceDemo application (T5)
│   ├── practicetest/             # PracticeTest application (T3)
│   ├── jsonplaceholder/          # API testing
│   └── [your-new-app]/           # Your new application
└── package.json                  # npm scripts
```

## 🚀 Step-by-Step: Adding New Environment Support

### Step 1: Create Environment Configuration

#### For U1 Environment (UAT)
```bash
# U1 configuration is already supported in the framework
# File: config/env/uat/U1.json
```

Let me check the current U1 configuration:

```json
{
  "name": "U1",
  "group": "uat",
  "app": {
    "baseUrl": "https://u1.example.com",
    "username": "u1_user",
    "password": "CHANGE_ME"
  },
  "db": {
    "oracle": {
      "host": "u1-oracle.host",
      "port": 1521,
      "serviceName": "ORCL",
      "user": "u1_oracle_user",
      "password": "CHANGE_ME"
    },
    "postgres": {
      "host": "u1-pg.host",
      "port": 5432,
      "database": "u1_appdb",
      "user": "u1_pg_user",
      "password": "CHANGE_ME"
    }
  },
  "certs": {
    "client": {
      "pfxPath": "secrets/u1-client.pfx",
      "passphrase": "CHANGE_ME",
      "origin": "https://api.u1.example.com"
    }
  }
}
```

#### For QD1 Environment (On-Premise)
```bash
# QD1 configuration is already supported
# File: config/env/onprem/QD1.json
```

#### For New Environment (Example: P1 - Production)
```bash
# Create new environment group if needed
mkdir -p config/env/prod

# Create P1.json configuration
cat > config/env/prod/P1.json << 'EOF'
{
  "name": "P1",
  "group": "prod",
  "app": {
    "baseUrl": "https://p1.yourcompany.com",
    "username": "prod_user",
    "password": "CHANGE_ME"
  },
  "db": {
    "oracle": {
      "host": "p1-oracle.prod.com",
      "port": 1521,
      "serviceName": "PROD",
      "user": "prod_oracle_user",
      "password": "CHANGE_ME"
    }
  }
}
EOF
```

### Step 2: Update Environment Mapping (if new group)

If you're adding a completely new environment group (like 'prod'), update the configuration:

```typescript
// File: config/index.ts
const ENV_GROUP_MAP: Record<string, string> = {
  D1: 'dev', D2: 'dev', D3: 'dev',
  T1: 'test', T2: 'test', T3: 'test', T4: 'test', T5: 'test',
  U1: 'uat', U2: 'uat', U3: 'uat', U4: 'uat',
  QD1: 'onprem', QD2: 'onprem', QD3: 'onprem', QD4: 'onprem',
  P1: 'prod', P2: 'prod', P3: 'prod',  // Add new environments
};
```

## 🏗️ Step-by-Step: Adding New Application Support

### Step 1: Create Application Structure

Let's say you want to add a new application called "MyApp" for U1 environment:

```bash
# Create application directory structure
mkdir -p src/applications/myapp/{features,steps,pages}

# Create the directory structure
src/applications/myapp/
├── features/           # BDD feature files
├── steps/             # Step definitions
└── pages/             # Page objects
```

### Step 2: Create Feature Files

```bash
# Create feature file
cat > src/applications/myapp/features/myapp_login.feature << 'EOF'
@myapp @login
Feature: MyApp Login Functionality
  As a user of MyApp
  I want to be able to login
  So that I can access the application

  Background:
    Given I navigate to the MyApp login page

  @smoke @positive
  Scenario: Successful login with valid credentials
    When I enter valid username and password for MyApp
    And I click the MyApp login button
    Then I should be logged into MyApp successfully
    And I should see the MyApp dashboard

  @negative
  Scenario: Failed login with invalid credentials
    When I enter invalid username and password for MyApp
    And I click the MyApp login button
    Then I should see MyApp login error message
    And I should remain on the MyApp login page
EOF
```

### Step 3: Create Page Objects

```bash
# Create page object
cat > src/applications/myapp/pages/MyAppLoginPage.ts << 'EOF'
/**
 * MyApp Login Page Object
 * 
 * This class encapsulates the login page elements and actions for MyApp.
 * It provides methods to interact with login form elements and perform
 * login-related operations.
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';

export class MyAppLoginPage extends BasePage {
  // Page elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('.error-message');
    this.dashboardHeader = page.locator('.dashboard-header');
  }

  /**
   * Navigate to MyApp login page
   */
  async navigateToLoginPage(): Promise<void> {
    const config = this.getConfig();
    await this.page.goto(config.app.baseUrl);
    await this.waitForPageLoad();
  }

  /**
   * Enter username in the login form
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password in the login form
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Perform complete login with credentials
   * @param username - Username for login
   * @param password - Password for login
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Login with valid credentials from config
   */
  async loginWithValidCredentials(): Promise<void> {
    const config = this.getConfig();
    await this.login(config.app.username, config.app.password);
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<void> {
    await this.login('invalid_user', 'invalid_password');
  }

  /**
   * Check if login was successful
   * @returns True if dashboard is visible
   */
  async isLoginSuccessful(): Promise<boolean> {
    try {
      await this.dashboardHeader.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is visible
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if still on login page
   * @returns True if login form is still visible
   */
  async isOnLoginPage(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
EOF
```

### Step 4: Create Step Definitions

```bash
# Create step definitions
cat > src/applications/myapp/steps/myapp_login_steps.ts << 'EOF'
/**
 * MyApp Login Step Definitions
 * 
 * This file contains step definitions for MyApp login functionality.
 * It implements the Gherkin steps defined in the feature files and
 * coordinates with page objects to perform the actual test actions.
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MyAppLoginPage } from '../pages/MyAppLoginPage';
import { getPage } from '../../../common/support/world';

let myAppLoginPage: MyAppLoginPage;

// Background steps
Given('I navigate to the MyApp login page', async function () {
  const page = getPage();
  myAppLoginPage = new MyAppLoginPage(page);
  await myAppLoginPage.navigateToLoginPage();
});

// When steps - Actions
When('I enter valid username and password for MyApp', async function () {
  await myAppLoginPage.loginWithValidCredentials();
});

When('I enter invalid username and password for MyApp', async function () {
  await myAppLoginPage.loginWithInvalidCredentials();
});

When('I click the MyApp login button', async function () {
  await myAppLoginPage.clickLoginButton();
});

// Then steps - Assertions
Then('I should be logged into MyApp successfully', async function () {
  const isLoggedIn = await myAppLoginPage.isLoginSuccessful();
  expect(isLoggedIn).toBe(true);
});

Then('I should see the MyApp dashboard', async function () {
  const isLoggedIn = await myAppLoginPage.isLoginSuccessful();
  expect(isLoggedIn).toBe(true);
});

Then('I should see MyApp login error message', async function () {
  const hasError = await myAppLoginPage.isErrorMessageDisplayed();
  expect(hasError).toBe(true);
});

Then('I should remain on the MyApp login page', async function () {
  const isOnLoginPage = await myAppLoginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});
EOF
```

### Step 5: Add npm Scripts for New Environment/Application

Add scripts to `package.json`:

```json
{
  "scripts": {
    // U1 Environment Scripts
    "test:u1:myapp": "npm run build && node copy-config.js && cross-env APP_ENV=U1 HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --format json:test-results/u1-myapp-report.json --format html:test-results/u1-myapp-report.html",
    "test:u1:myapp:smoke": "npm run build && node copy-config.js && cross-env APP_ENV=U1 HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'",
    "test:u1:myapp:headed": "npm run build && node copy-config.js && cross-env APP_ENV=U1 HEADLESS=false cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'",
    
    // QD1 Environment Scripts
    "test:qd1:myapp": "npm run build && node copy-config.js && cross-env APP_ENV=QD1 HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --format json:test-results/qd1-myapp-report.json --format html:test-results/qd1-myapp-report.html",
    "test:qd1:myapp:smoke": "npm run build && node copy-config.js && cross-env APP_ENV=QD1 HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'",
    
    // Generic environment scripts (can be used with any environment)
    "test:myapp": "npm run build && node copy-config.js && cross-env HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar",
    "test:myapp:smoke": "npm run build && node copy-config.js && cross-env HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'"
  }
}
```

## 🎯 Usage Examples

### Using U1 Environment with New Application

```bash
# Update U1 configuration for your application
code config/env/uat/U1.json

# Update the baseUrl and credentials:
{
  "name": "U1",
  "group": "uat",
  "app": {
    "baseUrl": "https://myapp-u1.company.com",
    "username": "u1_myapp_user",
    "password": "u1_myapp_password"
  }
}

# Run tests
npm run test:u1:myapp:smoke
npm run test:u1:myapp
npm run test:u1:myapp:headed
```

### Using QD1 Environment with New Application

```bash
# Update QD1 configuration
code config/env/onprem/QD1.json

# Update for your on-premise application:
{
  "name": "QD1",
  "group": "onprem", 
  "app": {
    "baseUrl": "https://myapp-qd1.internal.company.com",
    "username": "qd1_myapp_user",
    "password": "qd1_myapp_password"
  }
}

# Run tests
npm run test:qd1:myapp:smoke
npm run test:qd1:myapp
```

### Using Any Environment Dynamically

```bash
# Use environment variables to override any environment
cross-env APP_ENV=U1 npm run test:myapp:smoke
cross-env APP_ENV=QD1 npm run test:myapp:smoke
cross-env APP_ENV=P1 npm run test:myapp:smoke

# Override configuration at runtime
cross-env APP_ENV=U1 APP_BASE_URL=https://custom-url.com npm run test:myapp:smoke
```

## 🔧 Configuration Customization

### Environment-Specific Overrides

```bash
# Override U1 configuration at runtime
cross-env APP_ENV=U1 APP_BASE_URL=https://u1-myapp.company.com APP_USERNAME=custom_user npm run test:myapp:smoke

# Override QD1 configuration
cross-env APP_ENV=QD1 APP_BASE_URL=https://qd1-internal.company.com npm run test:myapp:smoke
```

### Database Configuration (if needed)

```json
{
  "name": "U1",
  "group": "uat",
  "app": {
    "baseUrl": "https://myapp-u1.company.com",
    "username": "u1_user",
    "password": "u1_password"
  },
  "db": {
    "oracle": {
      "host": "u1-oracle.company.com",
      "port": 1521,
      "serviceName": "U1DB",
      "user": "u1_db_user",
      "password": "u1_db_password"
    }
  }
}
```

## 📋 Quick Setup Checklist

### For New Environment (e.g., U1):
- [ ] ✅ Environment already supported (U1, QD1, etc.)
- [ ] Update configuration file (`config/env/uat/U1.json`)
- [ ] Set correct baseUrl, username, password
- [ ] Test configuration: `cross-env APP_ENV=U1 npm run verify`

### For New Application:
- [ ] Create application directory: `src/applications/myapp/`
- [ ] Create feature files: `src/applications/myapp/features/`
- [ ] Create page objects: `src/applications/myapp/pages/`
- [ ] Create step definitions: `src/applications/myapp/steps/`
- [ ] Add npm scripts to `package.json`
- [ ] Test the application: `npm run test:myapp:smoke`

### For New Environment + New Application:
- [ ] Follow both checklists above
- [ ] Create environment-specific npm scripts
- [ ] Test combination: `npm run test:u1:myapp:smoke`

## 🚀 Testing Your Extension

### Step 1: Verify Environment Configuration
```bash
# Test environment loading
cross-env APP_ENV=U1 node -e "
const { loadConfig } = require('./dist/config/index.js');
console.log('Config loaded:', loadConfig());
"
```

### Step 2: Test Application Structure
```bash
# Build and verify structure
npm run build
ls -la dist/src/applications/myapp/
```

### Step 3: Run Tests
```bash
# Test with specific environment
npm run test:u1:myapp:smoke

# Test with dynamic environment
cross-env APP_ENV=QD1 npm run test:myapp:smoke
```

## 🎯 Best Practices

### 1. **Environment Naming Convention**
- **Development**: D1, D2, D3
- **Test**: T1, T2, T3, T4, T5
- **UAT**: U1, U2, U3, U4
- **On-Premise**: QD1, QD2, QD3
- **Production**: P1, P2, P3 (if needed)

### 2. **Application Naming Convention**
- Use lowercase with hyphens: `my-app`, `customer-portal`
- Keep names short and descriptive
- Match your actual application names

### 3. **Configuration Management**
- Never commit real passwords
- Use environment variables for sensitive data
- Keep configuration files minimal and focused

### 4. **Testing Strategy**
- Start with smoke tests (`@smoke` tag)
- Add positive scenarios (`@positive` tag)
- Include negative scenarios (`@negative` tag)
- Use descriptive scenario names

## 🔍 Troubleshooting New Extensions

### Issue 1: Environment Not Found
```bash
# Error: Unknown environment: U1
# Solution: Check ENV_GROUP_MAP in config/index.ts
```

### Issue 2: Configuration File Not Found
```bash
# Error: Configuration file not found
# Solution: Ensure file exists at correct path
ls config/env/uat/U1.json
```

### Issue 3: Step Definitions Not Found
```bash
# Error: Step definition missing
# Solution: Check step file compilation
ls dist/src/applications/myapp/steps/
```

### Issue 4: Page Object Issues
```bash
# Error: Cannot find page elements
# Solution: Verify selectors and page structure
```

## 📚 Related Documentation

- **T5_T3_ENVIRONMENTS_GUIDE.md** - Current environment examples
- **FRAMEWORK_USER_GUIDE.md** - Complete framework usage
- **API_TESTING_GUIDE.md** - API testing patterns
- **WINDOWS_SETUP_GUIDE.md** - Windows compatibility

## 🎉 Summary

The framework supports **any environment** out of the box:

### ✅ **Already Supported Environments**
- **U1, U2, U3, U4** (UAT)
- **QD1, QD2, QD3, QD4** (On-Premise)  
- **D1, D2, D3** (Development)
- **T1, T2, T3, T4, T5** (Test)

### ✅ **To Add New Application**
1. Create application structure
2. Write feature files
3. Create page objects
4. Add step definitions
5. Add npm scripts
6. Update environment configuration

### ✅ **To Use Any Environment**
```bash
# Just update the configuration and run
cross-env APP_ENV=U1 npm run test:myapp:smoke
cross-env APP_ENV=QD1 npm run test:myapp:smoke
```

**The framework is fully extensible and ready for any environment or application!** 🚀