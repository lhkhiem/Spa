"use strict";
// Product controller
// Handles CRUD operations for products
// Uses raw SQL queries via Sequelize for complex joins
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importProducts = exports.getBestSellers = exports.getFeaturedProducts = exports.duplicateProduct = exports.publishProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const XLSX = __importStar(require("xlsx"));
const database_1 = __importDefault(require("../config/database"));
const slug_1 = require("../utils/slug");
const activityLogController_1 = require("./activityLogController");
const productMetadataSync_1 = require("../utils/productMetadataSync");
// Get all products with filters and pagination
const getProducts = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, status, category_id, brand_id, q } = req.query;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const whereConditions = [];
        const replacements = { limit, offset };
        let joinClause = '';
        if (status) {
            whereConditions.push(`p.status = :status`);
            replacements.status = status;
        }
        // Filter by category using junction table (n-n relationship)
        if (category_id) {
            joinClause = `INNER JOIN product_product_categories ppc ON p.id = ppc.product_id`;
            whereConditions.push(`ppc.category_id = :category_id`);
            replacements.category_id = category_id;
        }
        if (brand_id) {
            whereConditions.push(`p.brand_id = :brand_id`);
            replacements.brand_id = brand_id;
        }
        if (q) {
            whereConditions.push(`(p.name ILIKE :search OR p.description ILIKE :search OR p.sku ILIKE :search)`);
            replacements.search = `%${q}%`;
        }
        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';
        // Get total count
        const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      ${joinClause}
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = parseInt(countResult[0].total);
        // Get products with related data
        const query = `
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url,
        a.sizes as thumbnail_sizes
      FROM products p
      ${joinClause}
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        // Load categories for each product (n-n relationship)
        for (const product of result) {
            const categoriesQuery = `
        SELECT c.id, c.name, c.slug
        FROM product_categories c
        JOIN product_product_categories ppc ON c.id = ppc.category_id
        WHERE ppc.product_id = :product_id
        ORDER BY c.name ASC
      `;
            const categoriesResult = await database_1.default.query(categoriesQuery, {
                replacements: { product_id: product.id },
                type: sequelize_1.QueryTypes.SELECT
            });
            product.categories = categoriesResult;
        }
        res.json({
            data: result,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(total / pageSize)
        });
    }
    catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
// Get product by ID with all related data
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.id = :id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const product = result[0];
        // Get product categories (n-n relationship)
        const categoriesQuery = `
      SELECT c.id, c.name, c.slug
      FROM product_categories c
      JOIN product_product_categories ppc ON c.id = ppc.category_id
      WHERE ppc.product_id = :id
      ORDER BY c.name ASC
    `;
        const categoriesResult = await database_1.default.query(categoriesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        product.categories = categoriesResult;
        // Get product images
        const imagesQuery = `
      SELECT pi.*, a.url, a.width, a.height, a.format
      FROM product_images pi
      JOIN assets a ON pi.asset_id = a.id
      WHERE pi.product_id = :id
      ORDER BY pi.sort_order ASC
    `;
        const imagesResult = await database_1.default.query(imagesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        product.images = imagesResult;
        // Get product attributes
        const attributesQuery = `
      SELECT * FROM product_attributes
      WHERE product_id = :id
      ORDER BY name ASC
    `;
        const attributesResult = await database_1.default.query(attributesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        product.attributes = attributesResult;
        res.json(product);
    }
    catch (error) {
        console.error('Failed to fetch product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
exports.getProductById = getProductById;
// Create new product
const createProduct = async (req, res) => {
    try {
        console.log('[createProduct] Request body:', JSON.stringify(req.body, null, 2));
        const { name, slug, description, content, categories, // Array of category IDs for n-n relationship (required, no direct category_id)
        brand_id, sku, price, compare_price, cost_price, stock, status, is_featured, is_best_seller, thumbnail_id, seo, images, attributes } = req.body;
        // Validate required fields
        if (!name || price === undefined) {
            console.error('[createProduct] Validation failed: missing name or price');
            return res.status(400).json({ error: 'Name and price are required' });
        }
        const id = (0, uuid_1.v4)();
        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const query = `
      INSERT INTO products (
        id, name, slug, description, content, brand_id,
        sku, price, compare_price, cost_price, stock, status,
        is_featured, is_best_seller, thumbnail_id, seo
      )
      VALUES (
        :id, :name, :slug, :description, :content, :brand_id,
        :sku, :price, :compare_price, :cost_price, :stock, :status,
        :is_featured, :is_best_seller, :thumbnail_id, :seo
      )
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                name,
                slug: generatedSlug,
                description: description || null,
                content: content ? JSON.stringify(content) : null,
                brand_id: brand_id || null,
                sku: sku || null,
                price: Math.round(price), // Round to integer for VNĐ (no decimals)
                compare_price: compare_price ? Math.round(compare_price) : null,
                cost_price: cost_price ? Math.round(cost_price) : null,
                stock: stock || 0,
                status: status || 'draft',
                is_featured: is_featured ?? false,
                is_best_seller: is_best_seller ?? false,
                thumbnail_id: thumbnail_id || null,
                seo: seo ? JSON.stringify(seo) : null
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        const product = result[0][0];
        // Add product categories (n-n relationship)
        if (categories && categories.length > 0) {
            for (const categoryId of categories) {
                const catQuery = `
          INSERT INTO product_product_categories (product_id, category_id)
          VALUES (:product_id, :category_id)
          ON CONFLICT DO NOTHING
        `;
                await database_1.default.query(catQuery, {
                    replacements: {
                        product_id: id,
                        category_id: categoryId
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
            }
        }
        // Add product images if provided (expecting array of asset IDs)
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const assetId = typeof images[i] === 'string' ? images[i] : images[i].asset_id;
                const imgQuery = `
          INSERT INTO product_images (id, product_id, asset_id, sort_order)
          VALUES (:img_id, :product_id, :asset_id, :sort_order)
        `;
                await database_1.default.query(imgQuery, {
                    replacements: {
                        img_id: (0, uuid_1.v4)(),
                        product_id: id,
                        asset_id: assetId,
                        sort_order: i
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
            }
        }
        // Add product attributes if provided
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                const attrQuery = `
          INSERT INTO product_attributes (id, product_id, name, value)
          VALUES (:attr_id, :product_id, :name, :value)
        `;
                await database_1.default.query(attrQuery, {
                    replacements: {
                        attr_id: (0, uuid_1.v4)(),
                        product_id: id,
                        name: attr.name,
                        value: attr.value
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
            }
        }
        // Fetch full product data with brand and category for metadata sync
        const fullProductQuery = `
      SELECT 
        p.*,
        b.name as brand_name,
        (SELECT string_agg(pc.name, ', ') 
         FROM product_categories pc
         JOIN product_product_categories ppc ON pc.id = ppc.category_id
         WHERE ppc.product_id = p.id) as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = :id
    `;
        const fullProductResult = await database_1.default.query(fullProductQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        const fullProduct = fullProductResult[0] || product;
        // Auto-sync metadata to CMS Settings
        await (0, productMetadataSync_1.syncProductMetadataToCMS)(fullProduct);
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'create', 'product', id, name, `Created product "${name}"`);
        res.status(201).json(product);
    }
    catch (error) {
        console.error('[createProduct] Error:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to create product', message: error.message });
    }
};
exports.createProduct = createProduct;
// Update product
const updateProduct = async (req, res) => {
    try {
        console.log('[updateProduct] Request body:', JSON.stringify(req.body, null, 2));
        const { id } = req.params;
        const { name, slug, description, content, categories, // Array of category IDs for n-n relationship (required, no direct category_id)
        brand_id, sku, price, compare_price, cost_price, stock, status, is_featured, is_best_seller, thumbnail_id, seo, images, attributes } = req.body;
        // Build dynamic update query based on provided fields
        const updateFields = [];
        const replacements = { id };
        if (name !== undefined) {
            updateFields.push('name = :name');
            replacements.name = name;
        }
        if (slug !== undefined) {
            updateFields.push('slug = :slug');
            replacements.slug = slug;
        }
        if (description !== undefined) {
            updateFields.push('description = :description');
            replacements.description = description;
        }
        if (content !== undefined) {
            updateFields.push('content = :content');
            replacements.content = content ? JSON.stringify(content) : null;
        }
        // category_id is deprecated - use categories array (many-to-many) instead
        // if (category_id !== undefined) {
        //   updateFields.push('category_id = :category_id');
        //   replacements.category_id = category_id;
        // }
        if (brand_id !== undefined) {
            updateFields.push('brand_id = :brand_id');
            replacements.brand_id = brand_id;
        }
        if (sku !== undefined) {
            updateFields.push('sku = :sku');
            replacements.sku = sku;
        }
        if (price !== undefined) {
            updateFields.push('price = :price');
            replacements.price = Math.round(price); // Round to integer for VNĐ
        }
        if (compare_price !== undefined) {
            updateFields.push('compare_price = :compare_price');
            replacements.compare_price = compare_price ? Math.round(compare_price) : null;
        }
        if (cost_price !== undefined) {
            updateFields.push('cost_price = :cost_price');
            replacements.cost_price = cost_price ? Math.round(cost_price) : null;
        }
        if (stock !== undefined) {
            updateFields.push('stock = :stock');
            replacements.stock = stock;
        }
        if (status !== undefined) {
            updateFields.push('status = :status');
            replacements.status = status;
        }
        if (is_featured !== undefined) {
            updateFields.push('is_featured = :is_featured');
            replacements.is_featured = is_featured;
        }
        if (is_best_seller !== undefined) {
            updateFields.push('is_best_seller = :is_best_seller');
            replacements.is_best_seller = is_best_seller;
        }
        if (thumbnail_id !== undefined) {
            updateFields.push('thumbnail_id = :thumbnail_id');
            replacements.thumbnail_id = thumbnail_id;
        }
        if (seo !== undefined) {
            updateFields.push('seo = :seo');
            replacements.seo = seo ? JSON.stringify(seo) : null;
        }
        // Always update the updated_at timestamp
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        if (updateFields.length === 1) {
            // Only updated_at, nothing to update
            return res.status(400).json({ error: 'No fields to update' });
        }
        const query = `
      UPDATE products
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Update categories (n-n relationship) if provided
        if (categories !== undefined) {
            // Delete existing category associations
            await database_1.default.query('DELETE FROM product_product_categories WHERE product_id = :id', {
                replacements: { id },
                type: sequelize_1.QueryTypes.DELETE
            });
            // Add new category associations
            if (categories.length > 0) {
                for (const categoryId of categories) {
                    const catQuery = `
            INSERT INTO product_product_categories (product_id, category_id)
            VALUES (:product_id, :category_id)
            ON CONFLICT DO NOTHING
          `;
                    await database_1.default.query(catQuery, {
                        replacements: {
                            product_id: id,
                            category_id: categoryId
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                }
            }
        }
        // Update images if provided
        if (images !== undefined) {
            // Delete existing images
            await database_1.default.query('DELETE FROM product_images WHERE product_id = :id', {
                replacements: { id },
                type: sequelize_1.QueryTypes.DELETE
            });
            // Add new images (expecting array of asset IDs)
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const assetId = typeof images[i] === 'string' ? images[i] : images[i].asset_id;
                    const imgQuery = `
            INSERT INTO product_images (id, product_id, asset_id, sort_order)
            VALUES (:img_id, :product_id, :asset_id, :sort_order)
          `;
                    await database_1.default.query(imgQuery, {
                        replacements: {
                            img_id: (0, uuid_1.v4)(),
                            product_id: id,
                            asset_id: assetId,
                            sort_order: i
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                }
            }
        }
        // Update attributes if provided
        if (attributes !== undefined) {
            // Delete existing attributes
            await database_1.default.query('DELETE FROM product_attributes WHERE product_id = :id', {
                replacements: { id },
                type: sequelize_1.QueryTypes.DELETE
            });
            // Add new attributes
            if (attributes.length > 0) {
                for (const attr of attributes) {
                    const attrQuery = `
            INSERT INTO product_attributes (id, product_id, name, value)
            VALUES (:attr_id, :product_id, :name, :value)
          `;
                    await database_1.default.query(attrQuery, {
                        replacements: {
                            attr_id: (0, uuid_1.v4)(),
                            product_id: id,
                            name: attr.name,
                            value: attr.value
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                }
            }
        }
        const updatedProduct = result[0][0];
        // Fetch full product data with brand and category for metadata sync
        const fullProductQuery = `
      SELECT 
        p.*,
        b.name as brand_name,
        (SELECT string_agg(pc.name, ', ') 
         FROM product_categories pc
         JOIN product_product_categories ppc ON pc.id = ppc.category_id
         WHERE ppc.product_id = p.id) as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = :id
    `;
        const fullProductResult = await database_1.default.query(fullProductQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        const fullProduct = fullProductResult[0] || updatedProduct;
        // Auto-sync metadata to CMS Settings
        await (0, productMetadataSync_1.syncProductMetadataToCMS)(fullProduct);
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'update', 'product', id, updatedProduct.name, `Updated product "${updatedProduct.name}"`);
        res.json(updatedProduct);
    }
    catch (error) {
        console.error('[updateProduct] Error:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to update product', message: error.message });
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    let deletedProduct = null;
    let productSlug = null;
    try {
        const { id } = req.params;
        // First, get the product info before deleting (for metadata removal and logging)
        const getProductQuery = 'SELECT id, name, slug FROM products WHERE id = :id';
        const getProductResult = await database_1.default.query(getProductQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!getProductResult || getProductResult.length === 0 || !getProductResult[0]) {
            return res.status(404).json({ error: 'Product not found' });
        }
        deletedProduct = getProductResult[0];
        productSlug = deletedProduct?.slug || null;
        // Delete the product
        const result = await database_1.default.query('DELETE FROM products WHERE id = :id RETURNING *', {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!result[0] || result[0].length === 0) {
            // Product was already deleted or doesn't exist
            return res.status(404).json({ error: 'Product not found' });
        }
        // Product deleted successfully - now do cleanup (but don't fail if these fail)
        // Remove metadata from CMS Settings
        if (productSlug) {
            try {
                const { removeMetadataFromCMS } = await Promise.resolve().then(() => __importStar(require('../utils/removeMetadataFromCMS')));
                // Normalize slug to match how it's stored in metadata
                // The removeMetadataFromCMS function will also normalize, but doing it here ensures consistency
                const normalizedSlug = productSlug
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '');
                await removeMetadataFromCMS(`/products/${normalizedSlug}`);
            }
            catch (metaError) {
                console.error('[deleteProduct] Failed to remove metadata:', metaError);
                // Continue anyway - product is already deleted
            }
        }
        // Log activity (don't fail if logging fails)
        if (deletedProduct) {
            try {
                await (0, activityLogController_1.logActivity)(req, 'delete', 'product', id, deletedProduct.name, `Deleted product "${deletedProduct.name}"`);
            }
            catch (logError) {
                console.error('Failed to log activity for product deletion:', logError);
                // Continue anyway - product is already deleted
            }
        }
        // Always return success if product was deleted
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete product:', error);
        // If product was already deleted, return success
        if (deletedProduct) {
            console.log('Product was deleted but cleanup operations failed, returning success');
            return res.json({ message: 'Product deleted successfully' });
        }
        // Otherwise return error
        res.status(500).json({ error: 'Failed to delete product', message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
// Publish product
const publishProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      UPDATE products
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result[0][0]);
    }
    catch (error) {
        console.error('Failed to publish product:', error);
        res.status(500).json({ error: 'Failed to publish product' });
    }
};
exports.publishProduct = publishProduct;
// Duplicate product
const duplicateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[duplicateProduct] Starting duplicate for product ID: ${id}`);
        // Get original product with all related data
        const productQuery = `
      SELECT * FROM products WHERE id = :id
    `;
        const productResult = await database_1.default.query(productQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (productResult.length === 0) {
            console.error(`[duplicateProduct] Product not found: ${id}`);
            return res.status(404).json({ error: 'Product not found' });
        }
        const originalProductRaw = productResult[0];
        // Immediately normalize all JSON/object fields from database
        // PostgreSQL returns JSONB as objects, we need to stringify them
        const originalProduct = {};
        for (const [key, value] of Object.entries(originalProductRaw)) {
            if (value !== null && value !== undefined && typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value)) {
                // It's an object (likely JSONB from PostgreSQL), stringify it
                try {
                    originalProduct[key] = JSON.stringify(value);
                    console.log(`[duplicateProduct] Normalized ${key} from object to JSON string`);
                }
                catch (err) {
                    console.warn(`[duplicateProduct] Failed to stringify ${key}, keeping as is:`, err);
                    originalProduct[key] = value;
                }
            }
            else {
                originalProduct[key] = value;
            }
        }
        console.log(`[duplicateProduct] Original product: ${originalProduct.name}, SKU: ${originalProduct.sku || 'N/A'}`);
        // Generate new name and slug
        const baseName = originalProduct.name;
        let newName = `${baseName} (Copy)`;
        let baseSlug = (0, slug_1.generateSlug)(baseName) || `product-${Date.now()}`;
        let newSlug = `${baseSlug}-copy`;
        // Ensure unique slug (with max retries to prevent infinite loop)
        let counter = 1;
        const maxSlugRetries = 100;
        while (counter <= maxSlugRetries) {
            const existing = await database_1.default.query('SELECT id FROM products WHERE slug = :slug LIMIT 1', { replacements: { slug: newSlug }, type: sequelize_1.QueryTypes.SELECT });
            if (existing.length === 0)
                break;
            newSlug = `${baseSlug}-copy-${counter++}`;
            newName = `${baseName} (Copy ${counter > 1 ? counter : ''})`.trim();
        }
        if (counter > maxSlugRetries) {
            throw new Error(`Failed to generate unique slug after ${maxSlugRetries} attempts`);
        }
        console.log(`[duplicateProduct] Generated slug: ${newSlug}`);
        // Generate new SKU (if original has SKU)
        let newSku = null;
        if (originalProduct.sku) {
            // Clean SKU: remove extra spaces and normalize
            const skuBase = String(originalProduct.sku).trim().replace(/\s+/g, ' ');
            let skuCounter = 1;
            newSku = `${skuBase}-COPY`;
            // Ensure unique SKU (with max retries to prevent infinite loop)
            const maxSkuRetries = 100;
            while (skuCounter <= maxSkuRetries) {
                const existing = await database_1.default.query('SELECT id FROM products WHERE sku = :sku LIMIT 1', { replacements: { sku: newSku }, type: sequelize_1.QueryTypes.SELECT });
                if (existing.length === 0)
                    break;
                newSku = `${skuBase}-COPY${skuCounter++}`;
            }
            if (skuCounter > maxSkuRetries) {
                // If can't generate unique SKU, use timestamp-based SKU
                console.warn(`[duplicateProduct] Could not generate unique SKU after ${maxSkuRetries} attempts, using timestamp-based SKU`);
                newSku = `${skuBase}-COPY-${Date.now()}`;
            }
            console.log(`[duplicateProduct] Generated SKU: ${newSku}`);
        }
        // Create new product
        const newId = (0, uuid_1.v4)();
        const insertQuery = `
      INSERT INTO products (
        id, name, slug, description, content, brand_id,
        sku, price, compare_price, cost_price, stock, status,
        is_featured, is_best_seller, thumbnail_id, seo
      )
      VALUES (
        :id, :name, :slug, :description, :content, :brand_id,
        :sku, :price, :compare_price, :cost_price, :stock, :status,
        :is_featured, :is_best_seller, :thumbnail_id, :seo
      )
      RETURNING *
    `;
        // Helper function to stringify JSON/object values
        const stringifyIfObject = (value) => {
            if (value === null || value === undefined) {
                return null;
            }
            // If it's already a string, return as is (even if it's JSON string)
            if (typeof value === 'string') {
                return value;
            }
            // If it's a number, boolean, or other primitive, return as is
            if (typeof value !== 'object') {
                return value;
            }
            // If it's an object or array, stringify it
            // This includes: {}, [], Date objects, etc.
            try {
                return JSON.stringify(value);
            }
            catch (stringifyError) {
                console.warn(`[duplicateProduct] Failed to stringify value:`, stringifyError);
                // If stringify fails, try toString() or return null
                return value?.toString() || null;
            }
        };
        // Stringify ALL values that might be objects - be very aggressive
        const contentValue = stringifyIfObject(originalProduct.content);
        const seoValue = stringifyIfObject(originalProduct.seo);
        const descriptionValue = stringifyIfObject(originalProduct.description);
        // Build insert params and stringify ALL values that are objects
        const insertParamsRaw = {
            id: newId,
            name: newName,
            slug: newSlug,
            description: descriptionValue,
            content: contentValue,
            brand_id: originalProduct.brand_id || null,
            sku: newSku,
            price: originalProduct.price || 0,
            compare_price: originalProduct.compare_price || null,
            cost_price: originalProduct.cost_price || null,
            stock: originalProduct.stock || 0,
            status: 'draft',
            is_featured: false,
            is_best_seller: false,
            thumbnail_id: originalProduct.thumbnail_id || null,
            seo: seoValue
        };
        // Final pass: stringify ANY remaining objects in insertParams
        // Use a more aggressive check - check for ANY object-like value
        const insertParams = {};
        for (const [key, value] of Object.entries(insertParamsRaw)) {
            // More aggressive check: if it's not a primitive, stringify it
            if (value === null || value === undefined) {
                insertParams[key] = value;
            }
            else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                // Primitives are safe
                insertParams[key] = value;
            }
            else {
                // Anything else (object, array, Date, etc.) - stringify it
                try {
                    insertParams[key] = JSON.stringify(value);
                    console.warn(`[duplicateProduct] Stringified ${key} (type: ${typeof value}, constructor: ${value?.constructor?.name})`);
                }
                catch (stringifyErr) {
                    console.error(`[duplicateProduct] Failed to stringify ${key}:`, stringifyErr);
                    insertParams[key] = String(value);
                }
            }
        }
        // Double-check: log any remaining objects
        for (const [key, value] of Object.entries(insertParams)) {
            if (value !== null && value !== undefined && typeof value === 'object') {
                console.error(`[duplicateProduct] ERROR: Still found object in ${key} after stringify!`, value);
            }
        }
        console.log(`[duplicateProduct] Inserting new product with ID: ${newId}, name: ${newName}, slug: ${newSlug}, SKU: ${newSku || 'N/A'}`);
        let insertResult;
        try {
            insertResult = await database_1.default.query(insertQuery, {
                replacements: insertParams,
                type: sequelize_1.QueryTypes.INSERT
            });
        }
        catch (insertError) {
            console.error(`[duplicateProduct] Failed to insert product:`, insertError);
            // Check for specific constraint violations
            if (insertError.message && insertError.message.includes('duplicate key')) {
                if (insertError.message.includes('slug')) {
                    throw new Error(`Slug "${newSlug}" already exists. Please try again.`);
                }
                else if (insertError.message.includes('sku')) {
                    throw new Error(`SKU "${newSku}" already exists. Please try again.`);
                }
            }
            throw insertError;
        }
        if (!insertResult || !insertResult[0] || insertResult[0].length === 0) {
            throw new Error('Failed to create duplicated product - no data returned');
        }
        const newProduct = insertResult[0][0];
        console.log(`[duplicateProduct] Product created successfully: ${newProduct.id}`);
        // Copy categories (n-n relationship)
        const categoriesQuery = `
      SELECT category_id FROM product_product_categories WHERE product_id = :id
    `;
        const categoriesResult = await database_1.default.query(categoriesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (categoriesResult.length > 0) {
            for (const cat of categoriesResult) {
                await database_1.default.query('INSERT INTO product_product_categories (product_id, category_id) VALUES (:product_id, :category_id) ON CONFLICT DO NOTHING', {
                    replacements: {
                        product_id: newId,
                        category_id: cat.category_id
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
            }
        }
        // Copy images
        const imagesQuery = `
      SELECT asset_id, sort_order FROM product_images WHERE product_id = :id ORDER BY sort_order ASC
    `;
        const imagesResult = await database_1.default.query(imagesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (imagesResult.length > 0) {
            for (let i = 0; i < imagesResult.length; i++) {
                const img = imagesResult[i];
                await database_1.default.query('INSERT INTO product_images (id, product_id, asset_id, sort_order) VALUES (:img_id, :product_id, :asset_id, :sort_order)', {
                    replacements: {
                        img_id: (0, uuid_1.v4)(),
                        product_id: newId,
                        asset_id: img.asset_id,
                        sort_order: img.sort_order || i
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
            }
        }
        // Copy attributes
        const attributesQuery = `
      SELECT name, value FROM product_attributes WHERE product_id = :id
    `;
        const attributesResult = await database_1.default.query(attributesQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (attributesResult.length > 0) {
            for (const attr of attributesResult) {
                // Stringify value and name if they are objects
                const attrName = stringifyIfObject(attr.name);
                const attrValue = stringifyIfObject(attr.value);
                console.log(`[duplicateProduct] Copying attribute: name=${attrName}, value type=${typeof attr.value}`);
                try {
                    await database_1.default.query('INSERT INTO product_attributes (id, product_id, name, value) VALUES (:attr_id, :product_id, :name, :value)', {
                        replacements: {
                            attr_id: (0, uuid_1.v4)(),
                            product_id: newId,
                            name: attrName,
                            value: attrValue
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                }
                catch (attrError) {
                    console.error(`[duplicateProduct] Failed to copy attribute:`, {
                        name: attrName,
                        valueType: typeof attr.value,
                        error: attrError.message
                    });
                    // Continue with other attributes even if one fails
                }
            }
        }
        // Return the new product with related data (similar to getProductById)
        // Don't use deprecated category_id join - use many-to-many relationship instead
        const fullProductQuery = `
      SELECT 
        p.*,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.id = :id
    `;
        const fullProductResult = await database_1.default.query(fullProductQuery, {
            replacements: { id: newId },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!fullProductResult || fullProductResult.length === 0) {
            throw new Error('Failed to retrieve duplicated product');
        }
        const fullProduct = fullProductResult[0];
        // Load categories (many-to-many relationship)
        const newCategoriesQuery = `
      SELECT c.id, c.name, c.slug
      FROM product_categories c
      JOIN product_product_categories ppc ON c.id = ppc.category_id
      WHERE ppc.product_id = :id
      ORDER BY c.name ASC
    `;
        const newCategoriesResult = await database_1.default.query(newCategoriesQuery, {
            replacements: { id: newId },
            type: sequelize_1.QueryTypes.SELECT
        });
        fullProduct.categories = newCategoriesResult || [];
        // Load images
        const newImagesQuery = `
      SELECT pi.*, a.url, a.width, a.height, a.format
      FROM product_images pi
      JOIN assets a ON pi.asset_id = a.id
      WHERE pi.product_id = :id
      ORDER BY pi.sort_order ASC
    `;
        const newImagesResult = await database_1.default.query(newImagesQuery, {
            replacements: { id: newId },
            type: sequelize_1.QueryTypes.SELECT
        });
        fullProduct.images = newImagesResult || [];
        // Load attributes
        const newAttributesQuery = `
      SELECT * FROM product_attributes
      WHERE product_id = :id
      ORDER BY name ASC
    `;
        const newAttributesResult = await database_1.default.query(newAttributesQuery, {
            replacements: { id: newId },
            type: sequelize_1.QueryTypes.SELECT
        });
        fullProduct.attributes = newAttributesResult || [];
        // Log activity (don't fail if logging fails)
        try {
            await (0, activityLogController_1.logActivity)(req, 'duplicate', 'product', newId, newName, `Duplicated product from "${originalProduct.name}"`);
        }
        catch (logError) {
            console.error('Failed to log activity for product duplication:', logError);
            // Continue anyway - product is already duplicated
        }
        // Sync metadata to CMS (don't fail if sync fails)
        try {
            const fullProductForMetadata = {
                ...fullProduct,
                brand_name: fullProduct.brand_name || null,
                category_name: fullProduct.categories?.map((c) => c.name).join(', ') || null
            };
            await (0, productMetadataSync_1.syncProductMetadataToCMS)(fullProductForMetadata);
        }
        catch (metaError) {
            console.error('Failed to sync metadata for duplicated product:', metaError);
            // Continue anyway - product is already duplicated
        }
        console.log(`[duplicateProduct] Duplicate completed successfully for product: ${newId}`);
        res.status(201).json(fullProduct);
    }
    catch (error) {
        console.error(`[duplicateProduct] Error duplicating product ${req.params.id}:`, {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        // Provide more specific error messages
        let errorMessage = 'Failed to duplicate product';
        if (error.message) {
            errorMessage = error.message;
        }
        else if (error.code === '23505') { // PostgreSQL unique violation
            errorMessage = 'A product with the same slug or SKU already exists';
        }
        else if (error.code === '23503') { // PostgreSQL foreign key violation
            errorMessage = 'Invalid reference data (brand, category, etc.)';
        }
        res.status(500).json({
            error: 'Failed to duplicate product',
            message: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.duplicateProduct = duplicateProduct;
// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.is_featured = TRUE AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT :limit
    `;
        const result = await database_1.default.query(query, {
            replacements: { limit: parseInt(limit) },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Failed to fetch featured products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
// Get best sellers
const getBestSellers = async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.is_best_seller = TRUE AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT :limit
    `;
        const result = await database_1.default.query(query, {
            replacements: { limit: parseInt(limit) },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Failed to fetch best sellers:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch best sellers' });
    }
};
exports.getBestSellers = getBestSellers;
const allowedStatuses = new Set(['draft', 'published', 'archived']);
const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};
const parseBoolean = (value) => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return ['true', '1', 'yes', 'y', 'on', 'x'].includes(normalized);
    }
    return false;
};
const slugExists = async (slug) => {
    const existing = await database_1.default.query(`SELECT id FROM products WHERE slug = :slug LIMIT 1`, { replacements: { slug }, type: sequelize_1.QueryTypes.SELECT });
    return existing.length > 0;
};
// Local function for product slug generation with cache
const ensureUniqueProductSlug = async (initial, cache) => {
    let base = (0, slug_1.generateSlug)(initial);
    if (!base) {
        base = `product-${Date.now()}`;
    }
    let candidate = base;
    let counter = 1;
    while (cache.has(candidate) || (await slugExists(candidate))) {
        candidate = `${base}-${counter++}`;
    }
    cache.add(candidate);
    return candidate;
};
const importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }
        let workbook;
        try {
            workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        }
        catch (error) {
            console.error('Failed to parse Excel file:', error);
            return res.status(400).json({ error: 'Invalid Excel file' });
        }
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            return res.status(400).json({ error: 'Excel file does not contain any sheet' });
        }
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null, raw: false });
        if (!rows.length) {
            return res.status(400).json({ error: 'Excel sheet is empty' });
        }
        const errors = [];
        let successCount = 0;
        const slugCache = new Set();
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const rowNumber = index + 2; // header row is 1
            try {
                const name = (row.name ?? row.Name ?? '').toString().trim();
                if (!name) {
                    throw new Error('Column "name" is required');
                }
                const priceValue = parseNumber(row.price ?? row.Price);
                if (priceValue === null) {
                    throw new Error('Column "price" is required');
                }
                let slugValue = (row.slug ?? row.Slug ?? '').toString().trim();
                if (!slugValue) {
                    slugValue = name;
                }
                slugValue = await ensureUniqueProductSlug(slugValue, slugCache);
                let skuValue = row.sku ?? row.SKU ?? null;
                if (skuValue !== null && skuValue !== undefined) {
                    skuValue = skuValue.toString().trim();
                    if (skuValue === '') {
                        skuValue = null;
                    }
                }
                if (skuValue) {
                    const existingSku = await database_1.default.query(`SELECT id FROM products WHERE sku = :sku LIMIT 1`, { replacements: { sku: skuValue }, type: sequelize_1.QueryTypes.SELECT });
                    if (existingSku.length > 0) {
                        throw new Error(`SKU "${skuValue}" already exists`);
                    }
                }
                const comparePrice = parseNumber(row.compare_price ?? row.comparePrice ?? row.Compare_Price);
                const costPrice = parseNumber(row.cost_price ?? row.costPrice ?? row.Cost_Price);
                const stockValue = parseNumber(row.stock ?? row.Stock);
                const statusRaw = (row.status ?? row.Status ?? '').toString().trim().toLowerCase();
                const statusValue = allowedStatuses.has(statusRaw) ? statusRaw : 'draft';
                const isFeatured = parseBoolean(row.is_featured ?? row.Is_Featured);
                const isBestSeller = parseBoolean(row.is_best_seller ?? row.Is_Best_Seller);
                const id = (0, uuid_1.v4)();
                await database_1.default.query(`
            INSERT INTO products (
              id,
              name,
              slug,
              sku,
              description,
              price,
              compare_price,
              cost_price,
              stock,
              status,
              is_featured,
              is_best_seller,
              created_at,
              updated_at
            )
            VALUES (
              :id,
              :name,
              :slug,
              :sku,
              :description,
              :price,
              :compare_price,
              :cost_price,
              :stock,
              :status,
              :is_featured,
              :is_best_seller,
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
            )
          `, {
                    replacements: {
                        id,
                        name,
                        slug: slugValue,
                        sku: skuValue || null,
                        description: null,
                        price: priceValue,
                        compare_price: comparePrice ?? null,
                        cost_price: costPrice ?? null,
                        stock: stockValue !== null ? Math.max(0, Math.floor(stockValue)) : 0,
                        status: statusValue,
                        is_featured: isFeatured,
                        is_best_seller: isBestSeller
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
                successCount += 1;
            }
            catch (error) {
                errors.push({
                    row: rowNumber,
                    message: error?.message ?? 'Unexpected error'
                });
            }
        }
        res.json({
            successCount,
            failureCount: errors.length,
            errors
        });
    }
    catch (error) {
        console.error('Failed to import products:', error);
        res.status(500).json({ error: 'Failed to import products' });
    }
};
exports.importProducts = importProducts;
//# sourceMappingURL=productController.js.map