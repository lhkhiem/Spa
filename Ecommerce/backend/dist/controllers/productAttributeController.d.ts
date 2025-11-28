import { Request, Response } from 'express';
export declare const getProductAttributes: (req: Request, res: Response) => Promise<void>;
export declare const getProductAttributeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProductAttribute: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProductAttribute: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProductAttribute: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=productAttributeController.d.ts.map