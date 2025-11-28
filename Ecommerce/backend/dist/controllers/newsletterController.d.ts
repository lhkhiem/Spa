import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
/**
 * Subscribe to newsletter (public endpoint)
 */
export declare const subscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Unsubscribe from newsletter (public endpoint)
 */
export declare const unsubscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get all newsletter subscriptions (admin only)
 */
export declare const getSubscribers: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete newsletter subscription (admin only)
 */
export declare const deleteSubscriber: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get newsletter statistics (admin only)
 */
export declare const getStatistics: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=newsletterController.d.ts.map