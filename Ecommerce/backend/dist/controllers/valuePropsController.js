"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValueProp = exports.updateValueProp = exports.createValueProp = exports.getValueProps = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get value props
const getValueProps = async (req, res) => {
    try {
        const { active_only } = req.query;
        const whereClause = active_only === 'true' ? 'WHERE is_active = TRUE' : '';
        const query = `
      SELECT * FROM value_props
      ${whereClause}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const valueProps = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ success: true, data: valueProps });
    }
    catch (error) {
        console.error('Failed to fetch value props:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch value props' });
    }
};
exports.getValueProps = getValueProps;
// Create value prop
const createValueProp = async (req, res) => {
    try {
        const { title, subtitle, icon_key, icon_color, icon_background, sort_order, is_active } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, error: 'Title is required' });
        }
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO value_props (
        id, title, subtitle, icon_key, icon_color, icon_background, sort_order, is_active
      )
      VALUES (
        :id, :title, :subtitle, :icon_key, :icon_color, :icon_background, :sort_order, :is_active
      )
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                title,
                subtitle: subtitle || null,
                icon_key: icon_key || null,
                icon_color: icon_color || null,
                icon_background: icon_background || null,
                sort_order: sort_order || 0,
                is_active: is_active !== undefined ? is_active : true,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        res.status(201).json({ success: true, data: result[0][0] });
    }
    catch (error) {
        console.error('Failed to create value prop:', error);
        res.status(500).json({ success: false, error: 'Failed to create value prop' });
    }
};
exports.createValueProp = createValueProp;
// Update value prop
const updateValueProp = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, icon_key, icon_color, icon_background, sort_order, is_active } = req.body;
        const query = `
      UPDATE value_props
      SET
        title = COALESCE(:title, title),
        subtitle = :subtitle,
        icon_key = :icon_key,
        icon_color = :icon_color,
        icon_background = :icon_background,
        sort_order = COALESCE(:sort_order, sort_order),
        is_active = :is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                title,
                subtitle: subtitle || null,
                icon_key: icon_key || null,
                icon_color: icon_color || null,
                icon_background: icon_background || null,
                sort_order,
                is_active,
            },
            type: sequelize_1.QueryTypes.UPDATE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ success: false, error: 'Value prop not found' });
        }
        res.json({ success: true, data: result[0][0] });
    }
    catch (error) {
        console.error('Failed to update value prop:', error);
        res.status(500).json({ success: false, error: 'Failed to update value prop' });
    }
};
exports.updateValueProp = updateValueProp;
// Delete value prop
const deleteValueProp = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM value_props WHERE id = :id RETURNING *';
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ success: false, error: 'Value prop not found' });
        }
        res.json({ success: true, message: 'Value prop deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete value prop:', error);
        res.status(500).json({ success: false, error: 'Failed to delete value prop' });
    }
};
exports.deleteValueProp = deleteValueProp;
//# sourceMappingURL=valuePropsController.js.map