"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestEmail = exports.testEmailConfig = void 0;
const email_1 = require("../services/email");
/**
 * Test email configuration
 * GET /api/email/test
 */
const testEmailConfig = async (req, res) => {
    try {
        const result = await email_1.emailService.testConnection();
        if (result.success) {
            res.json({
                success: true,
                message: result.message,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        console.error('[testEmailConfig] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test email configuration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.testEmailConfig = testEmailConfig;
/**
 * Send test email
 * POST /api/email/test-send
 */
const sendTestEmail = async (req, res) => {
    try {
        const { to } = req.body;
        if (!to) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required',
            });
        }
        const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h1 style="color: #667eea;">Test Email</h1>
  <p>This is a test email from your CMS email service.</p>
  <p>If you received this email, your email configuration is working correctly!</p>
  <p style="color: #999; font-size: 12px; margin-top: 30px;">
    Sent at: ${new Date().toLocaleString()}
  </p>
</body>
</html>
    `.trim();
        const success = await email_1.emailService.sendEmail({
            to,
            subject: 'Test Email from CMS',
            html: testHtml,
        });
        if (success) {
            res.json({
                success: true,
                message: `Test email sent successfully to ${to}`,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email. Please check your email configuration.',
            });
        }
    }
    catch (error) {
        console.error('[sendTestEmail] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.sendTestEmail = sendTestEmail;
//# sourceMappingURL=emailController.js.map