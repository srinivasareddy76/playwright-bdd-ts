# Getting Started with Playwright BDD TypeScript Framework

## Overview

This framework provides a comprehensive BDD (Behavior-Driven Development) testing solution using Playwright and TypeScript. It supports multiple applications and environments with a clean, maintainable architecture.

## Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify setup
node verify-setup.js
```

## Environment Configuration

### Available Environments
- **T5**: SauceDemo application testing (https://saucedemo.com)
- **T3**: PracticeTest application testing (https://practicetestautomation.com)
- **U1**: UAT environment
- **D1**: Development environment
- **QD1**: On-premise environment

### Setting Environment Variables

#### Cross-Platform (Recommended)
```bash
# Install cross-env for cross-platform compatibility
npm install -g cross-env

# Use with any command
npx cross-env APP_ENV=T5 npm run test:saucedemo
npx cross-env APP_ENV=T3 npm run test:practicetest
```

#### Platform-Specific
```bash
# Linux/macOS
export APP_ENV=T5

# Windows CMD
set APP_ENV=T5

# Windows PowerShell
$env:APP_ENV="T5"
```

## Running Tests

### SauceDemo Tests (T5 Environment)
```bash
# Run all SauceDemo tests
npm run test:saucedemo

# With specific environment
npx cross-env APP_ENV=T5 npm run test:saucedemo

# Run specific scenarios with tags
npm run test:saucedemo -- --tags "@smoke"
npm run test:saucedemo -- --tags "@positive"
npm run test:saucedemo -- --tags "@performance"
```

### PracticeTest Tests (T3 Environment)
```bash
# Run PracticeTest tests
npx cross-env APP_ENV=T3 npm run test:practicetest
```

### API Tests
```bash
# Run JSONPlaceholder API tests
npm run test:api

# Run API examples
npm run api:examples

# Simple API test
node test-api-simple.js
```

## Test Data and Users

### SauceDemo Users
All users use password: `secret_sauce`
- `standard_user` - Normal user
- `locked_out_user` - Locked account (for error testing)
- `problem_user` - User with visual/functional issues
- `performance_glitch_user` - Slow performance user (10s timeout)
- `error_user` - User with app-specific errors
- `visual_user` - User with visual differences

### PracticeTest Credentials
- Username: `student`
- Password: `Password123`

## Configuration Management

### Environment-Specific Settings
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

### Runtime Overrides
Override configuration via environment variables:
```bash
# Override base URL
export APP_BASE_URL="https://custom-saucedemo.com"

# Override credentials
export APP_USERNAME="custom_user"
export APP_PASSWORD="custom_password"
```

## API Testing

### JSONPlaceholder API
Base URL: `https://jsonplaceholder.typicode.com`

Available endpoints:
- `/posts` - Blog posts (100 items)
- `/users` - Users (10 items)
- `/comments` - Comments (500 items)
- `/albums` - Albums (100 items)
- `/photos` - Photos (5000 items)
- `/todos` - Todos (200 items)

### API Test Examples
```bash
# Test all posts endpoint
node test-api-simple.js

# Run comprehensive API tests
npm run test:api
```

## Framework Structure

```
playwright-bdd-ts/
├── config/                     # Environment configurations
│   ├── env/test/T5.json        # SauceDemo config
│   ├── env/test/T3.json        # PracticeTest config
│   └── env/uat/U1.json         # UAT config
├── src/
│   ├── applications/           # Application-specific code
│   │   ├── saucedemo/         # SauceDemo implementation
│   │   ├── practicetest/      # PracticeTest implementation
│   │   └── jsonplaceholder/   # API testing
│   ├── common/                # Shared utilities
│   └── utils/                 # Framework utilities
└── Documentation files
```

## Troubleshooting

### Common Issues

#### 1. Environment Variable Not Set
**Error**: `Unknown environment: undefined`
**Solution**: Set APP_ENV environment variable
```bash
npx cross-env APP_ENV=T5 npm run test:saucedemo
```

