# Cross-Env Explanation - Why We Use It

## 🎯 What is `cross-env`?

`cross-env` is a Node.js package that allows you to **set environment variables** in a way that works across different operating systems (Windows, macOS, Linux).

## 🚨 The Problem It Solves

### **Without cross-env (Broken on Windows)**
```bash
# This works on macOS/Linux but FAILS on Windows
APP_ENV=U1 npm run test:smoke

# Windows Command Prompt doesn't understand this syntax
# Windows PowerShell has different syntax
# This causes the framework to break on Windows systems
```

### **With cross-env (Works Everywhere)**
```bash
# This works on Windows, macOS, AND Linux
cross-env APP_ENV=U1 npm run test:smoke

# cross-env translates the command for each operating system
```

## 🔧 How It Works

### **On Linux/macOS:**
```bash
cross-env APP_ENV=U1 npm run test:smoke
# Becomes: APP_ENV=U1 npm run test:smoke
```

### **On Windows Command Prompt:**
```bash
cross-env APP_ENV=U1 npm run test:smoke
# Becomes: set APP_ENV=U1 && npm run test:smoke
```

### **On Windows PowerShell:**
```bash
cross-env APP_ENV=U1 npm run test:smoke
# Becomes: $env:APP_ENV="U1"; npm run test:smoke
```

## 🎯 Why We Need Environment Variables

The framework uses environment variables to:

### **1. Switch Between Environments**
```bash
cross-env APP_ENV=T5 npm run test:smoke    # Uses T5 configuration
cross-env APP_ENV=U1 npm run test:smoke    # Uses U1 configuration
cross-env APP_ENV=QD1 npm run test:smoke   # Uses QD1 configuration
```

### **2. Control Test Execution**
```bash
cross-env HEADLESS=true npm run test:smoke   # Run tests without browser UI
cross-env HEADLESS=false npm run test:smoke  # Show browser while testing
```

### **3. Override Configuration at Runtime**
```bash
# Override the base URL from configuration
cross-env APP_ENV=U1 APP_BASE_URL=https://custom-url.com npm run test:smoke

# Override credentials
cross-env APP_ENV=U1 APP_USERNAME=testuser APP_PASSWORD=testpass npm run test:smoke
```

## 📋 Real Examples in Our Framework

### **Environment Switching**
```bash
# Test SauceDemo on different environments
cross-env APP_ENV=T5 npm run test:smoke     # Default test environment
cross-env APP_ENV=U1 npm run test:smoke     # UAT environment
cross-env APP_ENV=QD1 npm run test:smoke    # On-premise environment

# Test PracticeTest on different environments
cross-env APP_ENV=T3 npm run test:practicetest:smoke   # Default
cross-env APP_ENV=U1 npm run test:practicetest:smoke   # UAT
```

### **Runtime Configuration Override**
```bash
# Use U1 environment but with custom URL
cross-env APP_ENV=U1 APP_BASE_URL=https://u1-staging.company.com npm run test:smoke

# Use QD1 environment with custom credentials
cross-env APP_ENV=QD1 APP_USERNAME=admin APP_PASSWORD=admin123 npm run test:smoke
```

### **Browser Control**
```bash
# Run tests headlessly (no browser window)
cross-env HEADLESS=true npm run test:smoke

# Show browser window while testing (for debugging)
cross-env HEADLESS=false npm run test:smoke
```

## 🔍 How the Framework Reads These Variables

### **In Configuration Loading (config/index.ts)**
```typescript
// The framework reads APP_ENV to determine which config to load
const environment = process.env.APP_ENV || 'T5';  // Default to T5

// It can also read runtime overrides
const baseUrl = process.env.APP_BASE_URL || config.app.baseUrl;
const username = process.env.APP_USERNAME || config.app.username;
```

### **In Test Execution**
```typescript
// The framework checks HEADLESS variable
const headless = process.env.HEADLESS === 'true';

// Browser is launched with this setting
await chromium.launch({ headless });
```

## 🚨 Your Original Windows Issue

### **What Was Failing Before**
```bash
# This command failed on Windows
npm run test:practicetest:smoke

# Because internally it was trying to run:
APP_ENV=T3 cucumber-js ...  # ← This syntax doesn't work on Windows
```

