#!/usr/bin/env node

/**
 * API Examples Runner
 * 
 * This script runs the comprehensive API testing examples
 * to demonstrate RESTful API testing capabilities.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting API Testing Examples...');
console.log('=====================================');

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
  console.log('\n🧪 Running API Examples...');
  console.log('============================');

  // Run the API examples
  const examplePath = path.join(__dirname, 'dist', 'src', 'applications', 'jsonplaceholder', 'examples', 'api_examples.js');
  const runProcess = spawn('node', [examplePath], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  runProcess.on('close', (runCode) => {
    if (runCode === 0) {
      console.log('\n🎉 API Examples completed successfully!');
    } else {
      console.error('\n❌ API Examples failed');
      process.exit(1);
    }
  });

  runProcess.on('error', (error) => {
    console.error('❌ Failed to run API examples:', error);
    process.exit(1);
  });
});

buildProcess.on('error', (error) => {
  console.error('❌ Failed to build project:', error);
  process.exit(1);
});