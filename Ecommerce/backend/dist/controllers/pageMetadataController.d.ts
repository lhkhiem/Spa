import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
/**
 * Get all page metadata (for CMS admin)
 */
export declare const getAllPageMetadata: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get single page metadata
 */
export declare const getPageMetadata: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Create or update page metadata
 */
export declare const savePageMetadata: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete page metadata
 */
export declare const deletePageMetadata: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=pageMetadataController.d.ts.map