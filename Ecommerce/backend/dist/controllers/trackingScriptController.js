"use strict";
// Tracking Script Controller
// Handles CRUD operations for tracking scripts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTrackingScript = exports.deleteTrackingScript = exports.updateTrackingScript = exports.createTrackingScript = exports.getTrackingScriptById = exports.getActiveScripts = exports.getTrackingScripts = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get all tracking scripts (admin only)
const getTrackingScripts = async (req, res) => {
    try {
        const query = `
      SELECT * FROM tracking_scripts
      ORDER BY priority ASC, created_at ASC
    `;
        const result = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Parse pages JSONB to array
        const scripts = result.map((script) => ({
            ...script,
            pages: script.pages || ['all'],
        }));
        res.json({ success: true, data: scripts });
    }
    catch (error) {
        console.error('Failed to fetch tracking scripts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tracking scripts' });
    }
};
exports.getTrackingScripts = getTrackingScripts;
// Get active scripts for frontend (public endpoint)
const getActiveScripts = async (req, res) => {
    try {
        const { page = 'all' } = req.query;
        // Build query to check if page matches
        const query = `
      SELECT id, name, type, provider, position, script_code, load_strategy, priority
      FROM tracking_scripts
      WHERE is_active = TRUE
        AND (
          pages @> '["all"]'::jsonb 
          OR pages @> :page::jsonb
        )
      ORDER BY priority ASC, created_at ASC
    `;
        const result = await database_1.default.query(query, {
            replacements: { page: JSON.stringify([page]) },
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Failed to fetch active tracking scripts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch active tracking scripts' });
    }
};
exports.getActiveScripts = getActiveScripts;
// Get tracking script by ID
const getTrackingScriptById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT * FROM tracking_scripts WHERE id = :id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Tracking script not found' });
        }
        const script = result[0];
        script.pages = script.pages || ['all'];
        res.json({ success: true, data: script });
    }
    catch (error) {
        console.error('Failed to fetch tracking script:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tracking script' });
    }
};
exports.getTrackingScriptById = getTrackingScriptById;
// Create new tracking script
const createTrackingScript = async (req, res) => {
    try {
        const { name, type = 'custom', provider, position = 'head', script_code, is_active = true, load_strategy = 'sync', pages = ['all'], priority = 0, description, } = req.body;
        // Validation
        if (!name || !script_code) {
            return res.status(400).json({
                success: false,
                error: 'Name and script_code are required',
            });
        }
        if (position !== 'head' && position !== 'body') {
            return res.status(400).json({
                success: false,
                error: 'Position must be "head" or "body"',
            });
        }
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO tracking_scripts (
        id, name, type, provider, position, script_code, is_active,
        load_strategy, pages, priority, description
      )
      VALUES (
        :id, :name, :type, :provider, :position, :script_code, :is_active,
        :load_strategy, :pages::jsonb, :priority, :description
      )
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                name,
                type,
                provider: provider || null,
                position,
                script_code,
                is_active,
                load_strategy,
                pages: JSON.stringify(pages),
                priority,
                description: description || null,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        const script = result[0][0];
        script.pages = script.pages || ['all'];
        res.status(201).json({ success: true, data: script });
    }
    catch (error) {
        console.error('Failed to create tracking script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create tracking script',
            details: error.message,
        });
    }
};
exports.createTrackingScript = createTrackingScript;
// Update tracking script
const updateTrackingScript = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Build dynamic update query
        const updateFields = [];
        const replacements = { id };
        if (updateData.name !== undefined) {
            updateFields.push('name = :name');
            replacements.name = updateData.name;
        }
        if (updateData.type !== undefined) {
            updateFields.push('type = :type');
            replacements.type = updateData.type;
        }
        if (updateData.provider !== undefined) {
            updateFields.push('provider = :provider');
            replacements.provider = updateData.provider || null;
        }
        if (updateData.position !== undefined) {
            updateFields.push('position = :position');
            replacements.position = updateData.position;
        }
        if (updateData.script_code !== undefined) {
            updateFields.push('script_code = :script_code');
            replacements.script_code = updateData.script_code;
        }
        if (updateData.is_active !== undefined) {
            updateFields.push('is_active = :is_active');
            replacements.is_active = updateData.is_active;
        }
        if (updateData.load_strategy !== undefined) {
            updateFields.push('load_strategy = :load_strategy');
            replacements.load_strategy = updateData.load_strategy;
        }
        if (updateData.pages !== undefined) {
            updateFields.push('pages = :pages::jsonb');
            replacements.pages = JSON.stringify(updateData.pages);
        }
        if (updateData.priority !== undefined) {
            updateFields.push('priority = :priority');
            replacements.priority = updateData.priority;
        }
        if (updateData.description !== undefined) {
            updateFields.push('description = :description');
            replacements.description = updateData.description || null;
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update',
            });
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        const query = `
      UPDATE tracking_scripts
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tracking script not found',
            });
        }
        const script = result[0][0];
        script.pages = script.pages || ['all'];
        res.json({ success: true, data: script });
    }
    catch (error) {
        console.error('Failed to update tracking script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update tracking script',
            details: error.message,
        });
    }
};
exports.updateTrackingScript = updateTrackingScript;
// Delete tracking script
const deleteTrackingScript = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      DELETE FROM tracking_scripts
      WHERE id = :id
      RETURNING id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tracking script not found',
            });
        }
        res.json({
            success: true,
            message: 'Tracking script deleted successfully',
            id: result[0][0].id,
        });
    }
    catch (error) {
        console.error('Failed to delete tracking script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete tracking script',
        });
    }
};
exports.deleteTrackingScript = deleteTrackingScript;
// Toggle active status
const toggleTrackingScript = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      UPDATE tracking_scripts
      SET is_active = NOT is_active,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING id, name, is_active
    `;
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.UPDATE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Tracking script not found',
            });
        }
        res.json({ success: true, data: result[0][0] });
    }
    catch (error) {
        console.error('Failed to toggle tracking script:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle tracking script',
        });
    }
};
exports.toggleTrackingScript = toggleTrackingScript;
//# sourceMappingURL=trackingScriptController.js.map