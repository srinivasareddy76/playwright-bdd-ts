# Quick Environment Setup - U1, QD1, and Other Environments

This is a quick reference for setting up and using U1, QD1, or any other environment with your new applications.

## 🎯 **Good News: Environments Already Supported!**

The framework **already supports** these environments out of the box:

| Environment | Group | Status | Configuration File |
|-------------|-------|--------|-------------------|
| **U1, U2, U3, U4** | uat | ✅ Ready | `config/env/uat/U1.json` |
| **QD1, QD2, QD3, QD4** | onprem | ✅ Ready | `config/env/onprem/QD1.json` |
| **D1, D2, D3** | dev | ✅ Ready | `config/env/dev/D1.json` |
| **T1, T2, T3, T4, T5** | test | ✅ Ready | `config/env/test/T5.json` |

## 🚀 **3-Step Quick Setup for New Application**

### Step 1: Update Environment Configuration (2 minutes)

#### For U1 Environment:
```bash
# Edit U1 configuration
code config/env/uat/U1.json

# Update these values for your application:
{
  "name": "U1",
  "group": "uat",
  "app": {
    "baseUrl": "https://your-app-u1.company.com",    # ← Change this
    "username": "your_u1_username",                  # ← Change this
    "password": "your_u1_password"                   # ← Change this
  }
}
```

#### For QD1 Environment:
```bash
# Edit QD1 configuration
code config/env/onprem/QD1.json

# Update these values:
{
  "name": "QD1", 
  "group": "onprem",
  "app": {
    "baseUrl": "https://your-app-qd1.internal.com", # ← Change this
    "username": "your_qd1_username",                 # ← Change this
    "password": "your_qd1_password"                  # ← Change this
  }
}
```

### Step 2: Test Environment Configuration (30 seconds)

```bash
# Test U1 environment loads correctly
cross-env APP_ENV=U1 npm run verify

# Test QD1 environment loads correctly  
cross-env APP_ENV=QD1 npm run verify
```

### Step 3: Run Tests with Your Environment (30 seconds)

```bash
# Use U1 environment with existing applications
cross-env APP_ENV=U1 npm run test:smoke              # SauceDemo on U1
cross-env APP_ENV=U1 npm run test:practicetest:smoke # PracticeTest on U1

# Use QD1 environment with existing applications
cross-env APP_ENV=QD1 npm run test:smoke             # SauceDemo on QD1
cross-env APP_ENV=QD1 npm run test:practicetest:smoke # PracticeTest on QD1
```

## 🎯 **For New Application: 5-Minute Setup**

If you need to test a completely new application (not SauceDemo or PracticeTest):

### 1. Create Application Structure (1 minute)
```bash
# Replace 'myapp' with your application name
mkdir -p src/applications/myapp/{features,steps,pages}
```

### 2. Create Basic Feature File (2 minutes)
```bash
cat > src/applications/myapp/features/myapp_smoke.feature << 'EOF'
@myapp @smoke
Feature: MyApp Smoke Tests
  Basic smoke tests for MyApp

  @smoke
  Scenario: MyApp homepage loads
    Given I navigate to MyApp homepage
    Then MyApp homepage should be displayed
EOF
```

### 3. Create Basic Page Object (1 minute)
```bash
cat > src/applications/myapp/pages/MyAppHomePage.ts << 'EOF'
import { Page } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';

export class MyAppHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToHomepage(): Promise<void> {
    const config = this.getConfig();
    await this.page.goto(config.app.baseUrl);
  }

  async isHomepageDisplayed(): Promise<boolean> {
    return await this.page.isVisible('body');
  }
}
EOF
```

### 4. Create Basic Step Definitions (1 minute)
```bash
cat > src/applications/myapp/steps/myapp_steps.ts << 'EOF'
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MyAppHomePage } from '../pages/MyAppHomePage';
import { getPage } from '../../../common/support/world';

let homePage: MyAppHomePage;

Given('I navigate to MyApp homepage', async function () {
  const page = getPage();
  homePage = new MyAppHomePage(page);
  await homePage.navigateToHomepage();
});

Then('MyApp homepage should be displayed', async function () {
  const isDisplayed = await homePage.isHomepageDisplayed();
  expect(isDisplayed).toBe(true);
});
EOF
```

### 5. Add npm Script and Test (30 seconds)
```bash
# Add to package.json scripts section:
"test:myapp:smoke": "npm run build && node copy-config.js && cross-env HEADLESS=true cucumber-js src/applications/myapp/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'"

# Test with any environment
cross-env APP_ENV=U1 npm run test:myapp:smoke
cross-env APP_ENV=QD1 npm run test:myapp:smoke
```

