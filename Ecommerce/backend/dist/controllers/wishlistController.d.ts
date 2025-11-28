import { Request, Response } from 'express';
export declare const getWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addToWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeFromWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkWishlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=wishlistController.d.ts.map