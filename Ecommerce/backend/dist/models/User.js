"use strict";
// Model User 
// - Lưu thông tin người dùng: email, password hash, name...
// - Status: active/inactive
// - Có quan hệ One-to-Many với Post (author)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'active',
    },
    role: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'admin',
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
    tableName: 'users',
    timestamps: false,
});
exports.default = User;
//# sourceMappingURL=User.js.map