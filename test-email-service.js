#!/usr/bin/env node

/**
 * Script to monitor email logs and check email service status
 * This script helps debug email sending issues by watching PM2 logs
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

console.log('=== Email Service Monitor ===\n');
console.log('This script will help you monitor email logs.\n');

async function checkEmailLogs() {
  try {
    console.log('📋 Checking recent email-related logs...\n');
    
    // Get recent logs
    const { stdout } = await execPromise('pm2 logs cms-backend --lines 200 --nostream | grep -i email');
    
    if (stdout.trim()) {
      console.log('Recent email logs:');
      console.log('─────────────────────────────────────────────────');
      console.log(stdout);
      console.log('─────────────────────────────────────────────────\n');
    } else {
      console.log('⚠️  No email-related logs found in last 200 lines.\n');
    }
  } catch (error) {
    console.log('⚠️  Could not fetch logs. Make sure PM2 is running.\n');
  }
}

async function checkEmailConfig() {
  try {
    console.log('📧 Checking email configuration in database...\n');
    
    // This would require database access, so we'll just provide instructions
    console.log('To check email configuration:');
    console.log('1. Go to CMS Admin: https://admin.banyco.vn');
    console.log('2. Navigate to Settings > Email Configuration');
    console.log('3. Verify all settings are correct:\n');
    console.log('   - Enable Email: ON');
    console.log('   - SMTP Host: mail49.vietnix.vn');
    console.log('   - SMTP Port: 465');
    console.log('   - Encryption: SSL');
    console.log('   - SMTP Username: info@banyco.vn');
    console.log('   - SMTP Password: [your password]');
    console.log('   - From Email: info@banyco.vn');
    console.log('   - From Name: Banyco Company\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function showInstructions() {
  console.log('=== How to Test Email ===\n');
  console.log('1. Create a test order:');
  console.log('   - Go to https://banyco.vn');
  console.log('   - Add product to cart and checkout');
  console.log('   - Use email: hoangkhiem.tech@gmail.com\n');
  
  console.log('2. Watch logs in real-time:');
  console.log('   pm2 logs cms-backend --lines 0 | grep -i email\n');
  
  console.log('3. Check for these log messages:');
  console.log('   ✅ [createOrder] Attempting to send order confirmation email...');
  console.log('   ✅ [EmailService] ========== SENDING EMAIL ==========');
  console.log('   ✅ [EmailService] ✅ Email sent successfully!');
  console.log('   ❌ [EmailService] ❌ Failed to send email (if error)\n');
  
  console.log('4. Common issues to check:');
  console.log('   - Email not enabled in settings');
  console.log('   - Wrong SMTP credentials');
  console.log('   - Port/encryption mismatch (465 = SSL, 587 = TLS)');
  console.log('   - Firewall blocking SMTP port');
  console.log('   - Email going to spam folder\n');
}

// Main function
async function main() {
  await checkEmailLogs();
  await checkEmailConfig();
  await showInstructions();
  
  console.log('=== Next Steps ===');
  console.log('1. Create a test order and watch the logs');
  console.log('2. Check PM2 logs: pm2 logs cms-backend --lines 0');
  console.log('3. Look for [EmailService] and [createOrder] log entries');
  console.log('4. If email fails, check error details in logs\n');
}

main().catch(console.error);




