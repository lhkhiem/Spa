"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get all testimonials
const getTestimonials = async (req, res) => {
    try {
        const { featured_only, active_only } = req.query;
        const conditions = [];
        if (featured_only === 'true') {
            conditions.push('is_featured = TRUE');
        }
        if (active_only === 'true') {
            conditions.push('is_active = TRUE');
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT * FROM testimonials 
      ${whereClause}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const testimonials = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        console.error('Failed to fetch testimonials:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
    }
};
exports.getTestimonials = getTestimonials;
// Create testimonial
const createTestimonial = async (req, res) => {
    try {
        const { customer_name, customer_title, customer_initials, testimonial_text, rating, is_featured, sort_order, is_active, } = req.body;
        if (!customer_name || !testimonial_text) {
            return res.status(400).json({ success: false, error: 'Customer name and testimonial text are required' });
        }
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO testimonials (
        id, customer_name, customer_title, customer_initials, 
        testimonial_text, rating, is_featured, sort_order, is_active
      )
      VALUES (
        :id, :customer_name, :customer_title, :customer_initials,
        :testimonial_text, :rating, :is_featured, :sort_order, :is_active
      )
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                customer_name,
                customer_title: customer_title || null,
                customer_initials: customer_initials || null,
                testimonial_text,
                rating: rating || 5,
                is_featured: is_featured || false,
                sort_order: sort_order || 0,
                is_active: is_active !== undefined ? is_active : true,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        res.status(201).json({ success: true, data: result[0][0] });
    }
    catch (error) {
        console.error('Failed to create testimonial:', error);
        res.status(500).json({ success: false, error: 'Failed to create testimonial' });
    }
};
exports.createTestimonial = createTestimonial;
// Update testimonial
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name, customer_title, customer_initials, testimonial_text, rating, is_featured, sort_order, is_active, } = req.body;
        const query = `
      UPDATE testimonials
      SET 
        customer_name = COALESCE(:customer_name, customer_name),
        customer_title = :customer_title,
        customer_initials = :customer_initials,
        testimonial_text = COALESCE(:testimonial_text, testimonial_text),
        rating = COALESCE(:rating, rating),
        is_featured = :is_featured,
        sort_order = COALESCE(:sort_order, sort_order),
        is_active = :is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                customer_name,
                customer_title: customer_title || null,
                customer_initials: customer_initials || null,
                testimonial_text,
                rating,
                is_featured,
                sort_order,
                is_active,
            },
            type: sequelize_1.QueryTypes.UPDATE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }
        res.json({ success: true, data: result[0][0] });
    }
    catch (error) {
        console.error('Failed to update testimonial:', error);
        res.status(500).json({ success: false, error: 'Failed to update testimonial' });
    }
};
exports.updateTestimonial = updateTestimonial;
// Delete testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM testimonials WHERE id = :id RETURNING *';
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete testimonial:', error);
        res.status(500).json({ success: false, error: 'Failed to delete testimonial' });
    }
};
exports.deleteTestimonial = deleteTestimonial;
//# sourceMappingURL=testimonialsController.js.map