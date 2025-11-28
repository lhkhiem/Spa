import { Request, Response } from 'express';
export declare const uploadFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchRemote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listFolders: (_req: Request, res: Response) => Promise<void>;
export declare const listAssets: (req: Request, res: Response) => Promise<void>;
export declare const getAssetById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=assetController.d.ts.map