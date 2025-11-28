import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const submitContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContacts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getContactById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateContact: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContact: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContactStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=contactController.d.ts.map