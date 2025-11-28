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
declare class EmailService {
    private transporter;
    private config;
    /**
     * Load email configuration from database settings
     */
    loadConfig(): Promise<EmailConfig | null>;
    /**
     * Create nodemailer transporter
     */
    private createTransporter;
    /**
     * Initialize email service (load config)
     */
    initialize(): Promise<void>;
    /**
     * Check if email is enabled and configured
     */
    isEnabled(): boolean;
    /**
     * Send email
     */
    sendEmail(options: SendEmailOptions): Promise<boolean>;
    /**
     * Convert HTML to plain text (simple version)
     */
    private htmlToText;
    /**
     * Test email configuration
     */
    testConnection(): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.d.ts.map