"use strict";
// Address model
// Customer shipping and billing addresses
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Address extends sequelize_1.Model {
}
Address.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    company: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    address_line1: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    address_line2: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    postal_code: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'United States',
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    is_default: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(20),
        defaultValue: 'both',
        validate: {
            isIn: [['shipping', 'billing', 'both']],
        },
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
    tableName: 'addresses',
    timestamps: false,
});
exports.default = Address;
//# sourceMappingURL=Address.js.map