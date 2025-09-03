# Getting Started with Playwright BDD TypeScript Framework

Welcome! This guide will help you quickly get started with running front-end tests using the Playwright BDD TypeScript framework.

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- **Node.js 18+** - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/

### 2. Setup Repository
```bash
# Clone the repository
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify setup
npm run verify
```

### 3. Run Your First Tests
```bash
# Test SauceDemo application (UI)
npm run test:smoke

# Test API functionality
npm run examples:api

# Test PracticeTest application (UI)
npm run test:practicetest:smoke
```

## 📋 What You Can Test

### 🖥️ Front-End Applications

#### SauceDemo (E-commerce Demo)
- **URL**: https://saucedemo.com
- **Features**: Login, product browsing, shopping cart
- **Commands**:
  ```bash
  npm run test:saucedemo      # All tests
  npm run test:smoke          # Quick smoke tests
  npm run test:positive       # Positive scenarios
  npm run test:negative       # Error handling
  npm run test:headed         # Watch tests run (browser visible)
  ```

#### PracticeTest (Login Practice)
- **URL**: https://practicetestautomation.com/practice-test-login/
- **Features**: Login validation, error messages
- **Commands**:
  ```bash
  npm run test:practicetest           # All tests
  npm run test:practicetest:smoke     # Quick tests
  npm run test:practicetest:positive  # Valid login
  npm run test:practicetest:negative  # Invalid login
  npm run test:practicetest:headed    # Watch tests run
  ```

### 🔌 API Testing

#### JSONPlaceholder API
- **URL**: https://jsonplaceholder.typicode.com
- **Features**: Posts, Users, Comments, Todos, Albums
- **Commands**:
  ```bash
  npm run examples:api        # Interactive examples
  npm run test:api:simple     # Quick API test
  npm run test:api:smoke      # BDD API tests
  npm run test:api:posts      # Posts API tests
  npm run test:api:users      # Users API tests
  npm run test:api:comments   # Comments API tests
  ```

## 🛠️ Development Commands

### Building and Testing
```bash
npm run build               # Compile TypeScript
npm run clean              # Clean build directory
npm run lint               # Check code quality
npm run format             # Format code
npm run verify             # Verify setup
```

### Test Execution Modes
```bash
# Headless mode (default) - faster, no browser window
npm run test:smoke

# Headed mode - see browser window, slower but visual
npm run test:headed

# Specific environment
APP_ENV=T5 npm run test:smoke
```

## 📁 Project Structure

```
playwright-bdd-ts/
├── src/
│   ├── applications/           # Test applications
│   │   ├── saucedemo/         # SauceDemo tests
│   │   │   ├── features/      # BDD feature files
│   │   │   ├── steps/         # Step definitions
│   │   │   └── pages/         # Page objects
│   │   ├── practicetest/      # PracticeTest tests
│   │   └── jsonplaceholder/   # API tests
│   ├── common/                # Shared utilities
│   │   ├── pages/            # Common page objects
│   │   ├── steps/            # Common step definitions
│   │   └── support/          # Test utilities
│   └── api/                  # API testing framework
├── config/                   # Environment configurations
├── test-results/            # Test reports and screenshots
└── logs/                    # Application logs
```

## 🎯 Test Scenarios Available

### SauceDemo Tests (T5 Environment)
- ✅ **Login scenarios**: Valid/invalid credentials
- ✅ **Product browsing**: Sorting, filtering
- ✅ **Shopping cart**: Add/remove items
- ✅ **Checkout process**: Complete purchase flow
- ✅ **Error handling**: Network issues, invalid data

### PracticeTest Tests (T3 Environment)
- ✅ **Login validation**: Username/password combinations
- ✅ **Error messages**: Invalid credential handling
- ✅ **UI elements**: Form validation, button states
- ✅ **Navigation**: Page redirects and routing

