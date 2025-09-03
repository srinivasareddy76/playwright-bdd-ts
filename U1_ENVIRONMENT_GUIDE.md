# U1 Environment Testing Guide

This guide explains how to run tests specifically for the **U1 (UAT - User Acceptance Testing)** environment.

## 🎯 U1 Environment Overview

The U1 environment is configured as a **UAT (User Acceptance Testing)** environment with:

- **Environment Group**: `uat` (User Acceptance Testing)
- **Base URL**: `https://u1.example.com`
- **Database Support**: Oracle and PostgreSQL
- **Certificate Support**: Client certificates for secure API access
- **Configuration File**: `config/env/uat/U1.json`

## 🚀 Quick Start - U1 Testing

### Easy U1-Specific Commands (Recommended)

```bash
# U1 SauceDemo Tests
npm run test:u1:smoke              # Quick smoke tests
npm run test:u1:saucedemo          # Full SauceDemo test suite
npm run test:u1:headed             # Watch tests run (browser visible)

# U1 PracticeTest Tests  
npm run test:u1:practicetest       # Full PracticeTest suite
npm run test:u1:practicetest:smoke # Quick PracticeTest smoke tests

# U1 API Tests
npm run test:u1:api                # Full API test suite
npm run test:u1:api:smoke          # Quick API smoke tests
```

### Manual Environment Setting

If you prefer to set the environment manually:

```bash
# SauceDemo Tests for U1
cross-env APP_ENV=U1 npm run test:smoke
cross-env APP_ENV=U1 npm run test:positive
cross-env APP_ENV=U1 npm run test:negative
cross-env APP_ENV=U1 npm run test:headed

# PracticeTest Tests for U1
cross-env APP_ENV=U1 npm run test:practicetest:smoke
cross-env APP_ENV=U1 npm run test:practicetest:positive
cross-env APP_ENV=U1 npm run test:practicetest:negative

# API Tests for U1
cross-env APP_ENV=U1 npm run test:api:smoke
cross-env APP_ENV=U1 npm run test:api:posts
cross-env APP_ENV=U1 npm run test:api:users
cross-env APP_ENV=U1 npm run examples:api
```

## 📋 Available U1 Test Commands

### 🖥️ UI Testing Commands

| Command | Description | Test Type |
|---------|-------------|-----------|
| `npm run test:u1:smoke` | Quick smoke tests for SauceDemo | UI - Fast |
| `npm run test:u1:saucedemo` | Complete SauceDemo test suite | UI - Full |
| `npm run test:u1:headed` | Visual test execution (browser visible) | UI - Debug |
| `npm run test:u1:practicetest` | Complete PracticeTest suite | UI - Full |
| `npm run test:u1:practicetest:smoke` | Quick PracticeTest smoke tests | UI - Fast |

### 🔌 API Testing Commands

| Command | Description | Test Type |
|---------|-------------|-----------|
| `npm run test:u1:api:smoke` | Quick API smoke tests | API - Fast |
| `npm run test:u1:api` | Complete API test suite | API - Full |
| `cross-env APP_ENV=U1 npm run examples:api` | Interactive API examples | API - Demo |

## 🔧 U1 Environment Configuration

### Current U1 Configuration

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

### 🔐 Updating U1 Configuration

To update U1 configuration for your actual environment:

1. **Edit the configuration file**:
   ```bash
   # Edit U1 configuration
   code config/env/uat/U1.json
   ```

2. **Update the values**:
   ```json
   {
     "app": {
       "baseUrl": "https://your-u1-app.com",
       "username": "your_u1_username", 
       "password": "your_u1_password"
     },
     "db": {
       "oracle": {
         "host": "your-u1-oracle.host",
         "user": "your_oracle_user",
         "password": "your_oracle_password"
       }
     }
   }
   ```

### 🌍 Runtime Environment Overrides

You can override U1 configuration at runtime using environment variables:

```bash
# Override U1 app URL
cross-env APP_ENV=U1 APP_BASE_URL=https://custom-u1.com npm run test:u1:smoke

# Override U1 credentials
cross-env APP_ENV=U1 APP_USERNAME=custom_user APP_PASSWORD=custom_pass npm run test:u1:smoke

# Override U1 database settings
cross-env APP_ENV=U1 ORACLE_HOST=custom-oracle.host ORACLE_USER=custom_user npm run test:u1:smoke
```

## 📊 U1 Test Reports

U1 tests generate environment-specific reports:

### Report Locations
```
test-results/
├── u1-saucedemo-report.json      # U1 SauceDemo JSON report
├── u1-saucedemo-report.html      # U1 SauceDemo HTML report  
├── u1-practicetest-report.json   # U1 PracticeTest JSON report
├── u1-practicetest-report.html   # U1 PracticeTest HTML report
├── u1-api-report.json            # U1 API JSON report
└── u1-api-report.html            # U1 API HTML report
```

