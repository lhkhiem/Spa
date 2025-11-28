"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductAttribute = exports.updateProductAttribute = exports.createProductAttribute = exports.getProductAttributeById = exports.getProductAttributes = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const getProductAttributes = async (req, res) => {
    try {
        const { page = 1, pageSize = 50, product_id: productId, q, } = req.query;
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSizeNumber = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);
        const offset = (pageNumber - 1) * pageSizeNumber;
        const whereConditions = [];
        const replacements = {
            limit: pageSizeNumber,
            offset,
        };
        if (productId) {
            whereConditions.push('pa.product_id = :product_id');
            replacements.product_id = productId;
        }
        if (q) {
            whereConditions.push('(pa.name ILIKE :search OR pa.value ILIKE :search)');
            replacements.search = `%${q}%`;
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const countQuery = `
      SELECT COUNT(*)::int as total
      FROM product_attributes pa
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        const total = countResult?.[0]?.total ?? 0;
        const dataQuery = `
      SELECT 
        pa.*,
        p.name AS product_name,
        p.slug AS product_slug
      FROM product_attributes pa
      LEFT JOIN products p ON pa.product_id = p.id
      ${whereClause}
      ORDER BY pa.created_at DESC, pa.name ASC
      LIMIT :limit OFFSET :offset
    `;
        const data = await database_1.default.query(dataQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            data,
            total,
            page: pageNumber,
            pageSize: pageSizeNumber,
            totalPages: Math.ceil(total / pageSizeNumber),
        });
    }
    catch (error) {
        console.error('Failed to fetch product attributes:', error);
        res.status(500).json({ error: 'Failed to fetch product attributes' });
    }
};
exports.getProductAttributes = getProductAttributes;
const getProductAttributeById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        pa.*,
        p.name AS product_name,
        p.slug AS product_slug
      FROM product_attributes pa
      LEFT JOIN products p ON pa.product_id = p.id
      WHERE pa.id = :id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Product attribute not found' });
        }
        res.json(result[0]);
    }
    catch (error) {
        console.error('Failed to fetch product attribute:', error);
        res.status(500).json({ error: 'Failed to fetch product attribute' });
    }
};
exports.getProductAttributeById = getProductAttributeById;
const createProductAttribute = async (req, res) => {
    try {
        const { product_id: productId, name, value } = req.body;
        if (!productId || !name) {
            return res
                .status(400)
                .json({ error: 'product_id and name are required fields' });
        }
        // Ensure product exists
        const productCheckQuery = `
      SELECT id, name, slug
      FROM products
      WHERE id = :product_id
      LIMIT 1
    `;
        const productResult = await database_1.default.query(productCheckQuery, {
            replacements: { product_id: productId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!productResult || productResult.length === 0) {
            return res.status(400).json({ error: 'Invalid product_id' });
        }
        const id = (0, uuid_1.v4)();
        const insertQuery = `
      INSERT INTO product_attributes (id, product_id, name, value)
      VALUES (:id, :product_id, :name, :value)
      RETURNING *
    `;
        const insertResult = await database_1.default.query(insertQuery, {
            replacements: {
                id,
                product_id: productId,
                name,
                value: value ?? null,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        const attribute = insertResult?.[0]?.[0];
        const responsePayload = {
            ...attribute,
            product_name: productResult[0].name,
            product_slug: productResult[0].slug,
        };
        res.status(201).json(responsePayload);
    }
    catch (error) {
        console.error('Failed to create product attribute:', error);
        res
            .status(500)
            .json({ error: 'Failed to create product attribute', message: error.message });
    }
};
exports.createProductAttribute = createProductAttribute;
const updateProductAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id: productId, name, value } = req.body;
        const updateFields = [];
        const replacements = { id };
        if (productId !== undefined) {
            // Validate product if provided
            const productCheckQuery = `
        SELECT id
        FROM products
        WHERE id = :product_id
        LIMIT 1
      `;
            const productResult = await database_1.default.query(productCheckQuery, {
                replacements: { product_id: productId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (!productResult || productResult.length === 0) {
                return res.status(400).json({ error: 'Invalid product_id' });
            }
            updateFields.push('product_id = :product_id');
            replacements.product_id = productId;
        }
        if (name !== undefined) {
            updateFields.push('name = :name');
            replacements.name = name;
        }
        if (value !== undefined) {
            updateFields.push('value = :value');
            replacements.value = value ?? null;
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        const updateQuery = `
      UPDATE product_attributes
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const updateResult = await database_1.default.query(updateQuery, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE,
        });
        if (!updateResult?.[0] || updateResult[0].length === 0) {
            return res.status(404).json({ error: 'Product attribute not found' });
        }
        const updatedAttribute = updateResult[0][0];
        const joinQuery = `
      SELECT 
        pa.*,
        p.name AS product_name,
        p.slug AS product_slug
      FROM product_attributes pa
      LEFT JOIN products p ON pa.product_id = p.id
      WHERE pa.id = :id
    `;
        const result = await database_1.default.query(joinQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json(result[0] || updatedAttribute);
    }
    catch (error) {
        console.error('Failed to update product attribute:', error);
        res
            .status(500)
            .json({ error: 'Failed to update product attribute', message: error.message });
    }
};
exports.updateProductAttribute = updateProductAttribute;
const deleteProductAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = `
      DELETE FROM product_attributes
      WHERE id = :id
      RETURNING *
    `;
        const deleteResult = await database_1.default.query(deleteQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (!deleteResult?.[0] || deleteResult[0].length === 0) {
            return res.status(404).json({ error: 'Product attribute not found' });
        }
        res.json({ message: 'Product attribute deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete product attribute:', error);
        res.status(500).json({ error: 'Failed to delete product attribute' });
    }
};
exports.deleteProductAttribute = deleteProductAttribute;
//# sourceMappingURL=productAttributeController.js.map