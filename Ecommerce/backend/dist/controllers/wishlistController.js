"use strict";
// Wishlist Controller
// Handles user wishlist operations
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWishlist = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'user_id required' });
        }
        const query = `
      SELECT 
        wi.*,
        p.id as product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.price as product_price,
        p.compare_price,
        p.stock,
        p.status as product_status,
        a.url as thumbnail_url
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE wi.user_id = :user_id
      ORDER BY wi.created_at DESC
    `;
        const items = await database_1.default.query(query, {
            replacements: { user_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({
            items,
            item_count: items.length
        });
    }
    catch (error) {
        console.error('Failed to fetch wishlist:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};
exports.getWishlist = getWishlist;
// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        if (!user_id || !product_id) {
            return res.status(400).json({ error: 'user_id and product_id required' });
        }
        // Check if product exists
        const productQuery = `
      SELECT id FROM products WHERE id = :product_id AND status = 'published'
    `;
        const products = await database_1.default.query(productQuery, {
            replacements: { product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Product not found or not available' });
        }
        // Check if already in wishlist
        const existingQuery = `
      SELECT id FROM wishlist_items WHERE user_id = :user_id AND product_id = :product_id
    `;
        const existing = await database_1.default.query(existingQuery, {
            replacements: { user_id, product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }
        // Add to wishlist
        const insertQuery = `
      INSERT INTO wishlist_items (id, user_id, product_id, created_at)
      VALUES (:id, :user_id, :product_id, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const inserted = await database_1.default.query(insertQuery, {
            replacements: {
                id: (0, uuid_1.v4)(),
                user_id,
                product_id
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(201).json(inserted[0]);
    }
    catch (error) {
        console.error('Failed to add to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};
exports.addToWishlist = addToWishlist;
// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const query = `
      DELETE FROM wishlist_items
      WHERE user_id = :user_id AND product_id = :product_id
      RETURNING id
    `;
        const deleted = await database_1.default.query(query, {
            replacements: { user_id, product_id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!deleted || deleted.length === 0) {
            return res.status(404).json({ error: 'Product not in wishlist' });
        }
        res.json({ success: true, message: 'Removed from wishlist' });
    }
    catch (error) {
        console.error('Failed to remove from wishlist:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};
exports.removeFromWishlist = removeFromWishlist;
// Check if product is in wishlist
const checkWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.query;
        if (!user_id || !product_id) {
            return res.status(400).json({ error: 'user_id and product_id required' });
        }
        const query = `
      SELECT id FROM wishlist_items
      WHERE user_id = :user_id AND product_id = :product_id
    `;
        const results = await database_1.default.query(query, {
            replacements: { user_id, product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({
            in_wishlist: results && results.length > 0
        });
    }
    catch (error) {
        console.error('Failed to check wishlist:', error);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
};
exports.checkWishlist = checkWishlist;
//# sourceMappingURL=wishlistController.js.map