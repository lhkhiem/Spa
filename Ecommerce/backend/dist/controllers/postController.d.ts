import { Request, Response } from 'express';
export declare const getPosts: (req: Request, res: Response) => Promise<void>;
export declare const getPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPostBySlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const publishPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=postController.d.ts.map