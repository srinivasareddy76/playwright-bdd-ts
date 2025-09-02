#!/usr/bin/env node

/**
 * Setup Verification Script
 * 
 * This script verifies that your local environment is properly configured
 * for running the Playwright BDD TypeScript framework.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔍 Verifying Local Setup for Playwright BDD TypeScript Framework');
console.log('================================================================');

let allChecksPass = true;

function checkPassed(message) {
  console.log(`✅ ${message}`);
}

function checkFailed(message, error = '') {
  console.log(`❌ ${message}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
  allChecksPass = false;
}

function checkWarning(message) {
  console.log(`⚠️  ${message}`);
}

// Helper function to run commands safely
function runCommand(command, description) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper function to check URL accessibility
function checkUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { timeout: 5000 }, (response) => {
      resolve({ success: response.statusCode === 200, statusCode: response.statusCode });
    });
    
    request.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function verifySetup() {
  console.log('\n1. 📋 Checking Prerequisites...');
  console.log('--------------------------------');

  // Check Node.js
  const nodeCheck = runCommand('node --version', 'Node.js version');
  if (nodeCheck.success) {
    const version = nodeCheck.output;
    const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
    if (majorVersion >= 18) {
      checkPassed(`Node.js ${version} (✓ Version 18+ required)`);
    } else {
      checkFailed(`Node.js ${version} (Version 18+ required, found ${majorVersion})`);
    }
  } else {
    checkFailed('Node.js not found or not accessible');
  }

  // Check npm
  const npmCheck = runCommand('npm --version', 'npm version');
  if (npmCheck.success) {
    checkPassed(`npm ${npmCheck.output}`);
  } else {
    checkFailed('npm not found or not accessible');
  }

  // Check Git
  const gitCheck = runCommand('git --version', 'Git version');
  if (gitCheck.success) {
    checkPassed(`Git installed: ${gitCheck.output}`);
  } else {
    checkWarning('Git not found (optional for running tests, required for development)');
  }

  console.log('\n2. 📁 Checking Project Structure...');
  console.log('------------------------------------');

  // Check key directories and files
  const requiredPaths = [
    'package.json',
    'src/applications/saucedemo',
    'src/applications/practicetest', 
    'src/applications/jsonplaceholder',
    'src/common',
    'src/api',
    'config'
  ];

  for (const pathToCheck of requiredPaths) {
    if (fs.existsSync(pathToCheck)) {
      checkPassed(`${pathToCheck} exists`);
    } else {
      checkFailed(`${pathToCheck} missing`);
    }
  }

  console.log('\n3. 📦 Checking Dependencies...');
  console.log('-------------------------------');

  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    checkPassed('node_modules directory exists');
  } else {
    checkFailed('node_modules directory missing - run "npm install"');
  }

  // Check package.json scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['build', 'test:saucedemo', 'test:practicetest', 'examples:api'];
    
    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        checkPassed(`Script "${script}" available`);
      } else {
        checkFailed(`Script "${script}" missing`);
      }
    }
  } catch (error) {
    checkFailed('Could not read package.json', error.message);
  }

  console.log('\n4. 🔨 Checking Build Process...');
  console.log('---------------------------------');

  // Check TypeScript compilation
  const buildCheck = runCommand('npm run build', 'TypeScript build');
  if (buildCheck.success) {
    checkPassed('TypeScript compilation successful');
  } else {
    checkFailed('TypeScript compilation failed', buildCheck.error);
  }

  // Check if dist directory was created
  if (fs.existsSync('dist')) {
    checkPassed('dist directory created');
  } else {
    checkFailed('dist directory not created after build');
  }

  console.log('\n5. 🌐 Checking Test Application Access...');
  console.log('------------------------------------------');

  // Check SauceDemo
  const sauceDemoCheck = await checkUrl('https://saucedemo.com');
  if (sauceDemoCheck.success || sauceDemoCheck.statusCode === 301) {
    checkPassed('SauceDemo application accessible');
  } else {
    checkFailed('SauceDemo application not accessible', sauceDemoCheck.error || `Status: ${sauceDemoCheck.statusCode}`);
  }

  // Check PracticeTest
  const practiceTestCheck = await checkUrl('https://practicetestautomation.com/practice-test-login/');
  if (practiceTestCheck.success) {
    checkPassed('PracticeTest application accessible');
  } else {
    checkFailed('PracticeTest application not accessible', practiceTestCheck.error || `Status: ${practiceTestCheck.statusCode}`);
  }

  // Check JSONPlaceholder API
  const apiCheck = await checkUrl('https://jsonplaceholder.typicode.com/posts');
  if (apiCheck.success) {
    checkPassed('JSONPlaceholder API accessible');
  } else {
    checkFailed('JSONPlaceholder API not accessible', apiCheck.error || `Status: ${apiCheck.statusCode}`);
  }

  console.log('\n6. 🎭 Checking Playwright Installation...');
  console.log('-------------------------------------------');

  // Check if Playwright is installed
  const playwrightCheck = runCommand('npx playwright --version', 'Playwright version');
  if (playwrightCheck.success) {
    checkPassed(`Playwright installed: ${playwrightCheck.output}`);
  } else {
    checkFailed('Playwright not found - run "npx playwright install"');
  }

  // Check if browsers are installed (this is a basic check)
  const playwrightDir = path.join(require('os').homedir(), '.cache', 'ms-playwright');
  if (fs.existsSync(playwrightDir)) {
    checkPassed('Playwright browsers directory exists');
  } else {
    checkWarning('Playwright browsers may not be installed - run "npx playwright install"');
  }

  console.log('\n7. 🧪 Running Quick Tests...');
  console.log('-----------------------------');

  // Test API functionality
  const apiTestCheck = runCommand('npm run test:api:simple', 'Simple API test');
  if (apiTestCheck.success) {
    checkPassed('API testing framework works');
  } else {
    checkFailed('API testing framework failed', apiTestCheck.error);
  }

  console.log('\n📊 Setup Verification Summary');
  console.log('==============================');

  if (allChecksPass) {
    console.log('🎉 All checks passed! Your environment is ready for testing.');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Run "npm run test:smoke" to test SauceDemo');
    console.log('   2. Run "npm run test:practicetest:smoke" to test PracticeTest');
    console.log('   3. Run "npm run examples:api" to see API testing examples');
    console.log('   4. Review FRAMEWORK_USER_GUIDE.md for detailed usage');
  } else {
    console.log('❌ Some checks failed. Please address the issues above.');
    console.log('\n🔧 Common Solutions:');
    console.log('   - Run "npm install" to install dependencies');
    console.log('   - Run "npx playwright install" to install browsers');
    console.log('   - Check your internet connection');
    console.log('   - Ensure Node.js 18+ is installed');
    console.log('   - Review SETUP_TROUBLESHOOTING.md for detailed help');
  }

  console.log('\n📚 Documentation:');
  console.log('   - LOCAL_SETUP_GUIDE.md - Complete setup instructions');
  console.log('   - SETUP_CHECKLIST.md - Step-by-step checklist');
  console.log('   - FRAMEWORK_USER_GUIDE.md - Framework usage guide');
  console.log('   - API_TESTING_GUIDE.md - API testing documentation');

  return allChecksPass;
}

// Run verification
verifySetup().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('❌ Verification script failed:', error);
  process.exit(1);
});