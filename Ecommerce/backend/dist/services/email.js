"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = __importDefault(require("../config/database"));
class EmailService {
    constructor() {
        this.transporter = null;
        this.config = null;
    }
    /**
     * Load email configuration from database settings
     */
    async loadConfig() {
        try {
            const result = await database_1.default.query("SELECT value FROM settings WHERE namespace = 'email'", { type: 'SELECT' });
            if (!result || result.length === 0) {
                return null;
            }
            const config = result[0].value;
            this.config = config;
            // Only create transporter if email is enabled and configured
            if (config.enabled && config.smtpHost && config.fromEmail) {
                this.createTransporter(config);
            }
            return config;
        }
        catch (error) {
            console.error('[EmailService] Failed to load config:', error);
            return null;
        }
    }
    /**
     * Create nodemailer transporter
     */
    createTransporter(config) {
        const auth = config.username && config.password
            ? {
                user: config.username,
                pass: config.password,
            }
            : undefined;
        const secure = config.encryption === 'ssl';
        const requireTLS = config.encryption === 'tls';
        this.transporter = nodemailer_1.default.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure,
            requireTLS,
            auth,
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
        });
    }
    /**
     * Initialize email service (load config)
     */
    async initialize() {
        await this.loadConfig();
    }
    /**
     * Check if email is enabled and configured
     */
    isEnabled() {
        return this.config?.enabled === true && this.transporter !== null;
    }
    /**
     * Send email
     */
    async sendEmail(options) {
        try {
            // Reload config before sending (in case it changed)
            await this.loadConfig();
            if (!this.isEnabled()) {
                console.warn('[EmailService] Email is not enabled or not configured');
                return false;
            }
            if (!this.transporter) {
                console.error('[EmailService] Transporter not initialized');
                return false;
            }
            const mailOptions = {
                from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.htmlToText(options.html),
                replyTo: options.replyTo || this.config.fromEmail,
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log('[EmailService] Email sent successfully:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('[EmailService] Failed to send email:', error);
            return false;
        }
    }
    /**
     * Convert HTML to plain text (simple version)
     */
    htmlToText(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
    }
    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            await this.loadConfig();
            if (!this.isEnabled()) {
                return {
                    success: false,
                    message: 'Email is not enabled or not properly configured',
                };
            }
            if (!this.transporter) {
                return {
                    success: false,
                    message: 'Email transporter not initialized',
                };
            }
            await this.transporter.verify();
            return {
                success: true,
                message: 'Email configuration is valid and connection successful',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to verify email configuration',
            };
        }
    }
}
// Export singleton instance
exports.emailService = new EmailService();
// Initialize on module load
exports.emailService.initialize().catch((error) => {
    console.error('[EmailService] Failed to initialize:', error);
});
//# sourceMappingURL=email.js.map