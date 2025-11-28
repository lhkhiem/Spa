"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class MenuItem extends sequelize_1.Model {
}
MenuItem.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    menu_location_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    parent_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    icon: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'custom',
    },
    entity_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    target: {
        type: sequelize_1.DataTypes.STRING(20),
        defaultValue: '_self',
    },
    rel: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    css_classes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    sort_order: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
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
    tableName: 'menu_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = MenuItem;
//# sourceMappingURL=MenuItem.js.map