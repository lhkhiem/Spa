"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
async function checkTables() {
    try {
        const rows = await database_1.default.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('education_resources','value_props','testimonials')", { type: sequelize_1.QueryTypes.SELECT });
        console.log(rows);
    }
    catch (error) {
        console.error('Failed to check tables:', error);
    }
    finally {
        await database_1.default.close();
    }
}
checkTables();
//# sourceMappingURL=checkTables.js.map