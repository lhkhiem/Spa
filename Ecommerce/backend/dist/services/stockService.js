"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
class StockService {
    /**
     * Get current stock for a product or variant
     */
    static async getStock(productId, variantId) {
        if (variantId) {
            const result = await database_1.default.query(`SELECT stock FROM product_variants WHERE id = :variantId`, {
                replacements: { variantId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return result.length > 0 ? result[0].stock : 0;
        }
        else {
            const result = await database_1.default.query(`SELECT stock FROM products WHERE id = :productId`, {
                replacements: { productId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return result.length > 0 ? result[0].stock : 0;
        }
    }
    /**
     * Update stock with movement tracking
     * @param quantity - positive for increase, negative for decrease
     */
    static async updateStock(productId, variantId, quantity, movementType, referenceType, referenceId, notes, userId) {
        const transaction = await database_1.default.transaction();
        try {
            // Get current stock
            const stockQuery = variantId
                ? `SELECT stock FROM product_variants WHERE id = :id`
                : `SELECT stock FROM products WHERE id = :id`;
            const currentStock = await database_1.default.query(stockQuery, {
                replacements: { id: variantId || productId },
                type: sequelize_1.QueryTypes.SELECT,
                transaction,
            });
            if (!currentStock || currentStock.length === 0) {
                throw new Error(`Product or variant not found: ${variantId || productId}`);
            }
            const previousStock = currentStock[0].stock;
            const newStock = previousStock + quantity;
            if (newStock < 0) {
                throw new Error(`Insufficient stock. Current: ${previousStock}, Requested change: ${quantity}`);
            }
            // Update stock
            const updateQuery = variantId
                ? `UPDATE product_variants SET stock = :stock, updated_at = CURRENT_TIMESTAMP WHERE id = :id`
                : `UPDATE products SET stock = :stock, updated_at = CURRENT_TIMESTAMP WHERE id = :id`;
            await database_1.default.query(updateQuery, {
                replacements: { stock: newStock, id: variantId || productId },
                type: sequelize_1.QueryTypes.UPDATE,
                transaction,
            });
            // Record movement
            const movementId = (0, uuid_1.v4)();
            const movementQuery = `
        INSERT INTO stock_movements (
          id, product_id, variant_id, movement_type, quantity,
          previous_stock, new_stock, reference_type, reference_id,
          notes, created_by, created_at
        ) VALUES (
          :id, :product_id, :variant_id, :movement_type, :quantity,
          :previous_stock, :new_stock, :reference_type, :reference_id,
          :notes, :created_by, CURRENT_TIMESTAMP
        )
      `;
            await database_1.default.query(movementQuery, {
                replacements: {
                    id: movementId,
                    product_id: productId,
                    variant_id: variantId,
                    movement_type: movementType,
                    quantity,
                    previous_stock: previousStock,
                    new_stock: newStock,
                    reference_type: referenceType || null,
                    reference_id: referenceId || null,
                    notes: notes || null,
                    created_by: userId || null,
                },
                type: sequelize_1.QueryTypes.INSERT,
                transaction,
            });
            await transaction.commit();
            // Return the created movement
            const movement = await database_1.default.query(`SELECT * FROM stock_movements WHERE id = :id`, {
                replacements: { id: movementId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return movement[0];
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    /**
     * Get stock movements history
     */
    static async getStockMovements(productId, variantId, movementType, limit = 50, offset = 0) {
        const conditions = [];
        const replacements = { limit, offset };
        if (productId) {
            conditions.push('product_id = :product_id');
            replacements.product_id = productId;
        }
        if (variantId) {
            conditions.push('variant_id = :variant_id');
            replacements.variant_id = variantId;
        }
        else if (variantId === null) {
            conditions.push('variant_id IS NULL');
        }
        if (movementType) {
            conditions.push('movement_type = :movement_type');
            replacements.movement_type = movementType;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT * FROM stock_movements
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT :limit OFFSET :offset
    `;
        return (await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        }));
    }
    /**
     * Check if stock is low based on settings
     */
    static async checkLowStock(productId, variantId) {
        const stock = await this.getStock(productId, variantId);
        // Get stock settings
        const settingsQuery = `
      SELECT low_stock_threshold 
      FROM stock_settings 
      WHERE product_id = :product_id 
      AND (variant_id = :variant_id OR (variant_id IS NULL AND :variant_id IS NULL))
    `;
        const settings = await database_1.default.query(settingsQuery, {
            replacements: {
                product_id: productId,
                variant_id: variantId || null,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const threshold = settings.length > 0 ? settings[0].low_stock_threshold : 10; // default
        return stock <= threshold;
    }
    /**
     * Get stock settings for a product/variant
     */
    static async getStockSettings(productId, variantId) {
        const query = `
      SELECT * FROM stock_settings
      WHERE product_id = :product_id
      AND (variant_id = :variant_id OR (variant_id IS NULL AND :variant_id IS NULL))
    `;
        const settings = await database_1.default.query(query, {
            replacements: {
                product_id: productId,
                variant_id: variantId || null,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return settings.length > 0 ? settings[0] : null;
    }
    /**
     * Update or create stock settings
     */
    static async updateStockSettings(productId, variantId, settings) {
        const existing = await this.getStockSettings(productId, variantId);
        if (existing) {
            // Update existing
            const updates = [];
            const replacements = {
                product_id: productId,
                variant_id: variantId || null,
            };
            if (settings.low_stock_threshold !== undefined) {
                updates.push('low_stock_threshold = :low_stock_threshold');
                replacements.low_stock_threshold = settings.low_stock_threshold;
            }
            if (settings.reorder_point !== undefined) {
                updates.push('reorder_point = :reorder_point');
                replacements.reorder_point = settings.reorder_point;
            }
            if (settings.reorder_quantity !== undefined) {
                updates.push('reorder_quantity = :reorder_quantity');
                replacements.reorder_quantity = settings.reorder_quantity;
            }
            if (settings.track_inventory !== undefined) {
                updates.push('track_inventory = :track_inventory');
                replacements.track_inventory = settings.track_inventory;
            }
            updates.push('updated_at = CURRENT_TIMESTAMP');
            const updateQuery = `
        UPDATE stock_settings
        SET ${updates.join(', ')}
        WHERE product_id = :product_id
        AND (variant_id = :variant_id OR (variant_id IS NULL AND :variant_id IS NULL))
        RETURNING *
      `;
            const updated = await database_1.default.query(updateQuery, {
                replacements,
                type: sequelize_1.QueryTypes.SELECT,
            });
            return updated[0];
        }
        else {
            // Create new
            const insertQuery = `
        INSERT INTO stock_settings (
          id, product_id, variant_id, low_stock_threshold, reorder_point,
          reorder_quantity, track_inventory, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), :product_id, :variant_id, :low_stock_threshold,
          :reorder_point, :reorder_quantity, :track_inventory, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *
      `;
            const created = await database_1.default.query(insertQuery, {
                replacements: {
                    product_id: productId,
                    variant_id: variantId || null,
                    low_stock_threshold: settings.low_stock_threshold ?? 10,
                    reorder_point: settings.reorder_point ?? 5,
                    reorder_quantity: settings.reorder_quantity ?? 20,
                    track_inventory: settings.track_inventory ?? true,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return created[0];
        }
    }
}
exports.StockService = StockService;
//# sourceMappingURL=stockService.js.map