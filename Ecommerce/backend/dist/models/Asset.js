"use strict";
// Model Asset (Media)
// - Quản lý files/media: ảnh, video...
// - Hỗ trợ nhiều provider (local, s3...)
// - Lưu thông tin kích thước và các phiên bản đã resize
// - Có quan hệ One-to-Many với Post (cover image)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Asset extends sequelize_1.Model {
}
Asset.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    provider: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 's3',
    },
    url: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: false,
    },
    cdn_url: {
        type: sequelize_1.DataTypes.STRING(1024),
    },
    width: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    height: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    format: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    sizes: {
        type: sequelize_1.DataTypes.JSONB,
    },
    folder_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'assets',
    timestamps: false,
});
exports.default = Asset;
//# sourceMappingURL=Asset.js.map