#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==========================================');
console.log('  BUILD BACKEND - PRODUCT FIX');
console.log('==========================================');
console.log('');

const backendDir = path.join(__dirname, 'CMS', 'backend');
const distDir = path.join(backendDir, 'dist');

try {
  // Change to backend directory
  process.chdir(backendDir);
  console.log('Current directory:', process.cwd());
  console.log('');

  // Build TypeScript
  console.log('Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('✗ Build failed: dist/ directory not found');
    process.exit(1);
  }

  // Check if productController.js exists
  const productControllerPath = path.join(distDir, 'controllers', 'productController.js');
  if (!fs.existsSync(productControllerPath)) {
    console.error('✗ Build failed: productController.js not found');
    process.exit(1);
  }

  console.log('');
  console.log('✓ Build completed successfully');
  console.log('');

  // Try to restart PM2
  console.log('Restarting PM2 services...');
  try {
    execSync('pm2 restart cms-backend', { stdio: 'inherit' });
    console.log('✓ PM2 service restarted');
  } catch (pm2Error) {
    console.log('⚠ Could not restart PM2 automatically');
    console.log('Please run manually: pm2 restart cms-backend');
  }

  console.log('');
  console.log('==========================================');
  console.log('  BUILD COMPLETED');
  console.log('==========================================');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Check PM2 status: pm2 status');
  console.log('  2. Check logs: pm2 logs cms-backend --lines 50');
  console.log('  3. Test duplicate product in admin panel');

} catch (error) {
  console.error('✗ Build failed:', error.message);
  process.exit(1);
}
