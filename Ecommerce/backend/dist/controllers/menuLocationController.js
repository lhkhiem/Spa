"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuLocation = exports.updateMenuLocation = exports.createMenuLocation = exports.getMenuLocationById = exports.getMenuLocations = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const uuid_1 = require("uuid");
// Get all menu locations
const getMenuLocations = async (req, res) => {
    try {
        const query = `
      SELECT 
        ml.*,
        COUNT(mi.id) as item_count
      FROM menu_locations ml
      LEFT JOIN menu_items mi ON ml.id = mi.menu_location_id
      GROUP BY ml.id
      ORDER BY ml.created_at DESC
    `;
        const locations = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({ data: locations });
    }
    catch (error) {
        console.error('Failed to fetch menu locations:', error);
        res.status(500).json({ error: 'Failed to fetch menu locations' });
    }
};
exports.getMenuLocations = getMenuLocations;
// Get single menu location
const getMenuLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT * FROM menu_locations WHERE id = :id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Menu location not found' });
        }
        res.json(result[0]);
    }
    catch (error) {
        console.error('Failed to fetch menu location:', error);
        res.status(500).json({ error: 'Failed to fetch menu location' });
    }
};
exports.getMenuLocationById = getMenuLocationById;
// Create menu location
const createMenuLocation = async (req, res) => {
    try {
        const { name, slug, description, is_active } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and slug are required' });
        }
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO menu_locations (id, name, slug, description, is_active)
      VALUES (:id, :name, :slug, :description, :is_active)
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                name,
                slug,
                description: description || null,
                is_active: is_active !== undefined ? is_active : true
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(201).json(result[0][0]);
    }
    catch (error) {
        console.error('Failed to create menu location:', error);
        if (error.original?.constraint === 'menu_locations_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create menu location' });
    }
};
exports.createMenuLocation = createMenuLocation;
// Update menu location
const updateMenuLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, is_active } = req.body;
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
        if (is_active !== undefined) {
            updateFields.push('is_active = :is_active');
            replacements.is_active = is_active;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        if (updateFields.length === 1) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        const query = `
      UPDATE menu_locations
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Menu location not found' });
        }
        res.json(result[0][0]);
    }
    catch (error) {
        console.error('Failed to update menu location:', error);
        if (error.original?.constraint === 'menu_locations_slug_key') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update menu location' });
    }
};
exports.updateMenuLocation = updateMenuLocation;
// Delete menu location
const deleteMenuLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query('DELETE FROM menu_locations WHERE id = :id RETURNING *', {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ error: 'Menu location not found' });
        }
        res.json({ message: 'Menu location deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete menu location:', error);
        res.status(500).json({ error: 'Failed to delete menu location' });
    }
};
exports.deleteMenuLocation = deleteMenuLocation;
//# sourceMappingURL=menuLocationController.js.map