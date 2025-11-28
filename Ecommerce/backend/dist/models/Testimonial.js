"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Testimonial extends sequelize_1.Model {
}
exports.Testimonial = Testimonial;
Testimonial.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    customer_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    customer_title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    customer_initials: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    testimonial_text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    is_featured: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    tableName: 'testimonials',
    timestamps: true,
    underscored: true,
});
exports.default = Testimonial;
//# sourceMappingURL=Testimonial.js.map