### **What We Fixed**
```bash
# Now all npm scripts use cross-env
"test:practicetest:smoke": "npm run build && node copy-config.js && cross-env APP_ENV=T3 HEADLESS=true cucumber-js ..."

# This works on Windows, macOS, and Linux
npm run test:practicetest:smoke
```

## 📦 Installation and Usage

### **Installation**
```bash
# cross-env is already installed in the framework
npm install cross-env --save-dev
```

### **Usage Patterns**
```bash
# Single environment variable
cross-env APP_ENV=U1 npm run test:smoke

# Multiple environment variables
cross-env APP_ENV=U1 HEADLESS=false npm run test:smoke

# Complex override
cross-env APP_ENV=U1 APP_BASE_URL=https://custom.com APP_USERNAME=testuser npm run test:smoke
```

## 🎯 Common Use Cases in Testing

### **1. Environment Testing**
```bash
# Test the same application on different environments
cross-env APP_ENV=T5 npm run test:smoke    # Test environment
cross-env APP_ENV=U1 npm run test:smoke    # UAT environment
cross-env APP_ENV=QD1 npm run test:smoke   # On-premise environment
```

### **2. Debug Mode**
```bash
# Run tests with browser visible for debugging
cross-env HEADLESS=false npm run test:smoke

# Run tests headlessly for CI/CD
cross-env HEADLESS=true npm run test:smoke
```

### **3. Configuration Override**
```bash
# Test against a different URL without changing config files
cross-env APP_ENV=U1 APP_BASE_URL=https://u1-hotfix.company.com npm run test:smoke

# Test with different credentials
cross-env APP_ENV=U1 APP_USERNAME=admin npm run test:smoke
```

### **4. CI/CD Integration**
```bash
# In CI/CD pipelines, you can set environment-specific variables
cross-env APP_ENV=PROD APP_BASE_URL=$PROD_URL APP_USERNAME=$PROD_USER npm run test:smoke
```

## 🔧 Alternative Approaches (Why We Don't Use Them)

### **1. OS-Specific Scripts**
```json
{
  "scripts": {
    "test:windows": "set APP_ENV=U1 && npm run test:smoke",
    "test:unix": "APP_ENV=U1 npm run test:smoke"
  }
}
```
❌ **Problem**: Need different scripts for different OS

### **2. Batch/Shell Scripts**
```bash
# test.bat (Windows)
set APP_ENV=U1
npm run test:smoke

# test.sh (Unix)
export APP_ENV=U1
npm run test:smoke
```
❌ **Problem**: Need to maintain multiple script files

### **3. Node.js Scripts**
```javascript
process.env.APP_ENV = 'U1';
// run tests
```
❌ **Problem**: More complex, harder to use from command line

## ✅ Why cross-env is the Best Solution

### **✅ Advantages**
- **Cross-platform**: Works on Windows, macOS, Linux
- **Simple**: One command syntax for all platforms
- **Reliable**: Widely used in the Node.js ecosystem
- **Flexible**: Can set multiple variables at once
- **No extra files**: No need for OS-specific scripts

### **✅ Industry Standard**
- Used by major projects like React, Vue, Angular
- Over 50 million weekly downloads on npm
- Maintained and well-supported

## 🎯 Summary

### **What cross-env does:**
- **Translates environment variable syntax** across operating systems
- **Enables cross-platform compatibility** for npm scripts
- **Allows runtime configuration** without changing files

### **Why we use it:**
- **Windows compatibility** (your original issue)
- **Environment switching** (T5, U1, QD1, etc.)
- **Runtime overrides** (custom URLs, credentials)
- **Browser control** (headless vs headed)

### **Key commands to remember:**
```bash
# Switch environments
cross-env APP_ENV=U1 npm run test:smoke

# Override configuration
cross-env APP_ENV=U1 APP_BASE_URL=https://custom.com npm run test:smoke

# Control browser display
cross-env HEADLESS=false npm run test:smoke
```

**cross-env is the reason your Windows compatibility issue is now fixed!** 🚀

Without cross-env: ❌ Windows commands fail
With cross-env: ✅ All platforms work perfectly