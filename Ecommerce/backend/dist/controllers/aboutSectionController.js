"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAboutSection = exports.updateAboutSection = exports.createAboutSection = exports.getAboutSectionByKey = exports.getAboutSectionById = exports.getAllAboutSections = void 0;
const AboutSection_1 = __importDefault(require("../models/AboutSection"));
const sequelize_1 = require("sequelize");
// Get all about sections
const getAllAboutSections = async (req, res) => {
    try {
        const { active_only } = req.query;
        const where = {};
        if (active_only === 'true') {
            where.is_active = true;
        }
        const sections = await AboutSection_1.default.findAll({
            where,
            order: [['order_index', 'ASC'], ['created_at', 'DESC']],
        });
        res.json({ data: sections });
    }
    catch (error) {
        console.error('[getAllAboutSections] Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch about sections',
            message: error.message
        });
    }
};
exports.getAllAboutSections = getAllAboutSections;
// Get about section by ID
const getAboutSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await AboutSection_1.default.findByPk(id);
        if (!section) {
            return res.status(404).json({ error: 'About section not found' });
        }
        res.json(section);
    }
    catch (error) {
        console.error('[getAboutSectionById] Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch about section',
            message: error.message
        });
    }
};
exports.getAboutSectionById = getAboutSectionById;
// Get about section by key
const getAboutSectionByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const section = await AboutSection_1.default.findOne({
            where: { section_key: key, is_active: true },
        });
        if (!section) {
            return res.status(404).json({ error: 'About section not found' });
        }
        res.json(section);
    }
    catch (error) {
        console.error('[getAboutSectionByKey] Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch about section',
            message: error.message
        });
    }
};
exports.getAboutSectionByKey = getAboutSectionByKey;
// Create about section
const createAboutSection = async (req, res) => {
    try {
        const { section_key, title, content, image_url, button_text, button_link, list_items, order_index, is_active } = req.body;
        if (!section_key || section_key.trim() === '') {
            return res.status(400).json({ error: 'Section key is required' });
        }
        // Check if section_key already exists
        const existing = await AboutSection_1.default.findOne({
            where: { section_key: section_key.trim() },
        });
        if (existing) {
            return res.status(400).json({ error: 'Section key already exists' });
        }
        const section = await AboutSection_1.default.create({
            section_key: section_key.trim(),
            title: title && title.trim() ? title.trim() : null,
            content: content && content.trim() ? content.trim() : null,
            image_url: image_url && image_url.trim() ? image_url.trim() : null,
            button_text: button_text && button_text.trim() ? button_text.trim() : null,
            button_link: button_link && button_link.trim() ? button_link.trim() : null,
            list_items: list_items || null,
            order_index: order_index !== undefined ? order_index : 0,
            is_active: is_active !== undefined ? is_active : true,
        });
        res.status(201).json(section);
    }
    catch (error) {
        console.error('[createAboutSection] Error:', error.message);
        res.status(500).json({
            error: 'Failed to create about section',
            message: error.message
        });
    }
};
exports.createAboutSection = createAboutSection;
// Update about section
const updateAboutSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { section_key, title, content, image_url, button_text, button_link, list_items, order_index, is_active } = req.body;
        const section = await AboutSection_1.default.findByPk(id);
        if (!section) {
            return res.status(404).json({ error: 'About section not found' });
        }
        // If section_key is being updated, check for duplicates
        if (section_key && section_key !== section.section_key) {
            const existing = await AboutSection_1.default.findOne({
                where: {
                    section_key: section_key.trim(),
                    id: { [sequelize_1.Op.ne]: id },
                },
            });
            if (existing) {
                return res.status(400).json({ error: 'Section key already exists' });
            }
        }
        const updateData = {};
        if (section_key !== undefined)
            updateData.section_key = section_key.trim();
        if (title !== undefined)
            updateData.title = title && title.trim() ? title.trim() : null;
        if (content !== undefined)
            updateData.content = content && content.trim() ? content.trim() : null;
        if (image_url !== undefined)
            updateData.image_url = image_url && image_url.trim() ? image_url.trim() : null;
        if (button_text !== undefined)
            updateData.button_text = button_text && button_text.trim() ? button_text.trim() : null;
        if (button_link !== undefined)
            updateData.button_link = button_link && button_link.trim() ? button_link.trim() : null;
        if (list_items !== undefined)
            updateData.list_items = list_items || null;
        if (order_index !== undefined)
            updateData.order_index = order_index;
        if (is_active !== undefined)
            updateData.is_active = is_active;
        await section.update(updateData);
        res.json(section);
    }
    catch (error) {
        console.error('[updateAboutSection] Error:', error.message);
        res.status(500).json({
            error: 'Failed to update about section',
            message: error.message
        });
    }
};
exports.updateAboutSection = updateAboutSection;
// Delete about section
const deleteAboutSection = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await AboutSection_1.default.findByPk(id);
        if (!section) {
            return res.status(404).json({ error: 'About section not found' });
        }
        await section.destroy();
        res.json({ message: 'About section deleted successfully' });
    }
    catch (error) {
        console.error('[deleteAboutSection] Error:', error.message);
        res.status(500).json({
            error: 'Failed to delete about section',
            message: error.message
        });
    }
};
exports.deleteAboutSection = deleteAboutSection;
//# sourceMappingURL=aboutSectionController.js.map