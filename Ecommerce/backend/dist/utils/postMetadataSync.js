"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPostMetadataToCMS = syncPostMetadataToCMS;
const PageMetadata_1 = __importDefault(require("../models/PageMetadata"));
const Asset_1 = __importDefault(require("../models/Asset"));
const metadataHelpers_1 = require("./metadataHelpers");
/**
 * Normalize path to match how it's stored in database
 */
function normalizePath(path) {
    if (!path)
        return '';
    if (path.startsWith('/posts/')) {
        const slug = path.replace('/posts/', '');
        return `/posts/${(0, metadataHelpers_1.normalizeSlug)(slug)}`;
    }
    // For other paths, return as-is
    return path;
}
/**
 * Sync post metadata to page_metadata table
 * This function is called automatically when a post is created or updated.
 * It will only update if the metadata is auto-generated (not custom).
 */
async function syncPostMetadataToCMS(post) {
    try {
        // Normalize slug to match frontend normalization
        const normalizedSlug = (0, metadataHelpers_1.normalizeSlug)(post.slug || '');
        const path = normalizePath(`/posts/${normalizedSlug}`);
        console.log(`[syncPostMetadata] Starting sync for path: ${path}`);
        // Check if custom metadata exists (not auto-generated)
        const existing = await PageMetadata_1.default.findOne({
            where: { path },
        });
        // If custom metadata exists (not auto-generated), don't override
        if (existing && existing.auto_generated === false) {
            console.log(`[syncPostMetadata] Skipping ${path} - has custom metadata (not auto-generated)`);
            return; // Keep custom metadata, don't override
        }
        // Load cover image
        let coverUrl = '';
        if (post.cover_asset_id) {
            const coverAsset = await Asset_1.default.findByPk(post.cover_asset_id);
            if (coverAsset) {
                coverUrl = coverAsset.cdn_url || coverAsset.url || '';
            }
        }
        // Load tags
        let tagNames = [];
        try {
            const tags = await post.getTags?.() || [];
            tagNames = tags.map((t) => t.name || '').filter(Boolean);
        }
        catch (err) {
            console.warn('[syncPostMetadata] Could not load tags:', err);
        }
        // Create/update auto-generated metadata
        // Clean description: strip HTML and decode entities
        let description = post.excerpt || post.title || '';
        description = (0, metadataHelpers_1.stripHtmlAndDecode)(description);
        if (description.length > 160) {
            description = description.substring(0, 157) + '...';
        }
        const metadataData = {
            path,
            title: post.title || '',
            description: description,
            og_image: coverUrl,
            keywords: tagNames.length > 0 ? tagNames : null,
            enabled: true,
            auto_generated: true,
        };
        if (existing) {
            // Update existing (only if auto-generated)
            if (existing.auto_generated === true) {
                await existing.update(metadataData);
                console.log(`[syncPostMetadata] Updated existing post page: ${path}`);
            }
        }
        else {
            // Create new
            await PageMetadata_1.default.create(metadataData);
            console.log(`[syncPostMetadata] Created new post page: ${path}`);
        }
    }
    catch (error) {
        console.error('[syncPostMetadata] Error:', error);
        // Don't throw error to avoid breaking post creation/update
    }
}
//# sourceMappingURL=postMetadataSync.js.map