"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const database_1 = __importDefault(require("../config/database"));
const Post_1 = __importDefault(require("../models/Post"));
const Asset_1 = __importDefault(require("../models/Asset"));
const Tag_1 = __importDefault(require("../models/Tag"));
const postMetadataSync_1 = require("../utils/postMetadataSync");
const productMetadataSync_1 = require("../utils/productMetadataSync");
const router = (0, express_1.Router)();
/**
 * POST /api/sync-metadata
 * Sync metadata for all existing posts and products
 * Requires authentication
 */
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        console.log('[syncMetadata] Starting metadata sync...');
        // 1. Sync all posts
        const posts = await Post_1.default.findAll({
            include: [
                { model: Asset_1.default, as: 'cover_asset', attributes: ['id', 'url', 'cdn_url'] },
                { model: Tag_1.default, as: 'tags', attributes: ['id', 'name'] },
            ],
        });
        let postsSynced = 0;
        for (const post of posts) {
            try {
                await (0, postMetadataSync_1.syncPostMetadataToCMS)(post);
                postsSynced++;
            }
            catch (error) {
                console.error(`[syncMetadata] Error syncing post ${post.slug}:`, error);
            }
        }
        // 2. Sync all products
        const productsQuery = `
      SELECT 
        p.*,
        b.name as brand_name,
        (SELECT string_agg(pc.name, ', ') 
         FROM product_categories pc
         JOIN product_product_categories ppc ON pc.id = ppc.category_id
         WHERE ppc.product_id = p.id) as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
    `;
        const products = await database_1.default.query(productsQuery, {
            type: 'SELECT',
        });
        let productsSynced = 0;
        for (const product of products) {
            try {
                await (0, productMetadataSync_1.syncProductMetadataToCMS)(product);
                productsSynced++;
            }
            catch (error) {
                console.error(`[syncMetadata] Error syncing product ${product.slug}:`, error);
            }
        }
        res.json({
            success: true,
            message: 'Metadata sync completed',
            stats: {
                posts: { synced: postsSynced, total: posts.length },
                products: { synced: productsSynced, total: products.length },
            },
        });
    }
    catch (error) {
        console.error('[syncMetadata] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to sync metadata',
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=syncMetadata.js.map