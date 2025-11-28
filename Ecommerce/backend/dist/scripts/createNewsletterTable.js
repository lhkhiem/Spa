"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function createNewsletterTable() {
    try {
        await database_1.default.authenticate();
        console.log('✅ Database connected');
        // Check if table already exists
        const [tableExists] = await database_1.default.query(`SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name = 'newsletter_subscriptions'`, { type: sequelize_1.QueryTypes.SELECT });
        if (tableExists) {
            console.log('⚠️  Table newsletter_subscriptions already exists. Skipping creation.');
            return;
        }
        console.log('📝 Creating newsletter_subscriptions table...');
        const migrationSqlPath = path_1.default.join(__dirname, '../migrations/023_create_newsletter_subscriptions.sql');
        const migrationSql = fs_1.default.readFileSync(migrationSqlPath, 'utf8');
        await database_1.default.query(migrationSql);
        console.log('✅ Table newsletter_subscriptions created successfully');
        console.log('✅ Indexes created successfully');
    }
    catch (error) {
        console.error('❌ Failed to create newsletter_subscriptions table:', error);
        process.exitCode = 1;
    }
    finally {
        await database_1.default.close();
    }
}
createNewsletterTable();
//# sourceMappingURL=createNewsletterTable.js.map