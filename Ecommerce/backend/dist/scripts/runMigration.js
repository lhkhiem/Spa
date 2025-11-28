"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
async function runMigration(migrationFile) {
    try {
        const sqlPath = path_1.default.join(__dirname, '../migrations', migrationFile);
        const sql = fs_1.default.readFileSync(sqlPath, 'utf8');
        console.log(`Running migration: ${migrationFile}...`);
        await database_1.default.query(sql);
        console.log(`✅ Migration completed: ${migrationFile}`);
    }
    catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`, error);
        throw error;
    }
    finally {
        await database_1.default.close();
    }
}
const migrationFile = process.argv[2] || '011_topics_tags.sql';
runMigration(migrationFile);
//# sourceMappingURL=runMigration.js.map