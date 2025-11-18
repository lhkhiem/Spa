import nodemailer, { Transporter } from 'nodemailer';
import sequelize from '../config/database';

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  encryption: 'tls' | 'ssl' | 'none';
  fromEmail: string;
  fromName: string;
  username: string;
  password: string;
  enabled: boolean;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private config: EmailConfig | null = null;

  /**
   * Load email configuration from database settings
   */
  async loadConfig(): Promise<EmailConfig | null> {
    try {
      const result: any = await sequelize.query(
        "SELECT value FROM settings WHERE namespace = 'email'",
        { type: 'SELECT' as any }
      );

      if (!result || result.length === 0) {
        return null;
      }

      const config = result[0].value as EmailConfig;
      this.config = config;

      // Only create transporter if email is enabled and configured
      if (config.enabled && config.smtpHost && config.fromEmail) {
        this.createTransporter(config);
      }

      return config;
    } catch (error) {
      console.error('[EmailService] Failed to load config:', error);
      return null;
    }
  }

  /**
   * Create nodemailer transporter
   */
  private createTransporter(config: EmailConfig) {
    const auth = config.username && config.password
      ? {
          user: config.username,
          pass: config.password,
        }
      : undefined;

    const secure = config.encryption === 'ssl';
    const requireTLS = config.encryption === 'tls';

    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure,
      requireTLS,
      auth,
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    } as any);
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
  isEnabled(): boolean {
    return this.config?.enabled === true && this.transporter !== null;
  }

  /**
   * Send email
   */
  async sendEmail(options: SendEmailOptions): Promise<boolean> {
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
        from: `"${this.config!.fromName}" <${this.config!.fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
        replyTo: options.replyTo || this.config!.fromEmail,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EmailService] Email sent successfully:', info.messageId);
      return true;
    } catch (error: any) {
      console.error('[EmailService] Failed to send email:', error);
      return false;
    }
  }

  /**
   * Convert HTML to plain text (simple version)
   */
  private htmlToText(html: string): string {
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
  async testConnection(): Promise<{ success: boolean; message: string }> {
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
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to verify email configuration',
      };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Initialize on module load
emailService.initialize().catch((error) => {
  console.error('[EmailService] Failed to initialize:', error);
});






