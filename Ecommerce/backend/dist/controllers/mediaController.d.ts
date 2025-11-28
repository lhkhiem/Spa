import { Request, Response } from 'express';
export declare const listFolders: (_req: Request, res: Response) => Promise<void>;
export declare const createFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const renameFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadMediaFromUrl: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listMedia: (req: Request, res: Response) => Promise<void>;
export declare const updateMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const renameMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=mediaController.d.ts.map