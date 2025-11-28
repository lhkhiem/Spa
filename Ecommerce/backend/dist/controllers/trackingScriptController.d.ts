import { Request, Response } from 'express';
export declare const getTrackingScripts: (req: Request, res: Response) => Promise<void>;
export declare const getActiveScripts: (req: Request, res: Response) => Promise<void>;
export declare const getTrackingScriptById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTrackingScript: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTrackingScript: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTrackingScript: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleTrackingScript: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=trackingScriptController.d.ts.map