"use strict";
// Inventory Controller
// Handles inventory management, stock tracking, and reporting
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockSettings = exports.updateStockSettings = exports.getLowStockAlerts = exports.bulkAdjustStock = exports.adjustStock = exports.getProductMovements = exports.getInventoryProducts = exports.getInventoryStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const stockService_1 = require("../services/stockService");
// Get inventory statistics for dashboard
const getInventoryStats = async (req, res) => {
    try {
        // Total products
        const totalProductsQuery = `
      SELECT COUNT(*) as count
      FROM products
      WHERE status = 'published'
    `;
        const totalProducts = await database_1.default.query(totalProductsQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Low stock items (stock <= threshold)
        const lowStockQuery = `
      SELECT COUNT(DISTINCT p.id) as count
      FROM products p
      LEFT JOIN stock_settings ss ON ss.product_id = p.id AND ss.variant_id IS NULL
      WHERE p.status = 'published'
      AND p.stock <= COALESCE(ss.low_stock_threshold, 10)
      AND p.stock > 0
    `;
        const lowStock = await database_1.default.query(lowStockQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Out of stock items
        const outOfStockQuery = `
      SELECT COUNT(*) as count
      FROM products
      WHERE status = 'published'
      AND stock <= 0
    `;
        const outOfStock = await database_1.default.query(outOfStockQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Total stock value (sum of cost_price * stock)
        const totalValueQuery = `
      SELECT COALESCE(SUM(COALESCE(cost_price, price) * stock), 0) as value
      FROM products
      WHERE status = 'published'
    `;
        const totalValue = await database_1.default.query(totalValueQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            success: true,
            data: {
                totalProducts: parseInt(totalProducts[0]?.count || '0'),
                lowStockItems: parseInt(lowStock[0]?.count || '0'),
                outOfStockItems: parseInt(outOfStock[0]?.count || '0'),
                totalStockValue: parseFloat(totalValue[0]?.value || '0'),
            },
        });
    }
    catch (error) {
        console.error('[getInventoryStats] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch inventory statistics',
            message: error.message,
        });
    }
};
exports.getInventoryStats = getInventoryStats;
// Get inventory products list with stock information
const getInventoryProducts = async (req, res) => {
    try {
        const { filter = 'all', // 'all', 'low_stock', 'out_of_stock'
        search = '', sort = 'stock_asc', // 'stock_asc', 'stock_desc', 'name', 'sku'
        limit = 50, offset = 0, } = req.query;
        const conditions = ["p.status = 'published'"];
        const replacements = {
            limit: parseInt(limit),
            offset: parseInt(offset),
        };
        // Filter by stock status
        if (filter === 'low_stock') {
            conditions.push(`
        p.stock <= COALESCE(ss.low_stock_threshold, 10)
        AND p.stock > 0
      `);
        }
        else if (filter === 'out_of_stock') {
            conditions.push('p.stock <= 0');
        }
        // Search
        if (search) {
            conditions.push(`(p.name ILIKE :search OR p.sku ILIKE :search)`);
            replacements.search = `%${search}%`;
        }
        // Sort
        let orderBy = 'p.name ASC';
        switch (sort) {
            case 'stock_asc':
                orderBy = 'p.stock ASC';
                break;
            case 'stock_desc':
                orderBy = 'p.stock DESC';
                break;
            case 'name':
                orderBy = 'p.name ASC';
                break;
            case 'sku':
                orderBy = 'p.sku ASC';
                break;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.stock,
        p.price,
        p.cost_price,
        p.status,
        ss.low_stock_threshold,
        ss.reorder_point,
        CASE 
          WHEN p.stock <= 0 THEN 'out_of_stock'
          WHEN p.stock <= COALESCE(ss.low_stock_threshold, 10) THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM products p
      LEFT JOIN stock_settings ss ON ss.product_id = p.id AND ss.variant_id IS NULL
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT :limit OFFSET :offset
    `;
        const products = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get total count
        const countQuery = `
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN stock_settings ss ON ss.product_id = p.id AND ss.variant_id IS NULL
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countQuery, {
            replacements: { ...replacements, limit: undefined, offset: undefined },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const total = parseInt(countResult[0]?.count || '0');
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                limit: replacements.limit,
                offset: replacements.offset,
                hasMore: replacements.offset + replacements.limit < total,
            },
        });
    }
    catch (error) {
        console.error('[getInventoryProducts] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch inventory products',
            message: error.message,
        });
    }
};
exports.getInventoryProducts = getInventoryProducts;
// Get stock movements for a product
const getProductMovements = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantId, movementType, limit = 50, offset = 0 } = req.query;
        const movements = await stockService_1.StockService.getStockMovements(productId, variantId, movementType, parseInt(limit), parseInt(offset));
        res.json({
            success: true,
            data: movements,
        });
    }
    catch (error) {
        console.error('[getProductMovements] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock movements',
            message: error.message,
        });
    }
};
exports.getProductMovements = getProductMovements;
// Manual stock adjustment
const adjustStock = async (req, res) => {
    try {
        const { productId, variantId, quantity, notes } = req.body;
        const userId = req.user?.id;
        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: productId, quantity',
            });
        }
        if (quantity === 0) {
            return res.status(400).json({
                success: false,
                error: 'Quantity cannot be zero',
            });
        }
        const movement = await stockService_1.StockService.updateStock(productId, variantId || null, quantity, 'adjustment', 'adjustment', undefined, notes || 'Manual stock adjustment', userId);
        res.json({
            success: true,
            data: movement,
            message: `Stock ${quantity > 0 ? 'increased' : 'decreased'} by ${Math.abs(quantity)}`,
        });
    }
    catch (error) {
        console.error('[adjustStock] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to adjust stock',
            message: error.message,
        });
    }
};
exports.adjustStock = adjustStock;
// Bulk stock adjustment
const bulkAdjustStock = async (req, res) => {
    try {
        const { adjustments } = req.body; // Array of { productId, variantId?, quantity, notes? }
        const userId = req.user?.id;
        if (!Array.isArray(adjustments) || adjustments.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'adjustments must be a non-empty array',
            });
        }
        const results = [];
        const errors = [];
        for (const adj of adjustments) {
            try {
                const movement = await stockService_1.StockService.updateStock(adj.productId, adj.variantId || null, adj.quantity, 'adjustment', 'adjustment', undefined, adj.notes || 'Bulk stock adjustment', userId);
                results.push(movement);
            }
            catch (error) {
                errors.push({
                    productId: adj.productId,
                    variantId: adj.variantId,
                    error: error.message,
                });
            }
        }
        res.json({
            success: true,
            data: {
                successful: results.length,
                failed: errors.length,
                results,
                errors: errors.length > 0 ? errors : undefined,
            },
        });
    }
    catch (error) {
        console.error('[bulkAdjustStock] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to perform bulk stock adjustment',
            message: error.message,
        });
    }
};
exports.bulkAdjustStock = bulkAdjustStock;
// Get low stock alerts
const getLowStockAlerts = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.stock,
        ss.low_stock_threshold,
        ss.reorder_point,
        ss.reorder_quantity
      FROM products p
      LEFT JOIN stock_settings ss ON ss.product_id = p.id AND ss.variant_id IS NULL
      WHERE p.status = 'published'
      AND p.stock <= COALESCE(ss.low_stock_threshold, 10)
      ORDER BY p.stock ASC
      LIMIT :limit
    `;
        const alerts = await database_1.default.query(query, {
            replacements: { limit: parseInt(limit) },
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            success: true,
            data: alerts,
        });
    }
    catch (error) {
        console.error('[getLowStockAlerts] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch low stock alerts',
            message: error.message,
        });
    }
};
exports.getLowStockAlerts = getLowStockAlerts;
// Update stock settings for a product
const updateStockSettings = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantId, low_stock_threshold, reorder_point, reorder_quantity, track_inventory } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: productId',
            });
        }
        const settings = await stockService_1.StockService.updateStockSettings(productId, variantId || null, {
            low_stock_threshold,
            reorder_point,
            reorder_quantity,
            track_inventory,
        });
        res.json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        console.error('[updateStockSettings] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update stock settings',
            message: error.message,
        });
    }
};
exports.updateStockSettings = updateStockSettings;
// Get stock settings for a product
const getStockSettings = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantId } = req.query;
        const settings = await stockService_1.StockService.getStockSettings(productId, variantId || null);
        if (!settings) {
            // Return default settings if not found
            return res.json({
                success: true,
                data: {
                    product_id: productId,
                    variant_id: variantId || null,
                    low_stock_threshold: 10,
                    reorder_point: 5,
                    reorder_quantity: 20,
                    track_inventory: true,
                },
            });
        }
        res.json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        console.error('[getStockSettings] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock settings',
            message: error.message,
        });
    }
};
exports.getStockSettings = getStockSettings;
//# sourceMappingURL=inventoryController.js.map