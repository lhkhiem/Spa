"use strict";
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
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Load .env
dotenv.config({ path: path_1.default.join(__dirname, '../../.env') });
async function fixZaloPayOrder() {
    const appTransId = process.argv[2]; // Lấy từ command line
    if (!appTransId) {
        console.error('❌ Usage: ts-node fixZaloPayOrder.ts <app_trans_id>');
        console.error('Example: ts-node fixZaloPayOrder.ts "251129_ORDMIIH5E5273P61"');
        process.exit(1);
    }
    console.log('🔧 Fixing ZaloPay order...');
    console.log('App Trans ID:', appTransId);
    console.log('');
    try {
        // Find order
        const orderQuery = `
      SELECT 
        id, order_number, payment_status, status, total,
        zp_app_trans_id, zp_trans_id
      FROM orders
      WHERE zp_app_trans_id = :app_trans_id
      LIMIT 1
    `;
        const orders = await database_1.default.query(orderQuery, {
            replacements: { app_trans_id: appTransId },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!orders || orders.length === 0) {
            console.error('❌ Order not found with app_trans_id:', appTransId);
            process.exit(1);
        }
        const order = orders[0];
        console.log('📦 Found order:');
        console.log('  ID:', order.id);
        console.log('  Order Number:', order.order_number);
        console.log('  Current Payment Status:', order.payment_status);
        console.log('  Current Status:', order.status);
        console.log('  Total:', order.total);
        console.log('  ZP Trans ID:', order.zp_trans_id || 'N/A');
        console.log('');
        // Update to paid
        const updateQuery = `
      UPDATE orders
      SET payment_status = 'paid',
          status = CASE
            WHEN status = 'pending' THEN 'processing'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :order_id
    `;
        const updateResult = await database_1.default.query(updateQuery, {
            replacements: { order_id: order.id },
            type: sequelize_1.QueryTypes.UPDATE
        });
        const rowsAffected = updateResult[1] || 0;
        if (rowsAffected > 0) {
            console.log('✅ Order updated successfully!');
            console.log('  Payment Status: failed → paid');
            console.log('  Status:', order.status === 'pending' ? 'pending → processing' : 'unchanged');
            console.log('  Rows affected:', rowsAffected);
        }
        else {
            console.log('⚠️  No rows updated (order might already be paid)');
        }
        // Verify update
        const verifyQuery = `
      SELECT payment_status, status
      FROM orders
      WHERE id = :order_id
    `;
        const verifyResult = await database_1.default.query(verifyQuery, {
            replacements: { order_id: order.id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (verifyResult && verifyResult.length > 0) {
            console.log('');
            console.log('📋 Updated order status:');
            console.log('  Payment Status:', verifyResult[0].payment_status);
            console.log('  Status:', verifyResult[0].status);
        }
        await database_1.default.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        await database_1.default.close();
        process.exit(1);
    }
}
fixZaloPayOrder();
//# sourceMappingURL=fixZaloPayOrder.js.map