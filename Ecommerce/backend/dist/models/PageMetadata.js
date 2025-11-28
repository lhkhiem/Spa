"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageMetadata = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class PageMetadata extends sequelize_1.Model {
}
exports.PageMetadata = PageMetadata;
PageMetadata.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    path: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    og_image: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    keywords: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
        allowNull: true,
    },
    enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    auto_generated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'page_metadata',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = PageMetadata;
//# sourceMappingURL=PageMetadata.js.map