import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAllAboutSections: (req: Request, res: Response) => Promise<void>;
export declare const getAboutSectionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAboutSectionByKey: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAboutSection: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAboutSection: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAboutSection: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=aboutSectionController.d.ts.map