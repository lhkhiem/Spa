#!/usr/bin/env node

/**
 * Direct test of email service
 * This script tests the email service by importing it directly
 */

// Set environment
process.env.NODE_ENV = 'production';

async function testEmail() {
  try {
    console.log('=== Testing Email Service Directly ===\n');
    
    // Import email service
    const { emailService } = await import('./CMS/backend/dist/services/email.js');
    
    console.log('1. Checking if email is enabled...');
    const isEnabled = emailService.isEnabled();
    console.log('   Enabled:', isEnabled);
    console.log('');
    
    if (!isEnabled) {
      console.log('⚠️  Email service is not enabled.');
      console.log('   Please check email configuration in CMS admin panel.');
      return;
    }
    
    console.log('2. Testing email connection...');
    const testResult = await emailService.testConnection();
    console.log('   Result:', testResult);
    console.log('');
    
    if (!testResult.success) {
      console.log('❌ Email connection test failed:', testResult.message);
      return;
    }
    
    console.log('3. Sending test email...');
    const testEmail = process.argv[2] || 'hoangkhiem.tech@gmail.com';
    console.log('   To:', testEmail);
    
    const emailSent = await emailService.sendEmail({
      to: testEmail,
      subject: `Test Email - ${new Date().toISOString()}`,
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from CMS email service.</p>
        <p>If you received this, email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });
    
    if (emailSent) {
      console.log('✅ Test email sent successfully!');
      console.log('   Please check your inbox and spam folder.');
    } else {
      console.log('❌ Failed to send test email.');
      console.log('   Check PM2 logs for error details:');
      console.log('   pm2 logs cms-backend --lines 50 | grep -i email');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
  }
}

testEmail().then(() => {
  console.log('\n=== Test Complete ===');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});



