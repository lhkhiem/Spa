"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ConsultationSubmission extends sequelize_1.Model {
}
ConsultationSubmission.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    province: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'new',
    },
    assigned_to: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    replied_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    replied_by: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    reply_message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    ip_address: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true,
    },
    user_agent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'consultation_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = ConsultationSubmission;
//# sourceMappingURL=ConsultationSubmission.js.map