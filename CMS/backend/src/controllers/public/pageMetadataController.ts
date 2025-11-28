import { Request, Response } from 'express';
import PageMetadata from '../../models/PageMetadata';
import { normalizeSlug } from '../../utils/metadataHelpers';

/**
 * Normalize path for comparison
 */
function normalizePathForComparison(pathToNormalize: string): string {
  if (!pathToNormalize) return '/';
  
  // Remove trailing slash (except for root)
  let normalized = pathToNormalize.replace(/\/+$/, '') || '/';
  
  // Extract slug from path (e.g., /posts/slug-name -> slug-name)
  const pathParts = normalized.split('/');
  if (pathParts.length >= 3) {
    // Has prefix and slug (e.g., /posts/slug-name)
    const prefix = pathParts.slice(0, -1).join('/'); // /posts
    const slug = pathParts[pathParts.length - 1]; // slug-name
    
    // Normalize slug
    const normalizedSlug = normalizeSlug(slug);
    normalized = `${prefix}/${normalizedSlug}`;
  } else if (pathParts.length === 2 && pathParts[1]) {
    // Has slug only (e.g., /slug-name)
    const slug = pathParts[1];
    const normalizedSlug = normalizeSlug(slug);
    normalized = `/${normalizedSlug}`;
  }
  
  return normalized || '/';
}

/**
 * Get page metadata from page_metadata table
 * Supports both static pages (/products, /about) and dynamic pages (/posts/slug, /products/slug)
 */
export const getPageMetadata = async (req: Request, res: Response) => {
  try {
    let { path } = req.params;
    
    // 1. Normalize path - ensure it starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Remove query params
    if (path.includes('?')) {
      path = path.split('?')[0];
    }
    
    // Remove trailing slash (except for root)
    path = path.replace(/\/+$/, '') || '/';
    
    console.log('[getPageMetadata] Requested path:', req.params.path, '→ Normalized:', path);
    
    // 2. Normalize path for comparison
    const normalizedRequestPath = normalizePathForComparison(path);
    console.log('[getPageMetadata] Normalized request path:', path, '→', normalizedRequestPath);
    
    // 3. Try to find exact match
    const page = await PageMetadata.findOne({
      where: { 
        path: normalizedRequestPath,
        enabled: true,
      },
    });

    // 4. If not found and it's home page, check if there's a page entry for '/'
    if (!page && (path === '/' || path === '')) {
      const homePage = await PageMetadata.findOne({
        where: { 
          path: '/',
          enabled: true,
        },
      });
      
      if (homePage) {
        return res.json({
          title: homePage.title || 'Banyco',
          description: homePage.description || '',
          ogImage: homePage.og_image || '',
          keywords: homePage.keywords || [],
        });
      }
      
      // No metadata found, return default
      return res.json({
        title: 'Banyco',
        description: '',
        ogImage: '',
        keywords: [],
      });
    }

    // 5. If found, return metadata
    if (page) {
      console.log('[getPageMetadata] Found metadata for:', normalizedRequestPath);
      return res.json({
        title: page.title || '',
        description: page.description || '',
        ogImage: page.og_image || '',
        keywords: page.keywords || [],
      });
    }

    // 6. Not found
    console.log('[getPageMetadata] No metadata found for:', normalizedRequestPath);
    res.status(404).json({ error: 'Page metadata not found' });
  } catch (err) {
    console.error('[getPageMetadata] Error:', err);
    res.status(500).json({ error: 'Failed to load page metadata' });
  }
};
