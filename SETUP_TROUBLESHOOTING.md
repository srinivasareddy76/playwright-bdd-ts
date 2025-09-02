# Setup Troubleshooting Guide

## Issue: "npm error Missing script: 'build'"

If you're getting an error that the `build` script is missing, this means your local copy of the repository is not up to date with the latest changes.

### Solution

1. **Pull the latest changes from the repository:**
   ```bash
   git pull origin main
   ```

2. **Verify the package.json has been updated:**
   ```bash
   npm run
   ```
   You should see the `build` script listed along with all the new API testing scripts.

3. **Install any missing dependencies:**
   ```bash
   npm install
   ```

4. **Test the build command:**
   ```bash
   npm run build
   ```

### Available Scripts After Update

Once you pull the latest changes, you'll have access to these new scripts:

#### API Testing Scripts
```bash
# Run comprehensive API examples
npm run examples:api

# Run simple API test (no BDD framework)
npm run test:api:simple

# Run BDD API tests
npm run test:api:jsonplaceholder
npm run test:api:smoke
npm run test:api:posts
npm run test:api:users
npm run test:api:comments

# Run API-only tests (without browser dependencies)
npm run test:api:only
```

#### Build and Development Scripts
```bash
# Build TypeScript to JavaScript
npm run build

# Clean build directory
npm run clean

# Run linting
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

#### Existing UI Testing Scripts
```bash
# SauceDemo tests
npm run test:saucedemo
npm run test:smoke
npm run test:positive
npm run test:negative
npm run test:headed

# PracticeTest tests
npm run test:practicetest
npm run test:practicetest:smoke
npm run test:practicetest:positive
npm run test:practicetest:negative
npm run test:practicetest:headed
```

### What's New

The latest update includes:

1. **Complete RESTful API Testing Framework**
   - JSONPlaceholder API integration
   - Full CRUD operations (GET, POST, PUT, PATCH, DELETE)
   - Comprehensive data validation
   - Performance testing capabilities

2. **BDD Feature Files**
   - 50+ test scenarios for API testing
   - Posts, Users, Comments API coverage
   - Error handling and edge cases

3. **TypeScript Models**
   - Type-safe API interfaces
   - Response validators
   - Test data generators

4. **Documentation**
   - `API_TESTING_GUIDE.md` - Comprehensive usage guide
   - `API_IMPLEMENTATION_SUMMARY.md` - Technical overview
   - Working examples and code samples

### Quick Test

After pulling the changes, test the API framework:

```bash
# Test the simple API client
npm run test:api:simple

# Run comprehensive API examples
npm run examples:api
```

Both should work without any browser dependencies and demonstrate the full API testing capabilities.

### File Structure After Update

```
src/
├── api/                           # API testing framework (enabled)
│   ├── BaseApiClient.ts          # Core HTTP client
│   └── ApiClientFactory.ts       # Client factory
├── applications/
│   └── jsonplaceholder/          # JSONPlaceholder API tests
│       ├── api/                  # API client implementation
│       ├── features/             # BDD feature files
│       ├── steps/                # Step definitions
│       ├── models/               # Data models and validators
│       ├── data/                 # Test data and generators
│       └── examples/             # Usage examples
```

### Support Files

```
API_TESTING_GUIDE.md              # Complete usage documentation
API_IMPLEMENTATION_SUMMARY.md     # Technical implementation details
run-api-examples.js               # API examples runner
test-api-simple.js                # Simple API test
run-api-tests.js                  # BDD API test runner
```

If you continue to have issues after pulling the latest changes, please check:

1. **Node.js version**: Ensure you have Node.js 16+ installed
2. **npm version**: Use npm 8+ for best compatibility
3. **TypeScript**: The project uses TypeScript 5.x
4. **Dependencies**: Run `npm install` to ensure all packages are installed

The API testing framework is fully functional and ready to use!