### Viewing Reports
```bash
# Open HTML reports in browser
start test-results/u1-saucedemo-report.html      # Windows
open test-results/u1-saucedemo-report.html       # macOS  
xdg-open test-results/u1-saucedemo-report.html   # Linux
```

## 🎯 U1 Test Scenarios

### SauceDemo Tests (U1)
- ✅ **Login scenarios**: Valid/invalid credentials against U1 environment
- ✅ **Product browsing**: Sorting, filtering on U1 application
- ✅ **Shopping cart**: Add/remove items in U1 environment
- ✅ **Checkout process**: Complete purchase flow on U1
- ✅ **Error handling**: Network issues, invalid data on U1

### PracticeTest Tests (U1)
- ✅ **Login validation**: Username/password combinations on U1
- ✅ **Error messages**: Invalid credential handling on U1
- ✅ **UI elements**: Form validation, button states on U1
- ✅ **Navigation**: Page redirects and routing on U1

### API Tests (U1)
- ✅ **CRUD operations**: Create, Read, Update, Delete on U1 APIs
- ✅ **Data validation**: Response structure and types from U1
- ✅ **Error handling**: 404s, invalid requests on U1
- ✅ **Performance**: Response time validation for U1
- ✅ **Authentication**: Client certificate validation on U1

## 🔍 U1 Environment Verification

### Verify U1 Configuration
```bash
# Check if U1 environment loads correctly
cross-env APP_ENV=U1 npm run verify
```

### Test U1 Connectivity
```bash
# Test U1 application access
curl https://u1.example.com

# Test U1 API access (if configured)
curl https://api.u1.example.com/health
```

## 🐛 U1-Specific Troubleshooting

### Issue 1: U1 Application Not Accessible
**Error**: Cannot connect to U1 application
**Solutions**:
1. Check VPN connection (if U1 is behind VPN)
2. Verify U1 URL in configuration
3. Check firewall/proxy settings
4. Confirm U1 environment is running

### Issue 2: U1 Database Connection Issues
**Error**: Database connection failed
**Solutions**:
1. Verify database credentials in U1.json
2. Check database server availability
3. Confirm network access to U1 database
4. Test database connection manually

### Issue 3: U1 Certificate Issues
**Error**: Client certificate authentication failed
**Solutions**:
1. Verify certificate path in U1.json
2. Check certificate passphrase
3. Ensure certificate is not expired
4. Confirm certificate format (PFX)

### Issue 4: U1 Environment Variables
**Error**: Configuration not loading correctly
**Solutions**:
```bash
# Debug U1 configuration loading
cross-env APP_ENV=U1 DEBUG=config npm run test:u1:smoke

# Check environment variable precedence
cross-env APP_ENV=U1 node -e "console.log(process.env.APP_ENV)"
```

## 🚀 U1 Development Workflow

### 1. **Setup U1 Environment**
```bash
# Clone and setup
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts
npm install
npx playwright install

# Configure U1 settings
code config/env/uat/U1.json
```

### 2. **Run U1 Tests**
```bash
# Start with smoke tests
npm run test:u1:smoke

# Run specific test suites
npm run test:u1:practicetest:smoke
npm run test:u1:api:smoke

# Debug with visual mode
npm run test:u1:headed
```

### 3. **Analyze U1 Results**
```bash
# Check test reports
open test-results/u1-saucedemo-report.html

# Review logs
tail -f logs/test-execution.log
```

## 🎯 U1 vs Other Environments

| Environment | Group | Purpose | Base URL Pattern |
|-------------|-------|---------|------------------|
| **U1** | uat | User Acceptance Testing | `https://u1.example.com` |
| U2, U3, U4 | uat | Other UAT environments | `https://u2.example.com` |
| T1, T3, T5 | test | Testing environments | `https://t5.example.com` |
| D1, D2, D3 | dev | Development environments | `https://d1.example.com` |
| QD1, QD2 | onprem | On-premise environments | Internal URLs |

## 📚 Related Documentation

- **GETTING_STARTED.md** - General framework setup
- **WINDOWS_SETUP_GUIDE.md** - Windows-specific setup
- **FRAMEWORK_USER_GUIDE.md** - Complete framework usage
- **API_TESTING_GUIDE.md** - API testing specifics
- **SETUP_TROUBLESHOOTING.md** - Common issues and fixes

## 🎉 U1 Testing Success

You'll know U1 testing is working when:

### ✅ U1 Verification Passes
```bash
cross-env APP_ENV=U1 npm run verify
# Should show: "Configuration loaded successfully for U1 (uat)"
```

### ✅ U1 Tests Execute Successfully
```bash
npm run test:u1:smoke
# Should show: Passing scenarios with U1 configuration
```

### ✅ U1 Reports Generated
```bash
ls test-results/u1-*
# Should show: U1-specific report files
```

**Ready to test U1 environment!** 🚀

Start with: `npm run test:u1:smoke` → `npm run test:u1:practicetest:smoke` → `npm run test:u1:api:smoke`