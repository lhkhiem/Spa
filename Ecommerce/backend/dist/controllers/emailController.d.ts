import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
/**
 * Test email configuration
 * GET /api/email/test
 */
export declare const testEmailConfig: (req: AuthRequest, res: Response) => Promise<void>;
/**
 * Send test email
 * POST /api/email/test-send
 */
export declare const sendTestEmail: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=emailController.d.ts.map