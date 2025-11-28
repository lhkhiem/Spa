import { Request, Response } from 'express';
export declare const getAllReviews: (req: Request, res: Response) => Promise<void>;
export declare const getProductReviews: (req: Request, res: Response) => Promise<void>;
export declare const createReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const reactToReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=productReviewController.d.ts.map