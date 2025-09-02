#!/usr/bin/env node

/**
 * API-Only Test Runner
 * 
 * This script runs API tests without browser dependencies
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Starting API-Only Tests...');
console.log('==============================');

// Build the project first
console.log('📦 Building TypeScript project...');
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

buildProcess.on('close', (buildCode) => {
  if (buildCode !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }

  console.log('✅ Build completed successfully');
  console.log('\n🧪 Running API Tests (without browser)...');
  console.log('==========================================');

  // Copy config
  const copyProcess = spawn('cp', ['-r', 'config', 'dist/'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  copyProcess.on('close', (copyCode) => {
    if (copyCode !== 0) {
      console.error('❌ Failed to copy config');
      process.exit(1);
    }

    // Run cucumber tests with API-only step definitions
    const testProcess = spawn('npx', [
      'cucumber-js',
      'src/applications/jsonplaceholder/features/*.feature',
      '--require', 'dist/src/applications/**/steps/**/*.js',
      '--format', 'progress-bar',
      '--tags', '@smoke'
    ], {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
      env: {
        ...process.env,
        HEADLESS: 'true',
        API_ONLY: 'true'
      }
    });

    testProcess.on('close', (testCode) => {
      if (testCode === 0) {
        console.log('\n🎉 API Tests completed successfully!');
      } else {
        console.error('\n❌ API Tests failed');
        process.exit(1);
      }
    });

    testProcess.on('error', (error) => {
      console.error('❌ Failed to run API tests:', error);
      process.exit(1);
    });
  });

  copyProcess.on('error', (error) => {
    console.error('❌ Failed to copy config:', error);
    process.exit(1);
  });
});

buildProcess.on('error', (error) => {
  console.error('❌ Failed to build project:', error);
  process.exit(1);
});