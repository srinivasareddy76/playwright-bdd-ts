# T5 & T3 Environments Testing Guide

This guide explains how to run tests for the **T5** and **T3** environments that you have configured and available.

## 🎯 Available Environments Overview

You have two test environments configured:

| Environment | Group | Purpose | Configuration File | Default |
|-------------|-------|---------|-------------------|---------|
| **T5** | test | SauceDemo Testing | `config/env/test/T5.json` | ✅ Default |
| **T3** | test | PracticeTest Testing | `config/env/test/T3.json` | |

## 🚀 T5 Environment (SauceDemo) - Default

T5 is the **default environment** for SauceDemo testing.

### T5 Quick Commands
```bash
# T5 SauceDemo Tests (default environment)
npm run test:smoke              # Quick smoke tests
npm run test:saucedemo          # Full SauceDemo test suite
npm run test:positive           # Positive test scenarios
npm run test:negative           # Negative test scenarios
npm run test:headed             # Watch tests run (browser visible)
```

### T5 Manual Environment Setting
```bash
# Explicitly set T5 environment (same as default)
cross-env APP_ENV=T5 npm run test:smoke
cross-env APP_ENV=T5 npm run test:positive
cross-env APP_ENV=T5 npm run test:negative
cross-env APP_ENV=T5 npm run test:headed
```

### T5 Configuration
```json
{
  "name": "T5",
  "group": "test",
  "app": {
    "baseUrl": "https://saucedemo.com",
    "username": "standard_user",
    "password": "secret_sauce"
  }
}
```

## 🎯 T3 Environment (PracticeTest)

T3 is configured for PracticeTest application testing.

### T3 Quick Commands
```bash
# T3 PracticeTest Tests
npm run test:practicetest           # Full PracticeTest suite
npm run test:practicetest:smoke     # Quick smoke tests
npm run test:practicetest:positive  # Positive scenarios
npm run test:practicetest:negative  # Negative scenarios
npm run test:practicetest:headed    # Watch tests run (browser visible)
```

### T3 Manual Environment Setting
```bash
# Explicitly set T3 environment
cross-env APP_ENV=T3 npm run test:practicetest:smoke
cross-env APP_ENV=T3 npm run test:practicetest:positive
cross-env APP_ENV=T3 npm run test:practicetest:negative
cross-env APP_ENV=T3 npm run test:practicetest:headed
```

### T3 Configuration
```json
{
  "name": "T3", 
  "group": "test",
  "app": {
    "baseUrl": "https://practicetestautomation.com/practice-test-login/",
    "username": "student",
    "password": "Password123"
  }
}
```

## 📋 Complete Command Reference

### 🖥️ T5 (SauceDemo) Commands

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run test:smoke` | Quick SauceDemo smoke tests | T5 (default) |
| `npm run test:saucedemo` | Complete SauceDemo test suite | T5 (default) |
| `npm run test:positive` | Positive test scenarios | T5 (default) |
| `npm run test:negative` | Negative test scenarios | T5 (default) |
| `npm run test:headed` | Visual test execution | T5 (default) |

### 🎯 T3 (PracticeTest) Commands

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run test:practicetest` | Complete PracticeTest suite | T3 |
| `npm run test:practicetest:smoke` | Quick PracticeTest tests | T3 |
| `npm run test:practicetest:positive` | Valid login scenarios | T3 |
| `npm run test:practicetest:negative` | Invalid login scenarios | T3 |
| `npm run test:practicetest:headed` | Visual PracticeTest execution | T3 |

### 🔌 API Commands (Environment Independent)

| Command | Description | Notes |
|---------|-------------|-------|
| `npm run examples:api` | Interactive API examples | Uses JSONPlaceholder |
| `npm run test:api:simple` | Simple API test | Uses JSONPlaceholder |
| `npm run test:api:smoke` | API smoke tests | Uses JSONPlaceholder |
| `npm run test:api:posts` | Posts API tests | Uses JSONPlaceholder |
| `npm run test:api:users` | Users API tests | Uses JSONPlaceholder |

## 🔧 Environment Configuration Details

### T5 Environment (SauceDemo)
- **Application**: SauceDemo e-commerce demo
- **URL**: https://saucedemo.com
- **Test Types**: Login, product browsing, shopping cart, checkout
- **Default Environment**: Yes (used when APP_ENV not specified)

### T3 Environment (PracticeTest)
- **Application**: PracticeTest login demo
- **URL**: https://practicetestautomation.com/practice-test-login/
- **Test Types**: Login validation, error handling
- **Default Environment**: No (must specify T3)

