"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopicsOrder = exports.deleteTopic = exports.updateTopic = exports.createTopic = exports.getTopicById = exports.getTopics = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const activityLogController_1 = require("./activityLogController");
// Get all topics
const getTopics = async (req, res) => {
    try {
        const { is_active } = req.query;
        let query = 'SELECT * FROM topics';
        const replacements = {};
        if (is_active !== undefined) {
            query += ' WHERE is_active = :is_active';
            replacements.is_active = is_active === 'true';
        }
        query += ' ORDER BY sort_order ASC, name ASC';
        const topics = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json(topics);
    }
    catch (error) {
        console.error('Failed to fetch topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
};
exports.getTopics = getTopics;
// Get topic by ID
const getTopicById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM topics WHERE id = :id';
        const topics = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (topics.length === 0) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.json(topics[0]);
    }
    catch (error) {
        console.error('Failed to fetch topic:', error);
        res.status(500).json({ error: 'Failed to fetch topic' });
    }
};
exports.getTopicById = getTopicById;
// Create topic
const createTopic = async (req, res) => {
    try {
        const { name, slug, description, color, icon, is_active, sort_order } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: 'name and slug are required' });
        }
        const query = `
      INSERT INTO topics (name, slug, description, color, icon, is_active, sort_order)
      VALUES (:name, :slug, :description, :color, :icon, :is_active, :sort_order)
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                name,
                slug,
                description: description || null,
                color: color || null,
                icon: icon || null,
                is_active: is_active !== undefined ? is_active : true,
                sort_order: sort_order || 0
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        const topic = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'create', 'topic', topic.id, name, `Created topic "${name}"`);
        res.status(201).json(topic);
    }
    catch (error) {
        console.error('Failed to create topic:', error);
        if (error.original?.constraint === 'topics_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create topic' });
    }
};
exports.createTopic = createTopic;
// Update topic
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, color, icon, is_active, sort_order } = req.body;
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
        if (icon !== undefined) {
            updateFields.push('icon = :icon');
            replacements.icon = icon;
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = :is_active');
            replacements.is_active = is_active;
        }
        if (sort_order !== undefined) {
            updateFields.push('sort_order = :sort_order');
            replacements.sort_order = sort_order;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        if (updateFields.length === 1) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        const query = `
      UPDATE topics
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        const updatedTopic = result[0][0];
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'update', 'topic', id, updatedTopic.name, `Updated topic "${updatedTopic.name}"`);
        res.json(updatedTopic);
    }
    catch (error) {
        console.error('Failed to update topic:', error);
        if (error.original?.constraint === 'topics_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update topic' });
    }
};
exports.updateTopic = updateTopic;
// Delete topic
const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        // Get topic name before deleting
        const getTopicQuery = 'SELECT name FROM topics WHERE id = :id';
        const topicResult = await database_1.default.query(getTopicQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        const topicName = topicResult[0]?.name || 'Unknown';
        const query = 'DELETE FROM topics WHERE id = :id RETURNING *';
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'topic', id, topicName, `Deleted topic "${topicName}"`);
        res.json({ message: 'Topic deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete topic:', error);
        res.status(500).json({ error: 'Failed to delete topic' });
    }
};
exports.deleteTopic = deleteTopic;
// Bulk update topics order
const updateTopicsOrder = async (req, res) => {
    try {
        const { topics } = req.body; // Array of { id, sort_order }
        if (!Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ error: 'topics array is required' });
        }
        await database_1.default.transaction(async (transaction) => {
            for (const topic of topics) {
                await database_1.default.query('UPDATE topics SET sort_order = :sort_order WHERE id = :id', {
                    replacements: {
                        id: topic.id,
                        sort_order: topic.sort_order
                    },
                    type: sequelize_1.QueryTypes.UPDATE,
                    transaction
                });
            }
        });
        res.json({ message: 'Topics order updated successfully' });
    }
    catch (error) {
        console.error('Failed to update topics order:', error);
        res.status(500).json({ error: 'Failed to update topics order' });
    }
};
exports.updateTopicsOrder = updateTopicsOrder;
//# sourceMappingURL=topicController.js.map