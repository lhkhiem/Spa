import { Request, Response } from 'express';
/**
 * Get page metadata from page_metadata table
 * Supports both static pages (/products, /about) and dynamic pages (/posts/slug, /products/slug)
 */
export declare const getPageMetadata: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=pageMetadataController.d.ts.map