"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class NewsletterSubscription extends sequelize_1.Model {
}
NewsletterSubscription.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'unsubscribed', 'bounced'),
        allowNull: false,
        defaultValue: 'active',
    },
    subscribed_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    unsubscribed_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    source: {
        type: sequelize_1.DataTypes.STRING(255),
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
    tableName: 'newsletter_subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = NewsletterSubscription;
//# sourceMappingURL=NewsletterSubscription.js.map