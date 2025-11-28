import { Request, Response } from 'express';
export declare const getMenuItems: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMenuItemById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMenuItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMenuItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMenuItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMenuItemsOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=menuItemController.d.ts.map