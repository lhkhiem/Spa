import { Request, Response } from 'express';
export declare const getEducationResources: (req: Request, res: Response) => Promise<void>;
export declare const getEducationResourceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEducationResourceBySlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEducationResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEducationResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEducationResource: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=educationResourcesController.d.ts.map