#### 2. Playwright Browsers Not Installed
**Error**: `browserType.launch: Executable doesn't exist`
**Solution**: Install Playwright browsers
```bash
npx playwright install
```

#### 3. Configuration File Not Found
**Error**: `Configuration file not found`
**Solution**: Ensure environment configuration exists
```bash
ls config/env/test/T5.json  # Should exist
```

#### 4. Cross-Platform Environment Variables
**Issue**: Environment variables work differently on Windows/Linux
**Solution**: Use cross-env for consistency
```bash
npm install -g cross-env
npx cross-env APP_ENV=T5 npm run test
```

### Windows-Specific Setup

#### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Environment Variables in Windows
```cmd
# CMD
set APP_ENV=T5 && npm run test:saucedemo

# PowerShell
$env:APP_ENV="T5"; npm run test:saucedemo

# cross-env (recommended)
npx cross-env APP_ENV=T5 npm run test:saucedemo
```

## Performance Testing

### Response Time Validation
```bash
# Test login performance
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@performance"
```

### Expected Performance Thresholds
- Standard user login: < 5 seconds
- Performance glitch user: < 10 seconds
- API responses: < 2 seconds

## Test Execution Examples

### Basic Test Execution
```bash
# SauceDemo smoke tests
npx cross-env APP_ENV=T5 npx cucumber-js src/applications/saucedemo/features/ --tags "@smoke"

# All SauceDemo login tests
npx cross-env APP_ENV=T5 npx cucumber-js src/applications/saucedemo/features/saucedemo_login.feature

# PracticeTest login tests
npx cross-env APP_ENV=T3 npx cucumber-js src/applications/practicetest/features/practicetest_login.feature
```

### Advanced Test Execution
```bash
# Performance tests
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@performance"

# Negative test scenarios
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@negative"

# Data-driven tests
npx cross-env APP_ENV=T5 npx cucumber-js --tags "@data_driven"
```

## Extending the Framework

### Adding New Applications
1. Create directory: `src/applications/newapp/`
2. Add page objects: `src/applications/newapp/pages/`
3. Add step definitions: `src/applications/newapp/steps/`
4. Add feature files: `src/applications/newapp/features/`
5. Add configuration: `config/env/test/NEW.json`

### Adding New Environments
1. Create config file: `config/env/group/ENV.json`
2. Update environment mapping in `config/index.ts`
3. Test with: `npx cross-env APP_ENV=NEW npm run test`

## Cross-Platform Environment Variables

### Why cross-env?
Different operating systems handle environment variables differently:

#### Linux/macOS
```bash
APP_ENV=T5 npm run test
```

#### Windows CMD
```cmd
set APP_ENV=T5 && npm run test
```

#### Windows PowerShell
```powershell
$env:APP_ENV="T5"; npm run test
```

#### cross-env Solution (Works Everywhere)
```bash
npx cross-env APP_ENV=T5 npm run test
```

### Framework Usage with cross-env
```bash
# Single environment variable
npx cross-env APP_ENV=T5 node verify-setup.js

# Multiple environment variables
npx cross-env APP_ENV=U1 HEADLESS=false npm run test

# Different environments
npx cross-env APP_ENV=T5 npm run test:saucedemo  # SauceDemo
npx cross-env APP_ENV=T3 npm run test:practicetest  # PracticeTest
npx cross-env APP_ENV=U1 npm run test:uat  # UAT environment
```

## Next Steps

1. **Review Technical Documentation**: See [CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md) for detailed class and method documentation
2. **Explore Repository Structure**: Check [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) for complete file organization
3. **Run Example Tests**: Start with smoke tests to verify setup
4. **Customize Configuration**: Modify environment files for your needs

## Support

For detailed technical information about classes, methods, and architecture patterns, refer to:
- [CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md) - Comprehensive technical documentation
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - Complete file structure reference