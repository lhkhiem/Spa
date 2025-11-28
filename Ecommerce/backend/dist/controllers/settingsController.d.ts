import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getNamespace: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const putNamespace: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const clearCache: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const resetDefaults: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=settingsController.d.ts.map