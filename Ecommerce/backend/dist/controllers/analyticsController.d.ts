import { Request, Response } from 'express';
export declare const trackPageview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAnalyticsStats: (req: Request, res: Response) => Promise<void>;
export declare const getRealtimeStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=analyticsController.d.ts.map