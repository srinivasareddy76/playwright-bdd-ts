# How to Run Setup Verification

## Quick Start

After cloning the repository and navigating to the project directory, run:

```bash
node verify-setup.js
```

## Step-by-Step Instructions

### 1. Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or press `Win + X`, select "Command Prompt" or "PowerShell"
- Or open "Terminal" from Windows 11 start menu

**macOS:**
- Press `Cmd + Space`, type "Terminal", press Enter
- Or go to Applications → Utilities → Terminal

**Linux:**
- Press `Ctrl + Alt + T`
- Or search for "Terminal" in your applications

### 2. Navigate to Project Directory

```bash
# Change to your project directory
cd path/to/playwright-bdd-ts

# For example:
cd C:\Users\YourName\playwright-bdd-ts        # Windows
cd /Users/YourName/playwright-bdd-ts          # macOS
cd /home/YourName/playwright-bdd-ts           # Linux
```

### 3. Run the Verification Script

```bash
node verify-setup.js
```

## Alternative Ways to Run

### Method 1: Direct Node.js Execution
```bash
node verify-setup.js
```

### Method 2: Using npm (if added to package.json)
```bash
npm run verify-setup
```

### Method 3: Make it Executable (macOS/Linux)
```bash
# Make the file executable
chmod +x verify-setup.js

# Run it directly
./verify-setup.js
```

### Method 4: Using npx
```bash
npx node verify-setup.js
```

## Expected Output

The script will check various aspects of your setup and show results like:

```
🔍 Verifying Local Setup for Playwright BDD TypeScript Framework
================================================================

1. 📋 Checking Prerequisites...
--------------------------------
✅ Node.js v18.17.0 (✓ Version 18+ required)
✅ npm 9.6.7
✅ Git installed: git version 2.41.0

2. 📁 Checking Project Structure...
------------------------------------
✅ package.json exists
✅ src/applications/saucedemo exists
✅ src/applications/practicetest exists
✅ src/applications/jsonplaceholder exists
✅ src/common exists
✅ src/api exists
✅ config exists

3. 📦 Checking Dependencies...
-------------------------------
✅ node_modules directory exists
✅ Script "build" available
✅ Script "test:saucedemo" available
✅ Script "test:practicetest" available
✅ Script "examples:api" available

4. 🔨 Checking Build Process...
---------------------------------
✅ TypeScript compilation successful
✅ dist directory created

5. 🌐 Checking Test Application Access...
------------------------------------------
✅ SauceDemo application accessible
✅ PracticeTest application accessible
✅ JSONPlaceholder API accessible

6. 🎭 Checking Playwright Installation...
-------------------------------------------
✅ Playwright installed: Version 1.40.0
✅ Playwright browsers directory exists

7. 🧪 Running Quick Tests...
-----------------------------
✅ API testing framework works

📊 Setup Verification Summary
==============================
🎉 All checks passed! Your environment is ready for testing.

🚀 Next Steps:
   1. Run "npm run test:smoke" to test SauceDemo
   2. Run "npm run test:practicetest:smoke" to test PracticeTest
   3. Run "npm run examples:api" to see API testing examples
   4. Review FRAMEWORK_USER_GUIDE.md for detailed usage
```

## Troubleshooting

### If you get "node: command not found"
1. **Install Node.js** from https://nodejs.org/
2. **Restart your terminal** after installation
3. **Verify installation**: `node --version`

### If you get "cannot find file"
1. **Check you're in the right directory**: `ls` (macOS/Linux) or `dir` (Windows)
2. **Look for verify-setup.js**: It should be in the root directory
3. **Navigate to correct path**: Use `cd` to change directories

### If you get permission errors (macOS/Linux)
```bash
# Make the file executable
chmod +x verify-setup.js

# Or run with explicit node command
node verify-setup.js
```

### If you get "npm install" errors
1. **Delete node_modules and package-lock.json**:
   ```bash
   rm -rf node_modules package-lock.json  # macOS/Linux
   rmdir /s node_modules & del package-lock.json  # Windows
   ```
2. **Reinstall dependencies**:
   ```bash
   npm install
   ```

### If network checks fail
1. **Check internet connection**
2. **Try accessing URLs manually**:
   - https://saucedemo.com
   - https://practicetestautomation.com/practice-test-login/
   - https://jsonplaceholder.typicode.com/posts
3. **Check corporate firewall/proxy settings**

## What the Script Checks

The verification script validates:

1. **Prerequisites**: Node.js 18+, npm, Git
2. **Project Structure**: Required directories and files
3. **Dependencies**: node_modules and package.json scripts
4. **Build Process**: TypeScript compilation
5. **Network Access**: Test applications and APIs
6. **Playwright**: Installation and browser availability
7. **Functionality**: Quick API test execution

## After Successful Verification

Once all checks pass, you can:

### Run UI Tests
```bash
# SauceDemo tests
npm run test:smoke
npm run test:saucedemo

# PracticeTest tests  
npm run test:practicetest:smoke
npm run test:practicetest
```

### Run API Tests
```bash
# Simple API test
npm run test:api:simple

# Comprehensive API examples
npm run examples:api

# BDD API tests
npm run test:api:smoke
```

### Development Commands
```bash
# Build project
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Adding to package.json (Optional)

To make the verification script available as an npm command, add this to your `package.json` scripts section:

```json
{
  "scripts": {
    "verify-setup": "node verify-setup.js",
    "verify": "node verify-setup.js"
  }
}
```

Then you can run:
```bash
npm run verify-setup
# or
npm run verify
```

## Summary

The simplest way to run the verification:

1. **Open terminal**
2. **Navigate to project directory**: `cd playwright-bdd-ts`
3. **Run verification**: `node verify-setup.js`
4. **Follow the output** to fix any issues
5. **Start testing** once all checks pass!

The script is designed to be comprehensive yet easy to understand, helping you quickly identify and resolve any setup issues.