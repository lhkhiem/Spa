import { Request, Response } from 'express';
export declare const getMenuLocations: (req: Request, res: Response) => Promise<void>;
export declare const getMenuLocationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMenuLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMenuLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMenuLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=menuLocationController.d.ts.map