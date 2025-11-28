import PageMetadata from '../models/PageMetadata';
import { normalizeSlug } from './metadataHelpers';

/**
 * Normalize path to match how it's stored in database
 */
function normalizePath(path: string): string {
  if (!path) return '';
  
  // Extract slug from path if it's a product/post path
  if (path.startsWith('/products/')) {
    const slug = path.replace('/products/', '');
    return `/products/${normalizeSlug(slug)}`;
  }
  
  if (path.startsWith('/posts/')) {
    const slug = path.replace('/posts/', '');
    return `/posts/${normalizeSlug(slug)}`;
  }
  
  // For other paths, return as-is
  return path;
}

/**
 * Remove metadata from page_metadata table when post/product is deleted
 * CRITICAL: Only removes the specific path, preserves all other metadata
 */
export async function removeMetadataFromCMS(path: string) {
  try {
    // Normalize path to match how it's stored
    const normalizedPath = normalizePath(path);
    console.log(`[removeMetadataFromCMS] Removing metadata for path: ${path} (normalized: ${normalizedPath})`);
    
    // Find and delete the specific page metadata
    const deleted = await PageMetadata.destroy({
      where: { path: normalizedPath },
    });

    if (deleted > 0) {
      console.log(`[removeMetadataFromCMS] Successfully removed metadata for ${normalizedPath}`);
    } else {
      console.warn(`[removeMetadataFromCMS] No metadata found to remove for path: ${normalizedPath}`);
    }
  } catch (error: any) {
    console.error('[removeMetadataFromCMS] Error:', error);
    // Don't throw error to avoid breaking deletion
  }
}