### API Tests
- ✅ **CRUD operations**: Create, Read, Update, Delete
- ✅ **Data validation**: Response structure and types
- ✅ **Error handling**: 404s, invalid requests
- ✅ **Performance**: Response time validation
- ✅ **Relationships**: Data integrity across resources

## 🔧 Troubleshooting

### Common Issues and Solutions

#### "Missing script: 'build'" Error
```bash
# Pull latest changes
git pull origin main
npm install
```

#### Browser Installation Issues
```bash
# Reinstall Playwright browsers
npx playwright install --force
```

#### Network/Connectivity Issues
```bash
# Test direct access
curl https://saucedemo.com
curl https://jsonplaceholder.typicode.com/posts
```

#### Permission Issues (Windows)
```bash
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Getting Help
1. **Run verification**: `npm run verify`
2. **Check documentation**: Review guides in project root
3. **Check logs**: Look in `logs/` directory
4. **Test connectivity**: Verify access to test applications

## 📚 Documentation Guide

### Essential Reading
1. **GETTING_STARTED.md** (this file) - Quick start guide
2. **T5_T3_ENVIRONMENTS_GUIDE.md** - T5 and T3 environment testing
3. **LOCAL_SETUP_GUIDE.md** - Detailed setup instructions
4. **SETUP_CHECKLIST.md** - Step-by-step verification
5. **HOW_TO_RUN_VERIFICATION.md** - Running setup verification

### Framework Documentation
1. **FRAMEWORK_USER_GUIDE.md** - Complete framework usage
2. **API_TESTING_GUIDE.md** - API testing specifics
3. **SETUP_TROUBLESHOOTING.md** - Common issues and fixes

### Technical Details
1. **API_IMPLEMENTATION_SUMMARY.md** - Technical overview
2. **FRAMEWORK_STRUCTURE.md** - Architecture details

## 🎉 Success Indicators

You'll know everything is working when:

### ✅ Verification Passes
```bash
npm run verify
# Should show: "🎉 All checks passed! Your environment is ready for testing."
```

### ✅ Tests Execute Successfully
```bash
npm run test:smoke
# Should show: Passing scenarios with green checkmarks
```

### ✅ API Examples Work
```bash
npm run examples:api
# Should show: API operations completing successfully
```

## 🚀 Next Steps

### For Beginners
1. **Run existing tests** to see the framework in action
2. **Explore feature files** to understand BDD syntax
3. **Review step definitions** to see implementation
4. **Try different test modes** (headed vs headless)

### For Developers
1. **Write new test scenarios** in existing feature files
2. **Create new feature files** for additional test cases
3. **Implement custom step definitions** for specific needs
4. **Extend page objects** for new UI elements

### For Advanced Users
1. **Add new test applications** following existing patterns
2. **Integrate with CI/CD** pipelines
3. **Customize reporting** and logging
4. **Add database testing** capabilities

## 💡 Tips for Success

### Best Practices
- **Start with smoke tests** to verify basic functionality
- **Use headed mode** when debugging test failures
- **Check logs** in the `logs/` directory for detailed information
- **Run verification** after any environment changes

### Performance Tips
- **Use headless mode** for faster execution
- **Run specific test suites** instead of all tests
- **Leverage tags** to run targeted test scenarios
- **Monitor test execution time** and optimize slow tests

### Development Workflow
1. **Write feature files** in Gherkin syntax first
2. **Implement step definitions** to make tests pass
3. **Create page objects** for UI interactions
4. **Add assertions** for proper validation
5. **Run tests frequently** during development

## 🎯 Ready to Start!

You now have everything needed to run comprehensive front-end and API tests. The framework provides:

- **Multiple test applications** for different scenarios
- **BDD approach** for readable, maintainable tests
- **TypeScript support** for type safety and better IDE experience
- **Comprehensive documentation** for guidance
- **Automated verification** to ensure proper setup

**Start with**: `npm run verify` → `npm run test:smoke` → `npm run examples:api`

Happy Testing! 🚀