"use strict";
// Cấu hình kết nối PostgreSQL qua Sequelize
// - Đọc thông tin kết nối từ env vars
// - Fallback values cho development
// - Logging SQL chỉ trong môi trường development
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'spa_cms_user',
    password: process.env.DB_PASSWORD || 'spa_cms_password',
    database: process.env.DB_NAME || 'spa_cms_db',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map