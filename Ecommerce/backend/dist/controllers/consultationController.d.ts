import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const submitConsultation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConsultations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getConsultationById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateConsultation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteConsultation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConsultationStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=consultationController.d.ts.map