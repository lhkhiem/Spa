"use strict";
// Brand controller
// Handles CRUD operations for brands
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrandBySlug = exports.getBrandById = exports.getBrands = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const activityLogController_1 = require("./activityLogController");
const getBrands = async (req, res) => {
    try {
        const { featured_only, q } = req.query;
        const conditions = [];
        const replacements = {};
        if (featured_only === 'true') {
            conditions.push('b.is_featured = TRUE');
        }
        if (q && typeof q === 'string' && q.trim().length > 0) {
            conditions.push('(b.name ILIKE :search OR b.slug ILIKE :search)');
            replacements.search = `%${q.trim()}%`;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT 
        b.*,
        COALESCE(a.cdn_url, a.url) as logo_url,
        a.format as logo_format,
        a.width as logo_width,
        a.height as logo_height,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as product_count,
        (
          SELECT c.name 
          FROM products p2
          LEFT JOIN product_product_categories ppc ON ppc.product_id = p2.id
          LEFT JOIN product_categories c ON c.id = ppc.category_id
          WHERE p2.brand_id = b.id AND p2.status = 'published' AND c.id IS NOT NULL
          GROUP BY c.name
          ORDER BY COUNT(DISTINCT p2.id) DESC
          LIMIT 1
        ) as primary_category
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      LEFT JOIN products p ON p.brand_id = b.id
      ${whereClause}
      GROUP BY 
        b.id,
        b.name,
        b.slug,
        b.description,
        b.logo_id,
        b.website,
        b.is_featured,
        b.created_at,
        b.updated_at,
        a.cdn_url,
        a.url,
        a.format,
        a.width,
        a.height
      ORDER BY b.name ASC
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Failed to fetch brands:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};
exports.getBrands = getBrands;
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        b.*,
        COALESCE(a.cdn_url, a.url) as logo_url,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as product_count,
        (
          SELECT c.name 
          FROM products p2
          LEFT JOIN product_product_categories ppc ON ppc.product_id = p2.id
          LEFT JOIN product_categories c ON c.id = ppc.category_id
          WHERE p2.brand_id = b.id AND p2.status = 'published' AND c.id IS NOT NULL
          GROUP BY c.name
          ORDER BY COUNT(DISTINCT p2.id) DESC
          LIMIT 1
        ) as primary_category
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      LEFT JOIN products p ON p.brand_id = b.id
      WHERE b.id = :id
      GROUP BY 
        b.id,
        b.name,
        b.slug,
        b.description,
        b.logo_id,
        b.website,
        b.is_featured,
        b.created_at,
        b.updated_at,
        a.cdn_url,
        a.url
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json(result[0]);
    }
    catch (error) {
        console.error('Failed to fetch brand:', error);
        res.status(500).json({ error: 'Failed to fetch brand' });
    }
};
exports.getBrandById = getBrandById;
const getBrandBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const query = `
      SELECT 
        b.*,
        COALESCE(a.cdn_url, a.url) as logo_url,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as product_count,
        (
          SELECT c.name 
          FROM products p2
          LEFT JOIN product_product_categories ppc ON ppc.product_id = p2.id
          LEFT JOIN product_categories c ON c.id = ppc.category_id
          WHERE p2.brand_id = b.id AND p2.status = 'published' AND c.id IS NOT NULL
          GROUP BY c.name
          ORDER BY COUNT(DISTINCT p2.id) DESC
          LIMIT 1
        ) as primary_category
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      LEFT JOIN products p ON p.brand_id = b.id
      WHERE b.slug = :slug
      GROUP BY 
        b.id,
        b.name,
        b.slug,
        b.description,
        b.logo_id,
        b.website,
        b.is_featured,
        b.created_at,
        b.updated_at,
        a.cdn_url,
        a.url
    `;
        const result = await database_1.default.query(query, {
            replacements: { slug },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json({ success: true, data: result[0] });
    }
    catch (error) {
        console.error('Failed to fetch brand by slug:', error);
        res.status(500).json({ error: 'Failed to fetch brand' });
    }
};
exports.getBrandBySlug = getBrandBySlug;
const createBrand = async (req, res) => {
    try {
        const { name, slug, description, logo_id, website, is_featured } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const id = (0, uuid_1.v4)();
        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const query = `
      INSERT INTO brands (id, name, slug, description, logo_id, website, is_featured)
      VALUES (:id, :name, :slug, :description, :logo_id, :website, :is_featured)
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                name,
                slug: generatedSlug,
                description: description || null,
                logo_id: logo_id || null,
                website: website || null,
                is_featured: is_featured ?? false,
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        const brand = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'create', 'brand', id, name, `Created brand "${name}"`);
        res.status(201).json(brand);
    }
    catch (error) {
        console.error('Failed to create brand:', error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, logo_id, website, is_featured } = req.body;
        const query = `
      UPDATE brands
      SET 
        name = COALESCE(:name, name),
        slug = COALESCE(:slug, slug),
        description = COALESCE(:description, description),
        logo_id = COALESCE(:logo_id, logo_id),
        website = COALESCE(:website, website),
        is_featured = COALESCE(:is_featured, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                name: name ?? null,
                slug: slug ?? null,
                description: description !== undefined ? description : null,
                logo_id: logo_id !== undefined ? logo_id : null,
                website: website ?? null,
                is_featured: is_featured !== undefined ? is_featured : null,
            },
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        const updatedBrand = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'update', 'brand', id, updatedBrand.name, `Updated brand "${updatedBrand.name}"`);
        res.json(updatedBrand);
    }
    catch (error) {
        console.error('Failed to update brand:', error);
        res.status(500).json({ error: 'Failed to update brand' });
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        // Get brand name before deleting
        const getBrandQuery = 'SELECT name FROM brands WHERE id = :id';
        const brandResult = await database_1.default.query(getBrandQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        const brandName = brandResult[0]?.name || 'Unknown';
        const result = await database_1.default.query('DELETE FROM brands WHERE id = :id RETURNING *', {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'brand', id, brandName, `Deleted brand "${brandName}"`);
        res.json({ message: 'Brand deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete brand:', error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};
exports.deleteBrand = deleteBrand;
//# sourceMappingURL=brandController.js.map