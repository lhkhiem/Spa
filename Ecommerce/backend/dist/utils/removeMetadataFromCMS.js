"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMetadataFromCMS = removeMetadataFromCMS;
const PageMetadata_1 = __importDefault(require("../models/PageMetadata"));
const metadataHelpers_1 = require("./metadataHelpers");
/**
 * Normalize path to match how it's stored in database
 */
function normalizePath(path) {
    if (!path)
        return '';
    // Extract slug from path if it's a product/post path
    if (path.startsWith('/products/')) {
        const slug = path.replace('/products/', '');
        return `/products/${(0, metadataHelpers_1.normalizeSlug)(slug)}`;
    }
    if (path.startsWith('/posts/')) {
        const slug = path.replace('/posts/', '');
        return `/posts/${(0, metadataHelpers_1.normalizeSlug)(slug)}`;
    }
    // For other paths, return as-is
    return path;
}
/**
 * Remove metadata from page_metadata table when post/product is deleted
 * CRITICAL: Only removes the specific path, preserves all other metadata
 */
async function removeMetadataFromCMS(path) {
    try {
        // Normalize path to match how it's stored
        const normalizedPath = normalizePath(path);
        console.log(`[removeMetadataFromCMS] Removing metadata for path: ${path} (normalized: ${normalizedPath})`);
        // Find and delete the specific page metadata
        const deleted = await PageMetadata_1.default.destroy({
            where: { path: normalizedPath },
        });
        if (deleted > 0) {
            console.log(`[removeMetadataFromCMS] Successfully removed metadata for ${normalizedPath}`);
        }
        else {
            console.warn(`[removeMetadataFromCMS] No metadata found to remove for path: ${normalizedPath}`);
        }
    }
    catch (error) {
        console.error('[removeMetadataFromCMS] Error:', error);
        // Don't throw error to avoid breaking deletion
    }
}
//# sourceMappingURL=removeMetadataFromCMS.js.map