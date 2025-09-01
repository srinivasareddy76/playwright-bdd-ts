#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.APP_ENV = 'T5';
process.env.HEADLESS = 'true';
process.env.CI = 'true';

// Build the project first
console.log('Building TypeScript project...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Build failed with exit code ${code}`);
    process.exit(1);
  }

  console.log('Build successful. Running SauceDemo tests...');
  
  // Run only the SauceDemo tests
  const testProcess = spawn('npx', [
    'cucumber-js',
    'features/saucedemo_login.feature',
    '--require', 'dist/src/steps/**/*.js',
    '--format', 'progress-bar',
    '--format', 'json:test-results/saucedemo-report.json',
    '--format', 'html:test-results/saucedemo-report.html',
    '--tags', '@smoke or @positive',
    '--fail-fast'
  ], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (testCode) => {
    console.log(`\nSauceDemo tests completed with exit code: ${testCode}`);
    
    if (testCode === 0) {
      console.log('✅ All SauceDemo tests passed!');
    } else {
      console.log('❌ Some SauceDemo tests failed.');
    }
    
    console.log('\nTest reports generated:');
    console.log('- JSON: test-results/saucedemo-report.json');
    console.log('- HTML: test-results/saucedemo-report.html');
    
    process.exit(testCode);
  });

  testProcess.on('error', (error) => {
    console.error(`Failed to start test process: ${error}`);
    process.exit(1);
  });
});

buildProcess.on('error', (error) => {
  console.error(`Failed to start build process: ${error}`);
  process.exit(1);
});