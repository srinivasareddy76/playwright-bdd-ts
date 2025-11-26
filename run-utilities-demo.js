#!/usr/bin/env node

/**
 * Utilities Demo Test Runner with Allure Reporting
 * 
 * This script runs the utilities demonstration features and generates
 * comprehensive Allure reports to showcase the functionality.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Utilities Demo with Allure Reporting...\n');

// Ensure directories exist
const dirs = ['test-results', 'allure-results', 'allure-report'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

try {
  // Clean previous results
  console.log('🧹 Cleaning previous test results...');
  execSync('rm -rf allure-results/* test-results/*', { stdio: 'inherit' });

  // Copy configuration files to dist directory
  console.log('⚙️  Copying configuration files...');
  const configSrc = 'config';
  const configDest = 'dist/config';
  
  if (fs.existsSync(configSrc)) {
    // Create dist/config directory if it doesn't exist
    if (!fs.existsSync(configDest)) {
      fs.mkdirSync(configDest, { recursive: true });
    }
    
    // Copy config files recursively
    function copyRecursive(src, dest) {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
          copyRecursive(path.join(src, file), path.join(dest, file));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    
    copyRecursive(configSrc, configDest);
    console.log('✅ Configuration files copied successfully');
  }

  // Run utilities demo with Allure reporting
  console.log('🎯 Running utilities demonstration tests...\n');
  
  const command = [
    'cross-env APP_ENV=T5 HEADLESS=true',
    'cucumber-js',
    'src/applications/examples/features/utilities-demo.feature',
    '--require "dist/src/common/steps/**/*.js"',
    '--require "dist/src/applications/examples/step-definitions/**/*.js"',
    '--format progress-bar',
    '--format json:test-results/utilities-demo.json',
    '--format html:test-results/utilities-demo.html',
    '--format allure-cucumberjs/reporter',
    '--tags "@utilities-demo"'
  ].join(' ');

  console.log('📋 Executing command:', command);
  console.log('─'.repeat(80));
  
  execSync(command, { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      APP_ENV: 'T5', 
      HEADLESS: 'true' 
    }
  });

  console.log('\n✅ Test execution completed successfully!');

} catch (error) {
  console.log('\n⚠️  Test execution completed with some issues:');
  console.log('Error code:', error.status);
  
  // Continue with report generation even if tests had issues
}

try {
  // Generate Allure report
  console.log('\n📊 Generating Allure report...');
  execSync('npm run allure:generate', { stdio: 'inherit' });
  
  console.log('✅ Allure report generated successfully!');
  console.log('\n📋 Test Results Summary:');
  console.log('─'.repeat(50));
  
  // Check if results exist and show summary
  if (fs.existsSync('test-results/utilities-demo.json')) {
    const results = JSON.parse(fs.readFileSync('test-results/utilities-demo.json', 'utf8'));
    console.log(`📊 Total Features: ${results.length || 0}`);
    
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    
    results.forEach(feature => {
      if (feature.elements) {
        feature.elements.forEach(scenario => {
          totalScenarios++;
          const failed = scenario.steps?.some(step => step.result?.status === 'failed');
          if (failed) {
            failedScenarios++;
          } else {
            passedScenarios++;
          }
        });
      }
    });
    
    console.log(`🎯 Total Scenarios: ${totalScenarios}`);
    console.log(`✅ Passed: ${passedScenarios}`);
    console.log(`❌ Failed: ${failedScenarios}`);
  }
  
  console.log('\n📁 Generated Reports:');
  console.log('─'.repeat(30));
  console.log('📄 JSON Report: test-results/utilities-demo.json');
  console.log('🌐 HTML Report: test-results/utilities-demo.html');
  console.log('📊 Allure Report: allure-report/index.html');
  
  console.log('\n🎉 Utilities Demo completed successfully!');
  console.log('\n💡 To view the Allure report, run:');
  console.log('   npm run allure:open');
  console.log('\n💡 To serve the Allure report, run:');
  console.log('   npm run allure:serve');

} catch (error) {
  console.error('\n❌ Failed to generate Allure report:', error.message);
  console.log('\n📄 Check test-results/ directory for available reports');
}

