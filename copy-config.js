#!/usr/bin/env node

/**
 * Cross-platform config copy script
 * 
 * This script copies the config directory to dist/ in a cross-platform way
 */

const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Copy config directory
  copyRecursiveSync('config', 'dist/config');
  console.log('✅ Config directory copied successfully');
} catch (error) {
  console.error('❌ Failed to copy config directory:', error.message);
  process.exit(1);
}