## 📋 **Environment Usage Examples**

### Using U1 Environment
```bash
# With existing applications
cross-env APP_ENV=U1 npm run test:smoke
cross-env APP_ENV=U1 npm run test:practicetest:smoke
cross-env APP_ENV=U1 npm run examples:api

# With your new application
cross-env APP_ENV=U1 npm run test:myapp:smoke

# Override U1 configuration at runtime
cross-env APP_ENV=U1 APP_BASE_URL=https://custom-u1.com npm run test:smoke
```

### Using QD1 Environment
```bash
# With existing applications
cross-env APP_ENV=QD1 npm run test:smoke
cross-env APP_ENV=QD1 npm run test:practicetest:smoke

# With your new application
cross-env APP_ENV=QD1 npm run test:myapp:smoke

# Override QD1 configuration at runtime
cross-env APP_ENV=QD1 APP_BASE_URL=https://qd1-internal.company.com npm run test:smoke
```

### Using Any Other Environment
```bash
# The framework supports these environments automatically:
cross-env APP_ENV=U2 npm run test:smoke
cross-env APP_ENV=U3 npm run test:smoke
cross-env APP_ENV=QD2 npm run test:smoke
cross-env APP_ENV=D1 npm run test:smoke
```

## 🔧 **Configuration Templates**

### U1 Configuration Template
```json
{
  "name": "U1",
  "group": "uat",
  "app": {
    "baseUrl": "https://your-app-u1.company.com",
    "username": "your_u1_username",
    "password": "your_u1_password"
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

### QD1 Configuration Template
```json
{
  "name": "QD1",
  "group": "onprem",
  "app": {
    "baseUrl": "https://your-app-qd1.internal.com",
    "username": "your_qd1_username", 
    "password": "your_qd1_password"
  },
  "db": {
    "oracle": {
      "host": "qd1-oracle.internal.com",
      "port": 1521,
      "serviceName": "QD1DB",
      "user": "qd1_db_user",
      "password": "qd1_db_password"
    }
  }
}
```

## 🎯 **Real-World Example**

Let's say you want to test "CustomerPortal" application on U1 environment:

### 1. Update U1 Configuration
```bash
# Edit config/env/uat/U1.json
{
  "name": "U1",
  "group": "uat", 
  "app": {
    "baseUrl": "https://customerportal-u1.company.com",
    "username": "testuser_u1",
    "password": "TestPass123"
  }
}
```

### 2. Create CustomerPortal Tests
```bash
mkdir -p src/applications/customerportal/{features,steps,pages}
# Create your feature files, page objects, and step definitions
```

### 3. Add npm Scripts
```json
{
  "test:u1:customerportal": "npm run build && node copy-config.js && cross-env APP_ENV=U1 HEADLESS=true cucumber-js src/applications/customerportal/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar",
  "test:u1:customerportal:smoke": "npm run build && node copy-config.js && cross-env APP_ENV=U1 HEADLESS=true cucumber-js src/applications/customerportal/features/*.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' --format progress-bar --tags '@smoke'"
}
```

### 4. Run Tests
```bash
npm run test:u1:customerportal:smoke
npm run test:u1:customerportal
```

## ✅ **Verification Checklist**

Before running tests with new environment:

- [ ] Environment configuration file exists
- [ ] baseUrl, username, password updated
- [ ] Environment loads: `cross-env APP_ENV=U1 npm run verify`
- [ ] Application accessible: `curl https://your-app-url.com`
- [ ] Tests run: `cross-env APP_ENV=U1 npm run test:smoke`

## 🚀 **Summary**

### **✅ What's Already Ready**
- **U1, U2, U3, U4** environments (UAT)
- **QD1, QD2, QD3, QD4** environments (On-Premise)
- **D1, D2, D3** environments (Development)
- **All configuration structure**
- **Environment switching capability**

### **✅ What You Need to Do**
1. **Update configuration** (2 minutes)
2. **Test environment** (30 seconds)
3. **Run tests** (30 seconds)
4. **Create new application** (5 minutes if needed)

### **✅ Commands to Remember**
```bash
# Test any environment with existing apps
cross-env APP_ENV=U1 npm run test:smoke
cross-env APP_ENV=QD1 npm run test:practicetest:smoke

# Override configuration at runtime
cross-env APP_ENV=U1 APP_BASE_URL=https://custom.com npm run test:smoke

# Verify environment setup
cross-env APP_ENV=U1 npm run verify
```

**The framework is ready for any environment - just update the configuration and run!** 🎯