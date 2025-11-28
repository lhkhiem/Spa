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
async function findZaloPayOrder() {
    const searchTerm = process.argv[2]; // app_trans_id hoặc order_number
    if (!searchTerm) {
        console.error('❌ Usage: ts-node findZaloPayOrder.ts <app_trans_id_or_order_number>');
        console.error('Example: ts-node findZaloPayOrder.ts "251129_ORDMIIH5E5273P61"');
        console.error('Example: ts-node findZaloPayOrder.ts "ORD-MIIH5E52-73P61"');
        process.exit(1);
    }
    console.log('🔍 Searching for ZaloPay order...');
    console.log('Search term:', searchTerm);
    console.log('');
    try {
        // Search by app_trans_id or order_number
        const searchQuery = `
      SELECT 
        id, order_number, payment_status, status, total,
        zp_app_trans_id, zp_trans_id, payment_method,
        customer_name, customer_email, customer_phone,
        created_at, updated_at
      FROM orders
      WHERE zp_app_trans_id LIKE :search
         OR order_number LIKE :search
         OR order_number LIKE :search2
      ORDER BY created_at DESC
      LIMIT 10
    `;
        const orders = await database_1.default.query(searchQuery, {
            replacements: {
                search: `%${searchTerm}%`,
                search2: `%${searchTerm.replace(/_/g, '-')}%`
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!orders || orders.length === 0) {
            console.log('❌ No orders found');
            console.log('');
            console.log('📋 Recent ZaloPay orders (last 10):');
            const recentQuery = `
        SELECT 
          id, order_number, payment_status, status, total,
          zp_app_trans_id, payment_method, created_at
        FROM orders
        WHERE payment_method = 'zalopay'
        ORDER BY created_at DESC
        LIMIT 10
      `;
            const recentOrders = await database_1.default.query(recentQuery, {
                type: sequelize_1.QueryTypes.SELECT
            });
            if (recentOrders && recentOrders.length > 0) {
                recentOrders.forEach((o, i) => {
                    console.log(`\n${i + 1}. Order: ${o.order_number}`);
                    console.log(`   ID: ${o.id}`);
                    console.log(`   App Trans ID: ${o.zp_app_trans_id || 'N/A'}`);
                    console.log(`   Payment Status: ${o.payment_status}`);
                    console.log(`   Status: ${o.status}`);
                    console.log(`   Total: ${o.total} ₫`);
                    console.log(`   Created: ${o.created_at}`);
                });
            }
            else {
                console.log('   No ZaloPay orders found');
            }
            await database_1.default.close();
            process.exit(1);
        }
        console.log(`✅ Found ${orders.length} order(s):\n`);
        orders.forEach((order, i) => {
            console.log(`${i + 1}. Order Details:`);
            console.log(`   ID: ${order.id}`);
            console.log(`   Order Number: ${order.order_number}`);
            console.log(`   App Trans ID: ${order.zp_app_trans_id || 'N/A'}`);
            console.log(`   Payment Status: ${order.payment_status}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Total: ${order.total} ₫`);
            console.log(`   Payment Method: ${order.payment_method}`);
            console.log(`   Customer: ${order.customer_name} (${order.customer_email})`);
            console.log(`   Created: ${order.created_at}`);
            console.log(`   Updated: ${order.updated_at}`);
            console.log('');
        });
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
findZaloPayOrder();
//# sourceMappingURL=findZaloPayOrder.js.map