"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationResource = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class EducationResource extends sequelize_1.Model {
}
exports.EducationResource = EducationResource;
EducationResource.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: false,
    },
    link_url: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    link_text: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Learn More',
    },
    duration: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    ceus: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    level: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    resource_type: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'course',
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
    tableName: 'education_resources',
    timestamps: true,
    underscored: true,
});
exports.default = EducationResource;
//# sourceMappingURL=EducationResource.js.map