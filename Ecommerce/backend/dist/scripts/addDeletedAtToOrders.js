"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
async function addDeletedAtToOrders() {
    try {
        await database_1.default.authenticate();
        console.log('✅ Database connected');
        // Check if column already exists
        const [columnExists] = await database_1.default.query(`SELECT column_name 
       FROM information_schema.columns 
       WHERE table_schema = 'public' 
       AND table_name = 'orders' 
       AND column_name = 'deleted_at'`, { type: sequelize_1.QueryTypes.SELECT });
        if (columnExists) {
            console.log('⚠️  Column deleted_at already exists. Skipping.');
            return;
        }
        console.log('📝 Adding deleted_at column to orders table...');
        // Add column
        await database_1.default.query(`
      ALTER TABLE orders 
      ADD COLUMN deleted_at TIMESTAMP NULL;
    `);
        // Create index
        await database_1.default.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at) WHERE deleted_at IS NULL;
    `);
        console.log('✅ Column deleted_at added successfully');
        console.log('✅ Index created successfully');
    }
    catch (error) {
        console.error('❌ Failed to add deleted_at column:', error);
        process.exitCode = 1;
    }
    finally {
        await database_1.default.close();
    }
}
addDeletedAtToOrders();
//# sourceMappingURL=addDeletedAtToOrders.js.map