## 🎯 Your Original Issue - Fixed!

Your original Windows command that failed:
```bash
npm run test:practicetest:smoke
```

Now works perfectly! The framework has been updated with:
- ✅ **Windows compatibility** using `cross-env`
- ✅ **Cross-platform file copying** using Node.js script
- ✅ **T3 environment** properly configured for PracticeTest

## 🚀 Recommended Testing Workflow

### 1. **Start with T5 (SauceDemo)**
```bash
# Quick verification
npm run test:smoke

# Full test suite
npm run test:saucedemo

# Watch tests run
npm run test:headed
```

### 2. **Test T3 (PracticeTest)**
```bash
# Quick verification
npm run test:practicetest:smoke

# Full test suite  
npm run test:practicetest

# Watch tests run
npm run test:practicetest:headed
```

### 3. **Test APIs**
```bash
# Interactive examples
npm run examples:api

# Quick API tests
npm run test:api:simple

# Full API suite
npm run test:api:smoke
```

## 📊 Test Reports

Tests generate environment-specific reports:

### T5 Reports
```
test-results/
├── saucedemo-report.json         # T5 SauceDemo JSON report
└── saucedemo-report.html         # T5 SauceDemo HTML report
```

### T3 Reports
```
test-results/
├── practicetest-report.json      # T3 PracticeTest JSON report
└── practicetest-report.html      # T3 PracticeTest HTML report
```

### API Reports
```
test-results/
├── api-report.json               # API JSON report
└── api-report.html               # API HTML report
```

## 🔍 Environment Verification

### Verify T5 Configuration
```bash
# Default verification (uses T5)
npm run verify

# Explicit T5 verification
cross-env APP_ENV=T5 npm run verify
```

### Verify T3 Configuration
```bash
# T3 verification
cross-env APP_ENV=T3 npm run verify
```

## 🐛 Troubleshooting

### Issue 1: T5 Tests Failing
**Check**: SauceDemo application accessibility
```bash
curl https://saucedemo.com
```

### Issue 2: T3 Tests Failing
**Check**: PracticeTest application accessibility
```bash
curl https://practicetestautomation.com/practice-test-login/
```

### Issue 3: Windows Compatibility
**Solution**: All commands now use `cross-env` and work on Windows
```bash
# These work on Windows now
npm run test:practicetest:smoke
npm run test:smoke
```

### Issue 4: Environment Not Loading
**Debug**: Check environment loading
```bash
cross-env APP_ENV=T3 node -e "console.log('Environment:', process.env.APP_ENV)"
```

## 🎯 Environment Switching Examples

### Switch Between T5 and T3
```bash
# Run SauceDemo tests on T5 (default)
npm run test:smoke

# Run PracticeTest tests on T3
npm run test:practicetest:smoke

# Run SauceDemo tests explicitly on T5
cross-env APP_ENV=T5 npm run test:smoke

# Run any test on T3
cross-env APP_ENV=T3 npm run test:smoke  # Will use T3 config
```

## 📚 Related Documentation

- **GETTING_STARTED.md** - Quick start guide
- **WINDOWS_SETUP_GUIDE.md** - Windows-specific setup (your issue)
- **FRAMEWORK_USER_GUIDE.md** - Complete framework usage
- **API_TESTING_GUIDE.md** - API testing specifics
- **SETUP_TROUBLESHOOTING.md** - Common issues and fixes

## 🎉 Success Indicators

You'll know everything is working when:

### ✅ T5 Tests Pass
```bash
npm run test:smoke
# Should show: Passing SauceDemo scenarios
```

### ✅ T3 Tests Pass
```bash
npm run test:practicetest:smoke
# Should show: Passing PracticeTest scenarios
```

### ✅ API Tests Pass
```bash
npm run examples:api
# Should show: API operations completing successfully
```

### ✅ Reports Generated
```bash
ls test-results/
# Should show: HTML and JSON report files
```

## 🚀 Ready to Test!

**Your environments are ready:**

1. **T5 (SauceDemo)** - Default environment for e-commerce testing
2. **T3 (PracticeTest)** - Configured environment for login testing
3. **API Testing** - Environment-independent JSONPlaceholder testing

**Start with:**
```bash
npm run test:smoke                    # T5 SauceDemo
npm run test:practicetest:smoke       # T3 PracticeTest  
npm run examples:api                  # API testing
```

All commands now work perfectly on Windows! 🚀