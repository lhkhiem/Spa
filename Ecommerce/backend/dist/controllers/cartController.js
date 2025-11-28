"use strict";
// Cart Controller
// Handles shopping cart operations (add, update, remove, get)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get cart items for user or session
const getCart = async (req, res) => {
    try {
        const { user_id, session_id } = req.query;
        if (!user_id && !session_id) {
            return res.status(400).json({ error: 'user_id or session_id required' });
        }
        const whereClause = user_id
            ? 'ci.user_id = :identifier'
            : 'ci.session_id = :identifier';
        const query = `
      SELECT 
        ci.*,
        p.id as product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.price as product_price,
        p.compare_price,
        p.stock,
        p.status as product_status,
        a.url as thumbnail_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE ${whereClause}
      ORDER BY ci.created_at DESC
    `;
        const items = await database_1.default.query(query, {
            replacements: { identifier: user_id || session_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        // Calculate totals
        const subtotal = items.reduce((sum, item) => {
            const price = item.snapshot_price || item.product_price || 0;
            return sum + (price * item.quantity);
        }, 0);
        res.json({
            items,
            subtotal,
            item_count: items.length
        });
    }
    catch (error) {
        console.error('Failed to fetch cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};
exports.getCart = getCart;
// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { user_id, session_id, product_id, quantity = 1 } = req.body;
        if (!product_id) {
            return res.status(400).json({ error: 'product_id is required' });
        }
        if (!user_id && !session_id) {
            return res.status(400).json({ error: 'user_id or session_id required' });
        }
        // Get product price for snapshot
        const productQuery = `
      SELECT price FROM products WHERE id = :product_id AND status = 'published'
    `;
        const products = await database_1.default.query(productQuery, {
            replacements: { product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Product not found or not available' });
        }
        const snapshotPrice = products[0].price;
        // Check if item already exists in cart
        const whereClause = user_id
            ? 'user_id = :identifier AND product_id = :product_id'
            : 'session_id = :identifier AND product_id = :product_id';
        const existingQuery = `
      SELECT * FROM cart_items
      WHERE ${whereClause}
    `;
        const existing = await database_1.default.query(existingQuery, {
            replacements: { identifier: user_id || session_id, product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        let cartItem;
        if (existing && existing.length > 0) {
            // Update quantity if exists
            const updateQuery = `
        UPDATE cart_items
        SET quantity = quantity + :add_qty,
            updated_at = CURRENT_TIMESTAMP
        WHERE ${whereClause}
        RETURNING *
      `;
            const updated = await database_1.default.query(updateQuery, {
                replacements: { identifier: user_id || session_id, product_id, add_qty: quantity },
                type: sequelize_1.QueryTypes.UPDATE
            });
            cartItem = updated[0];
        }
        else {
            // Insert new item
            const insertQuery = `
        INSERT INTO cart_items (id, user_id, session_id, product_id, quantity, snapshot_price, created_at, updated_at)
        VALUES (:id, :user_id, :session_id, :product_id, :quantity, :snapshot_price, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
            const inserted = await database_1.default.query(insertQuery, {
                replacements: {
                    id: (0, uuid_1.v4)(),
                    user_id: user_id || null,
                    session_id: session_id || null,
                    product_id,
                    quantity,
                    snapshot_price: snapshotPrice
                },
                type: sequelize_1.QueryTypes.INSERT
            });
            cartItem = inserted[0];
        }
        res.status(201).json(cartItem);
    }
    catch (error) {
        console.error('Failed to add to cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};
exports.addToCart = addToCart;
// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity required' });
        }
        const query = `
      UPDATE cart_items
      SET quantity = :quantity,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;
        const updated = await database_1.default.query(query, {
            replacements: { id, quantity },
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!updated || updated.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json(updated[0]);
    }
    catch (error) {
        console.error('Failed to update cart item:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      DELETE FROM cart_items
      WHERE id = :id
      RETURNING id
    `;
        const deleted = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!deleted || deleted.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ success: true, id: deleted[0].id });
    }
    catch (error) {
        console.error('Failed to remove from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};
exports.removeFromCart = removeFromCart;
// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const { user_id, session_id } = req.query;
        if (!user_id && !session_id) {
            return res.status(400).json({ error: 'user_id or session_id required' });
        }
        const whereClause = user_id
            ? 'user_id = :identifier'
            : 'session_id = :identifier';
        const query = `
      DELETE FROM cart_items
      WHERE ${whereClause}
    `;
        await database_1.default.query(query, {
            replacements: { identifier: user_id || session_id },
            type: sequelize_1.QueryTypes.DELETE
        });
        res.json({ success: true, message: 'Cart cleared' });
    }
    catch (error) {
        console.error('Failed to clear cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cartController.js.map