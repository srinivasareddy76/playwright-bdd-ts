# Quick Setup Guide - Playwright BDD TypeScript Framework

This guide will help you quickly set up and run the Playwright BDD TypeScript framework on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git

# Navigate to the project directory
cd playwright-bdd-ts
```

## Step 2: Install Dependencies

```bash
# Install all npm dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install system dependencies for Playwright (Linux/macOS)
npx playwright install-deps
```

### For Windows Users:
If you encounter issues with browser installation on Windows, run:
```bash
# Install browsers with system dependencies
npx playwright install --with-deps
```

## Step 3: Verify Installation

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Verify Playwright installation
npx playwright --version

# Check if TypeScript is available
npx tsc --version
```

## Step 4: Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build
```

This will create a `dist/` folder with compiled JavaScript files.

## Step 5: Environment Configuration

The framework supports multiple environments (T1, T2, T3, T4, T5). Each environment has its own configuration file in the `config/` directory.

### Available Environments:

| Environment | Type | Purpose | Default App URL |
|-------------|------|---------|-----------------|
| T1 | Development | Local development | https://saucedemo.com |
| T2 | Integration | Integration testing | https://saucedemo.com |
| T3 | Staging | Pre-production testing | https://saucedemo.com |
| T4 | Performance | Performance testing | https://saucedemo.com |
| T5 | Test | Functional testing | https://saucedemo.com |

### Set Environment Variable:

**For Windows (Command Prompt):**
```cmd
set APP_ENV=T5
```

**For Windows (PowerShell):**
```powershell
$env:APP_ENV="T5"
```

**For macOS/Linux:**
```bash
export APP_ENV=T5
```

### Optional Environment Variables:

```bash
# Set browser mode (default: true for headless)
export HEADLESS=false          # Run in headed mode (visible browser)
export HEADLESS=true           # Run in headless mode (background)

# Set browser type (default: chromium)
export BROWSER=chromium        # Use Chrome/Chromium
export BROWSER=firefox         # Use Firefox
export BROWSER=webkit          # Use Safari/WebKit

# Set timeout (default: 30000ms)
export TIMEOUT=60000           # 60 seconds timeout
```

## Step 6: Run Tests

### Quick Test Run (Smoke Tests):
```bash
# Run smoke tests with T5 environment
npm run test:smoke
```

### Run All SauceDemo Tests:
```bash
# Run all SauceDemo application tests
npm run test:saucedemo
```

### Run Practice Test Automation Tests:
```bash
# Run practice automation tests
npm run test:practice
```

### Run Tests with Different Environments:

**T3 Environment:**
```bash
APP_ENV=T3 npm run test:smoke
```

**T1 Environment:**
```bash
APP_ENV=T1 npm run test:smoke
```

### Run Tests in Headed Mode (Visible Browser):
```bash
HEADLESS=false npm run test:smoke
```

### Run Tests with Firefox:
```bash
BROWSER=firefox npm run test:smoke
```

### Run Tests with Custom Environment and Settings:
```bash
APP_ENV=T3 HEADLESS=false BROWSER=firefox npm run test:smoke
```

## Step 7: View Test Results

After running tests, you can find:

- **Console Output**: Real-time test execution logs
- **Screenshots**: Captured automatically on failures (if configured)
- **Reports**: Generated in the `reports/` directory (if configured)

### Sample Successful Test Output:
```
info: ================================================================================ 
info: STARTING TEST EXECUTION 
info: ================================================================================ 
info: Loading configuration for environment: T5 
info: Configuration loaded successfully for T5 (test) 
info: Environment: T5 (test) 
info: App URL: https://saucedemo.com 
...
1 scenario (1 passed)
5 steps (5 passed)
0m01.074s (executing steps: 0m00.964s)
```

## Step 8: Customize Configuration (Optional)

If you need to modify environment settings:

1. **Edit Environment Config:**
   ```bash
   # Edit T5 environment configuration
   nano config/T5.json
   # or use your preferred editor
   code config/T5.json
   ```

2. **Example Configuration Update:**
   ```json
   {
     "environment": "T5",
     "type": "test",
     "appUrl": "https://your-custom-url.com",
     "database": {
       "type": "PostgreSQL",
       "subtype": "Cloud"
     }
   }
   ```

## Troubleshooting

### Common Issues and Solutions:

#### 1. **Node.js Version Issues:**
```bash
# Check Node.js version
node --version

# If version is below 16, update Node.js
# Download from: https://nodejs.org/
```

#### 2. **Playwright Browser Installation Issues:**
```bash
# Clear Playwright cache and reinstall
npx playwright uninstall --all
npx playwright install
npx playwright install-deps
```

#### 3. **Permission Issues (macOS/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### 4. **Build Errors:**
```bash
# Clean and rebuild
rm -rf dist/
rm -rf node_modules/
npm install
npm run build
```

#### 5. **Environment Variable Not Set:**
```bash
# Verify environment variable
echo $APP_ENV          # macOS/Linux
echo %APP_ENV%          # Windows CMD
echo $env:APP_ENV       # Windows PowerShell
```

#### 6. **Port/Network Issues:**
If you encounter network-related issues, check:
- Firewall settings
- Proxy configurations
- Network connectivity to test URLs

## Available Test Commands

```bash
# Build project
npm run build

# Run smoke tests (quick validation)
npm run test:smoke

# Run all regression tests
npm run test:regression

# Run SauceDemo application tests
npm run test:saucedemo

# Run Practice Test Automation tests
npm run test:practice
```

## Advanced Usage

### Run Specific Feature Files:
```bash
# Run specific feature file
npx cucumber-js src/applications/saucedemo/features/saucedemo_login.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js'
```

### Run Tests with Tags:
```bash
# Run only smoke tests
npx cucumber-js --tags "@smoke" --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js'

# Run positive test cases only
npx cucumber-js --tags "@positive" --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js'

# Run tests excluding certain tags
npx cucumber-js --tags "not @skip" --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js'
```

### Run Tests in Parallel:
```bash
# Run tests in parallel with 4 workers
npx cucumber-js --parallel 4 --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js'
```

## Next Steps

1. **Explore the Framework**: Check out `FRAMEWORK_USER_GUIDE.md` for detailed documentation
2. **Review Test Cases**: Look at feature files in `src/applications/*/features/`
3. **Understand Page Objects**: Examine page objects in `src/applications/*/pages/`
4. **Customize Tests**: Modify or add new test scenarios as needed
5. **Configure CI/CD**: Set up continuous integration for automated testing

## Support

For detailed framework documentation, architecture, and advanced usage, refer to:
- `FRAMEWORK_USER_GUIDE.md` - Comprehensive framework documentation
- `README.md` - Project overview and basic information

## Quick Validation

To ensure everything is set up correctly, run this quick validation:

```bash
# 1. Verify build works
npm run build

# 2. Run a quick smoke test
npm run test:smoke

# 3. If successful, you should see output like:
# "1 scenario (1 passed)"
# "5 steps (5 passed)"
```

If all steps pass, your setup is complete and ready for testing! 🎉