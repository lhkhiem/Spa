import { Request, Response } from 'express';
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const publishProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const duplicateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFeaturedProducts: (req: Request, res: Response) => Promise<void>;
export declare const getBestSellers: (req: Request, res: Response) => Promise<void>;
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
export declare const importProducts: (req: MulterRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=productController.d.ts.map