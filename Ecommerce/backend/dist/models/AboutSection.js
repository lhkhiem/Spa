"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutSection = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class AboutSection extends sequelize_1.Model {
}
exports.AboutSection = AboutSection;
AboutSection.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    section_key: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: true,
    },
    button_text: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    button_link: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: true,
    },
    list_items: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    order_index: {
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
    tableName: 'about_sections',
    timestamps: true,
    underscored: true,
});
exports.default = AboutSection;
//# sourceMappingURL=AboutSection.js.map