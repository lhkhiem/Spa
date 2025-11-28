"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueProp = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ValueProp extends sequelize_1.Model {
}
exports.ValueProp = ValueProp;
ValueProp.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    subtitle: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    icon_key: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    icon_color: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    icon_background: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    sort_order: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
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
    tableName: 'value_props',
    timestamps: true,
    underscored: true,
});
exports.default = ValueProp;
//# sourceMappingURL=ValueProp.js.map