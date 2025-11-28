"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagById = exports.getTags = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const activityLogController_1 = require("./activityLogController");
// Get all tags
const getTags = async (req, res) => {
    try {
        const { is_active, sort } = req.query;
        let query = 'SELECT * FROM tags';
        const replacements = {};
        if (is_active !== undefined) {
            query += ' WHERE is_active = :is_active';
            replacements.is_active = is_active === 'true';
        }
        // Sort by post_count or name
        if (sort === 'popular') {
            query += ' ORDER BY post_count DESC, name ASC';
        }
        else {
            query += ' ORDER BY name ASC';
        }
        const tags = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json(tags);
    }
    catch (error) {
        console.error('Failed to fetch tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};
exports.getTags = getTags;
// Get tag by ID
const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM tags WHERE id = :id';
        const tags = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (tags.length === 0) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tags[0]);
    }
    catch (error) {
        console.error('Failed to fetch tag:', error);
        res.status(500).json({ error: 'Failed to fetch tag' });
    }
};
exports.getTagById = getTagById;
// Create tag
const createTag = async (req, res) => {
    try {
        const { name, slug, description, color, is_active } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: 'name and slug are required' });
        }
        const query = `
      INSERT INTO tags (name, slug, description, color, is_active)
      VALUES (:name, :slug, :description, :color, :is_active)
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                name,
                slug,
                description: description || null,
                color: color || null,
                is_active: is_active !== undefined ? is_active : true
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        const tag = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'create', 'tag', tag.id, name, `Created tag "${name}"`);
        res.status(201).json(tag);
    }
    catch (error) {
        console.error('Failed to create tag:', error);
        if (error.original?.constraint === 'tags_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create tag' });
    }
};
exports.createTag = createTag;
// Update tag
const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, color, is_active } = req.body;
        const updateFields = [];
        const replacements = { id };
        if (name !== undefined) {
            updateFields.push('name = :name');
            replacements.name = name;
        }
        if (slug !== undefined) {
            updateFields.push('slug = :slug');
            replacements.slug = slug;
        }
        if (description !== undefined) {
            updateFields.push('description = :description');
            replacements.description = description;
        }
        if (color !== undefined) {
            updateFields.push('color = :color');
            replacements.color = color;
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = :is_active');
            replacements.is_active = is_active;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        if (updateFields.length === 1) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        const query = `
      UPDATE tags
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        const updatedTag = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'update', 'tag', id, updatedTag.name, `Updated tag "${updatedTag.name}"`);
        res.json(updatedTag);
    }
    catch (error) {
        console.error('Failed to update tag:', error);
        if (error.original?.constraint === 'tags_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update tag' });
    }
};
exports.updateTag = updateTag;
// Delete tag
const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        // Get tag name before deleting
        const getTagQuery = 'SELECT name FROM tags WHERE id = :id';
        const tagResult = await database_1.default.query(getTagQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        const tagName = tagResult[0]?.name || 'Unknown';
        const query = 'DELETE FROM tags WHERE id = :id RETURNING *';
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'tag', id, tagName, `Deleted tag "${tagName}"`);
        res.json({ message: 'Tag deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete tag:', error);
        res.status(500).json({ error: 'Failed to delete tag' });
    }
};
exports.deleteTag = deleteTag;
//# sourceMappingURL=tagController.js.map