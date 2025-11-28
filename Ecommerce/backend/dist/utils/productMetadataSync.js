"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProductMetadataToCMS = syncProductMetadataToCMS;
const PageMetadata_1 = __importDefault(require("../models/PageMetadata"));
const Asset_1 = __importDefault(require("../models/Asset"));
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
 * Sync product metadata to page_metadata table
 * This function is called automatically when a product is created or updated.
 * It will only update if the metadata is auto-generated (not custom).
 */
async function syncProductMetadataToCMS(product) {
    try {
        // Normalize slug to match frontend normalization
        const normalizedSlug = (0, metadataHelpers_1.normalizeSlug)(product.slug || '');
        const path = normalizePath(`/products/${normalizedSlug}`);
        console.log(`[syncProductMetadata] Starting sync for path: ${path}`);
        // Check if custom metadata exists (not auto-generated)
        const existing = await PageMetadata_1.default.findOne({
            where: { path },
        });
        // If custom metadata exists (not auto-generated), don't override
        if (existing && existing.auto_generated === false) {
            console.log(`[syncProductMetadata] Skipping ${path} - has custom metadata (not auto-generated)`);
            return; // Keep custom metadata, don't override
        }
        // Load thumbnail image
        let thumbnailUrl = '';
        if (product.thumbnail_id) {
            const thumbnailAsset = await Asset_1.default.findByPk(product.thumbnail_id);
            if (thumbnailAsset) {
                thumbnailUrl = thumbnailAsset.cdn_url || thumbnailAsset.url || '';
            }
        }
        // Get description from product
        let description = product.description || '';
        if (!description && product.content) {
            if (typeof product.content === 'object' && product.content.meta?.description) {
                description = product.content.meta.description;
            }
            else if (typeof product.content === 'string') {
                description = product.content;
            }
        }
        if (!description) {
            description = product.name || '';
        }
        // Strip HTML and decode entities, limit to 160 characters for SEO
        description = (0, metadataHelpers_1.stripHtmlAndDecode)(description);
        if (description.length > 160) {
            description = description.substring(0, 157) + '...';
        }
        // Get keywords from brand and category
        const keywords = [];
        if (product.brand_name) {
            keywords.push(product.brand_name);
        }
        if (product.category_name) {
            keywords.push(product.category_name);
        }
        // Create/update auto-generated metadata
        const metadataData = {
            path,
            title: product.name || '',
            description: description,
            og_image: thumbnailUrl,
            keywords: keywords.length > 0 ? keywords : null,
            enabled: true,
            auto_generated: true,
        };
        if (existing) {
            // Update existing (only if auto-generated)
            if (existing.auto_generated === true) {
                await existing.update(metadataData);
                console.log(`[syncProductMetadata] Updated existing product page: ${path}`);
            }
        }
        else {
            // Create new
            await PageMetadata_1.default.create(metadataData);
            console.log(`[syncProductMetadata] Created new product page: ${path}`);
        }
    }
    catch (error) {
        console.error('[syncProductMetadata] Error:', error);
        // Don't throw error to avoid breaking product creation/update
    }
}
//# sourceMappingURL=productMetadataSync.js.map