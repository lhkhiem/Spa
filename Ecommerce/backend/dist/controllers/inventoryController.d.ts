import { Request, Response } from 'express';
export declare const getInventoryStats: (req: Request, res: Response) => Promise<void>;
export declare const getInventoryProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductMovements: (req: Request, res: Response) => Promise<void>;
export declare const adjustStock: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bulkAdjustStock: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLowStockAlerts: (req: Request, res: Response) => Promise<void>;
export declare const updateStockSettings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStockSettings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=inventoryController.d.ts.map