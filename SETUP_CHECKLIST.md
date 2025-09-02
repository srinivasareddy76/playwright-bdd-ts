# Local Setup Checklist

Use this checklist to ensure your local environment is properly configured for running front-end tests.

## ✅ Prerequisites Checklist

### Software Installation
- [ ] **Node.js 18+** installed and accessible via command line
  ```bash
  node --version  # Should show v18.x.x or higher
  npm --version   # Should show 9.x.x or higher
  ```

- [ ] **Git** installed and configured
  ```bash
  git --version   # Should show git version
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

- [ ] **Visual Studio Code** (recommended) or preferred IDE installed

### Repository Setup
- [ ] **Repository cloned** to local machine
  ```bash
  git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
  cd playwright-bdd-ts
  ```

- [ ] **Dependencies installed** successfully
  ```bash
  npm install  # Should complete without errors
  ```

- [ ] **Playwright browsers installed**
  ```bash
  npx playwright install  # Downloads Chromium, Firefox, WebKit
  ```

## ✅ Build and Configuration

### Project Build
- [ ] **TypeScript compilation** works
  ```bash
  npm run build  # Should complete without errors
  ```

- [ ] **Available scripts** listed correctly
  ```bash
  npm run  # Should show all available scripts including build, test:saucedemo, etc.
  ```

### Environment Configuration
- [ ] **Config files** present in `config/env/` directory
- [ ] **Environment variables** can be set (optional)
  ```bash
  # Windows
  set APP_ENV=T5
  set HEADLESS=true
  
  # macOS/Linux
  export APP_ENV=T5
  export HEADLESS=true
  ```

## ✅ Test Application Access

### Web Applications
- [ ] **SauceDemo** accessible in browser
  - URL: https://saucedemo.com
  - Should load login page

- [ ] **PracticeTest** accessible in browser
  - URL: https://practicetestautomation.com/practice-test-login/
  - Should load login form

- [ ] **JSONPlaceholder API** accessible
  - URL: https://jsonplaceholder.typicode.com/posts
  - Should return JSON data

### Network Connectivity
- [ ] **No firewall blocking** test applications
- [ ] **Internet connection** stable and fast enough for testing
- [ ] **Corporate proxy** configured if needed

## ✅ Test Execution Verification

### SauceDemo Tests
- [ ] **Smoke test** runs successfully
  ```bash
  npm run test:smoke
  # Should pass with green checkmarks
  ```

- [ ] **Headed mode** works (browser visible)
  ```bash
  npm run test:headed
  # Should open browser and run test visibly
  ```

### PracticeTest Tests
- [ ] **PracticeTest smoke test** runs successfully
  ```bash
  npm run test:practicetest:smoke
  # Should pass login test
  ```

### API Tests
- [ ] **Simple API test** runs successfully
  ```bash
  npm run test:api:simple
  # Should test JSONPlaceholder API operations
  ```

- [ ] **API examples** run successfully
  ```bash
  npm run examples:api
  # Should demonstrate comprehensive API testing
  ```

## ✅ Development Environment

### IDE Configuration (VSCode)
- [ ] **TypeScript support** working (syntax highlighting, IntelliSense)
- [ ] **Recommended extensions** installed:
  - [ ] Playwright Test for VSCode
  - [ ] Cucumber (Gherkin) Full Support
  - [ ] ESLint
  - [ ] Prettier - Code formatter

### Code Quality Tools
- [ ] **Linting** works
  ```bash
  npm run lint  # Should check code quality
  ```

- [ ] **Formatting** works
  ```bash
  npm run format  # Should format TypeScript files
  ```

### File Structure
- [ ] **Project structure** matches expected layout:
  ```
  playwright-bdd-ts/
  ├── src/applications/saucedemo/     ✓
  ├── src/applications/practicetest/  ✓
  ├── src/applications/jsonplaceholder/ ✓
  ├── src/common/                     ✓
  ├── src/api/                        ✓
  ├── config/                         ✓
  ├── package.json                    ✓
  └── README.md                       ✓
  ```

## ✅ Advanced Features (Optional)

### Database Testing
- [ ] **Oracle client** installed (if testing Oracle DB)
- [ ] **PostgreSQL client** installed (if testing PostgreSQL)
- [ ] **Database connections** configured in environment files

### Certificate Testing
- [ ] **PFX certificates** available (if testing mTLS)
- [ ] **Certificate paths** configured correctly

## 🚨 Troubleshooting Quick Fixes

If any checklist item fails, try these solutions:

### Build Issues
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Browser Issues
```bash
# Reinstall Playwright browsers
npx playwright install --force
```

### Permission Issues (Windows)
```bash
# Run as Administrator or use PowerShell as Admin
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Network Issues
```bash
# Test direct connectivity
curl https://saucedemo.com
curl https://jsonplaceholder.typicode.com/posts
```

## ✅ Ready to Test!

Once all items are checked, you're ready to:

1. **Run existing tests** to verify everything works
2. **Explore the codebase** to understand the framework
3. **Write new tests** for your specific needs
4. **Extend the framework** with additional applications

### Quick Test Commands
```bash
# Test all major components
npm run test:smoke              # SauceDemo UI tests
npm run test:practicetest:smoke # PracticeTest UI tests  
npm run test:api:simple         # API tests
npm run examples:api            # API examples
```

### Next Steps
- Review `FRAMEWORK_USER_GUIDE.md` for detailed usage
- Check `API_TESTING_GUIDE.md` for API testing specifics
- Explore feature files in `src/applications/*/features/`
- Start writing your own test scenarios

**Congratulations! Your local environment is ready for front-end testing! 🎉**