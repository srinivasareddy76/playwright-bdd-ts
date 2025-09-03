# Windows Setup Guide

This guide addresses Windows-specific setup issues and solutions for the Playwright BDD TypeScript framework.

## 🔧 Windows-Specific Fixes Applied

The repository has been updated to work seamlessly on Windows by:

1. **Using `cross-env`** for environment variables instead of Unix syntax
2. **Using Node.js script** for copying files instead of Unix `cp` command
3. **Cross-platform compatibility** for all npm scripts

## 🚀 Quick Fix for Your Issue

The error you encountered:
```
'APP_ENV' is not recognized as an internal or external command
```

Has been fixed! Pull the latest changes:

```bash
git pull origin main
```

Then try running the test again:
```bash
npm run test:practicetest:smoke
```

## 🛠️ Windows-Specific Setup Steps

### 1. Prerequisites for Windows

#### Node.js Installation
- Download from: https://nodejs.org/
- Choose the **LTS version** (recommended)
- During installation, check "Add to PATH" option
- Restart Command Prompt/PowerShell after installation

#### Git Installation
- Download from: https://git-scm.com/
- During installation, choose "Git from the command line and also from 3rd-party software"
- Choose "Use Windows' default console window"

#### PowerShell Execution Policy (if needed)
If you get execution policy errors, run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Repository Setup on Windows

```bash
# Clone repository
git clone https://github.com/srinivasareddy76/playwright-bdd-ts.git
cd playwright-bdd-ts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify setup
npm run verify
```

### 3. Windows-Compatible Commands

All these commands now work on Windows:

#### SauceDemo Tests
```bash
npm run test:saucedemo      # All SauceDemo tests
npm run test:smoke          # Smoke tests
npm run test:positive       # Positive scenarios
npm run test:negative       # Negative scenarios
npm run test:headed         # Watch tests run (browser visible)
```

#### PracticeTest Tests
```bash
npm run test:practicetest           # All PracticeTest tests
npm run test:practicetest:smoke     # Smoke tests
npm run test:practicetest:positive  # Positive scenarios
npm run test:practicetest:negative  # Negative scenarios
npm run test:practicetest:headed    # Watch tests run
```

#### API Tests
```bash
npm run examples:api        # API examples
npm run test:api:simple     # Simple API test
npm run test:api:smoke      # BDD API tests
```

## 🐛 Common Windows Issues & Solutions

### Issue 1: "cross-env: command not found"
**Solution**: Install cross-env globally or locally
```bash
npm install cross-env --save-dev
# or globally
npm install -g cross-env
```

### Issue 2: PowerShell Execution Policy
**Error**: "execution of scripts is disabled on this system"
**Solution**: Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Path Issues with Node.js
**Error**: "node: command not found"
**Solution**: 
1. Restart Command Prompt/PowerShell
2. Verify Node.js is in PATH: `echo $env:PATH` (PowerShell) or `echo %PATH%` (CMD)
3. Reinstall Node.js with "Add to PATH" option checked

### Issue 4: Git Line Ending Issues
**Solution**: Configure Git for Windows line endings:
```bash
git config --global core.autocrlf true
```

### Issue 5: Long Path Names
**Error**: Path too long errors
**Solution**: Enable long paths in Windows:
1. Run as Administrator: `gpedit.msc`
2. Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
3. Enable "Enable Win32 long paths"

### Issue 6: Antivirus Blocking
**Issue**: Antivirus software blocking Playwright browsers
**Solution**: 
1. Add exception for `%USERPROFILE%\.cache\ms-playwright`
2. Add exception for your project directory
3. Temporarily disable real-time protection during installation

## 🔍 Windows-Specific Verification

Run the verification script to check Windows compatibility:
```bash
npm run verify
```

Expected output on Windows:
```
🔍 Verifying Local Setup for Playwright BDD TypeScript Framework
================================================================

1. 📋 Checking Prerequisites...
--------------------------------
✅ Node.js v18.17.0 (✓ Version 18+ required)
✅ npm 9.6.7
✅ Git installed: git version 2.41.0.windows.3

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
```

## 🎯 Windows Testing Commands

### Command Prompt (CMD)
```cmd
# Navigate to project
cd C:\path\to\playwright-bdd-ts

# Run tests
npm run test:smoke
npm run test:practicetest:smoke
npm run examples:api
```

### PowerShell
```powershell
# Navigate to project
Set-Location "C:\path\to\playwright-bdd-ts"

# Run tests
npm run test:smoke
npm run test:practicetest:smoke
npm run examples:api
```

### Git Bash (if installed)
```bash
# Navigate to project
cd /c/path/to/playwright-bdd-ts

# Run tests (same as Linux/macOS)
npm run test:smoke
npm run test:practicetest:smoke
npm run examples:api
```

## 🚀 Windows Performance Tips

### 1. Use SSD Storage
- Install Node.js and project on SSD for better performance
- Playwright browser downloads are faster on SSD

### 2. Windows Defender Exclusions
Add these folders to Windows Defender exclusions:
- Your project directory
- `%USERPROFILE%\.cache\ms-playwright`
- `%USERPROFILE%\AppData\Roaming\npm`

### 3. Use Windows Terminal
- Install Windows Terminal from Microsoft Store
- Better performance than Command Prompt
- Supports multiple tabs and better Unicode support

### 4. PowerShell vs Command Prompt
- PowerShell is recommended over Command Prompt
- Better support for npm scripts
- More Unix-like commands available

## 🔧 Development Environment Setup

### Visual Studio Code on Windows
1. **Install VS Code**: https://code.visualstudio.com/
2. **Install Extensions**:
   - Playwright Test for VSCode
   - Cucumber (Gherkin) Full Support
   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier - Code formatter

### Windows Terminal Configuration
```json
{
  "defaultProfile": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
  "profiles": {
    "defaults": {
      "startingDirectory": "C:\\path\\to\\playwright-bdd-ts"
    }
  }
}
```

## 🎉 Success on Windows

Once setup is complete, you should be able to run:

```bash
# Verify everything works
npm run verify

# Run UI tests
npm run test:smoke
npm run test:practicetest:smoke

# Run API tests
npm run examples:api
npm run test:api:simple

# Watch tests run (browser visible)
npm run test:headed
npm run test:practicetest:headed
```

## 📞 Windows-Specific Support

If you continue to have Windows-specific issues:

1. **Check Windows version**: Windows 10/11 recommended
2. **Update Windows**: Ensure latest updates installed
3. **Check Node.js version**: Use Node.js 18+ LTS
4. **Verify PATH**: Ensure Node.js and npm are in PATH
5. **Run as Administrator**: Try running commands as Administrator
6. **Check antivirus**: Temporarily disable to test
7. **Use Git Bash**: Alternative to Command Prompt/PowerShell

The framework is now fully compatible with Windows and should work seamlessly! 🚀