"use strict";
// Model bài viết (Post)
// - Thuộc tính: title, slug, excerpt, content (JSONB), cover_asset, author...
// - Quan hệ:
//   + Belongs to User (author)
//   + Belongs to Asset (cover)
//   + Many-to-many với Topic và Tag (định nghĩa ở model tương ứng)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Asset_1 = __importDefault(require("./Asset"));
class Post extends sequelize_1.Model {
}
Post.init({
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
    excerpt: {
        type: sequelize_1.DataTypes.TEXT,
    },
    content: {
        type: sequelize_1.DataTypes.JSONB,
    },
    cover_asset_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: Asset_1.default,
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'draft',
    },
    author_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: User_1.default,
            key: 'id',
        },
    },
    published_at: {
        type: sequelize_1.DataTypes.DATE,
    },
    seo: {
        type: sequelize_1.DataTypes.JSONB,
    },
    header_code: {
        type: sequelize_1.DataTypes.TEXT,
    },
    is_featured: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    read_time: {
        type: sequelize_1.DataTypes.STRING(50),
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
    tableName: 'posts',
    timestamps: false,
});
exports.default = Post;
//# sourceMappingURL=Post.js.map