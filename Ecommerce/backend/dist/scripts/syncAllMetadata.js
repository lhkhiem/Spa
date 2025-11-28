"use strict";
/**
 * Script to sync metadata for all existing posts and products
 * Run this once to generate metadata for all existing content
 *
 * Usage: npx ts-node src/scripts/syncAllMetadata.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
// Import models/index to ensure associations are initialized
require("../models/index");
const Post_1 = __importDefault(require("../models/Post"));
const Asset_1 = __importDefault(require("../models/Asset"));
const Tag_1 = __importDefault(require("../models/Tag"));
const postMetadataSync_1 = require("../utils/postMetadataSync");
const productMetadataSync_1 = require("../utils/productMetadataSync");
async function syncAllMetadata() {
    try {
        console.log('🚀 Starting metadata sync for all posts and products...\n');
        // 1. Sync all posts
        console.log('📝 Syncing posts metadata...');
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
                if (postsSynced % 10 === 0) {
                    console.log(`  ✓ Synced ${postsSynced}/${posts.length} posts...`);
                }
            }
            catch (error) {
                console.error(`  ✗ Error syncing post ${post.slug}:`, error);
            }
        }
        console.log(`✅ Synced ${postsSynced}/${posts.length} posts\n`);
        // 2. Sync all products
        console.log('🛍️  Syncing products metadata...');
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
                if (productsSynced % 10 === 0) {
                    console.log(`  ✓ Synced ${productsSynced}/${products.length} products...`);
                }
            }
            catch (error) {
                console.error(`  ✗ Error syncing product ${product.slug}:`, error);
            }
        }
        console.log(`✅ Synced ${productsSynced}/${products.length} products\n`);
        console.log('🎉 Metadata sync completed!');
        console.log(`   - Posts: ${postsSynced}/${posts.length}`);
        console.log(`   - Products: ${productsSynced}/${products.length}`);
        console.log('\n💡 You can now manage metadata in CMS Settings → General → SEO & Meta → Quản lý SEO cho các trang');
    }
    catch (error) {
        console.error('❌ Error syncing metadata:', error);
        process.exit(1);
    }
}
// Run the script
syncAllMetadata()
    .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
});
//# sourceMappingURL=syncAllMetadata.js.map