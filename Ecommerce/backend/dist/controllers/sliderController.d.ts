import { Request, Response } from 'express';
export declare const getAllSliders: (req: Request, res: Response) => Promise<void>;
export declare const getSliderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSlider: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSlider: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSlider: (req: Request, res: Response) => Promise<void>;
export declare const reorderSliders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=sliderController.d.ts.map