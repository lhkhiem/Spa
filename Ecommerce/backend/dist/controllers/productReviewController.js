"use strict";
// Product Review Controller
// Handles product reviews and ratings
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToReview = exports.deleteReview = exports.updateReview = exports.createReview = exports.getProductReviews = exports.getAllReviews = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get all reviews (admin)
const getAllReviews = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, status, search } = req.query;
        const whereConditions = [];
        const replacements = {
            limit: Number(pageSize),
            offset: (Number(page) - 1) * Number(pageSize)
        };
        if (status) {
            whereConditions.push('pr.status = :status');
            replacements.status = status;
        }
        if (search) {
            whereConditions.push('(pr.customer_name ILIKE :search OR pr.title ILIKE :search OR pr.review_text ILIKE :search)');
            replacements.search = `%${search}%`;
        }
        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';
        // Get total count
        const countQuery = `
      SELECT COUNT(*) as total
      FROM product_reviews pr
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        const total = countResult[0].total;
        // Get reviews
        const reviewsQuery = `
      SELECT 
        pr.*,
        p.name as product_name,
        p.slug as product_slug
      FROM product_reviews pr
      LEFT JOIN products p ON pr.product_id = p.id
      ${whereClause}
      ORDER BY pr.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
        const reviews = await database_1.default.query(reviewsQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({
            reviews,
            pagination: {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Math.ceil(total / Number(pageSize))
            }
        });
    }
    catch (error) {
        console.error('Failed to fetch reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
exports.getAllReviews = getAllReviews;
// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { status = 'approved' } = req.query;
        const query = `
      SELECT 
        pr.*,
        u.name as user_name,
        u.email as user_email
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = :product_id 
        AND pr.status = :status
      ORDER BY 
        pr.is_verified_purchase DESC,
        pr.created_at DESC
    `;
        const reviews = await database_1.default.query(query, {
            replacements: { product_id, status },
            type: sequelize_1.QueryTypes.SELECT
        });
        // Calculate average rating and count
        const statsQuery = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as review_count,
        COUNT(*) FILTER (WHERE rating = 5) as rating_5,
        COUNT(*) FILTER (WHERE rating = 4) as rating_4,
        COUNT(*) FILTER (WHERE rating = 3) as rating_3,
        COUNT(*) FILTER (WHERE rating = 2) as rating_2,
        COUNT(*) FILTER (WHERE rating = 1) as rating_1
      FROM product_reviews
      WHERE product_id = :product_id AND status = 'approved'
    `;
        const stats = await database_1.default.query(statsQuery, {
            replacements: { product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.json({
            reviews,
            statistics: {
                average_rating: Number(stats[0].average_rating || 0).toFixed(2),
                review_count: Number(stats[0].review_count || 0),
                rating_breakdown: {
                    5: Number(stats[0].rating_5 || 0),
                    4: Number(stats[0].rating_4 || 0),
                    3: Number(stats[0].rating_3 || 0),
                    2: Number(stats[0].rating_2 || 0),
                    1: Number(stats[0].rating_1 || 0)
                }
            }
        });
    }
    catch (error) {
        console.error('Failed to fetch reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
exports.getProductReviews = getProductReviews;
// Create review
const createReview = async (req, res) => {
    try {
        const { product_id, user_id, customer_name, customer_email, rating, title, review_text } = req.body;
        // Validation
        if (!product_id || !rating || !customer_name) {
            return res.status(400).json({ error: 'product_id, rating, and customer_name required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        // Check if product exists
        const productQuery = `
      SELECT id FROM products WHERE id = :product_id AND status = 'published'
    `;
        const products = await database_1.default.query(productQuery, {
            replacements: { product_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Check if user already reviewed this product (if user_id provided)
        if (user_id) {
            const existingQuery = `
        SELECT id FROM product_reviews WHERE product_id = :product_id AND user_id = :user_id
      `;
            const existing = await database_1.default.query(existingQuery, {
                replacements: { product_id, user_id },
                type: sequelize_1.QueryTypes.SELECT
            });
            if (existing && existing.length > 0) {
                return res.status(400).json({ error: 'You have already reviewed this product' });
            }
        }
        // TODO: Check if user purchased this product (for verified purchase badge)
        let isVerifiedPurchase = false;
        if (user_id) {
            // Check if user has any order with this product
            // This is simplified - in production, check order_items
            isVerifiedPurchase = false;
        }
        const insertQuery = `
      INSERT INTO product_reviews (
        id, product_id, user_id, customer_name, customer_email,
        rating, title, review_text, is_verified_purchase,
        status, helpful_count, not_helpful_count,
        created_at, updated_at
      )
      VALUES (
        :id, :product_id, :user_id, :customer_name, :customer_email,
        :rating, :title, :review_text, :is_verified_purchase,
        'pending', 0, 0,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;
        const inserted = await database_1.default.query(insertQuery, {
            replacements: {
                id: (0, uuid_1.v4)(),
                product_id,
                user_id: user_id || null,
                customer_name,
                customer_email: customer_email || null,
                rating,
                title: title || null,
                review_text: review_text || null,
                is_verified_purchase: isVerifiedPurchase
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(201).json(inserted[0]);
    }
    catch (error) {
        console.error('Failed to create review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};
exports.createReview = createReview;
// Update review (admin - moderation)
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, moderation_notes } = req.body;
        // Validation
        const allowedStatuses = ['pending', 'approved', 'rejected'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const updates = [];
        const replacements = { id };
        if (status) {
            updates.push('status = :status');
            replacements.status = status;
        }
        if (moderation_notes) {
            updates.push('moderation_notes = :moderation_notes');
            replacements.moderation_notes = moderation_notes;
        }
        updates.push('updated_at = CURRENT_TIMESTAMP');
        const query = `
      UPDATE product_reviews
      SET ${updates.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
        const updated = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!updated || updated.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(updated[0]);
    }
    catch (error) {
        console.error('Failed to update review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};
exports.updateReview = updateReview;
// Delete review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      DELETE FROM product_reviews WHERE id = :id RETURNING id
    `;
        const deleted = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE
        });
        if (!deleted || deleted.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted' });
    }
    catch (error) {
        console.error('Failed to delete review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
exports.deleteReview = deleteReview;
// React to review (helpful/not helpful)
const reactToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, is_helpful } = req.body;
        if (!user_id || typeof is_helpful !== 'boolean') {
            return res.status(400).json({ error: 'user_id and is_helpful (boolean) required' });
        }
        // Check if already reacted
        const existingQuery = `
      SELECT id, is_helpful FROM review_reactions
      WHERE review_id = :review_id AND user_id = :user_id
    `;
        const existing = await database_1.default.query(existingQuery, {
            replacements: { review_id: id, user_id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (existing && existing.length > 0) {
            // Update existing reaction
            const existingReaction = existing[0];
            if (existingReaction.is_helpful === is_helpful) {
                // Same reaction - remove it
                await database_1.default.query('DELETE FROM review_reactions WHERE review_id = :review_id AND user_id = :user_id', { replacements: { review_id: id, user_id }, type: sequelize_1.QueryTypes.DELETE });
                // Decrement count
                const countField = is_helpful ? 'helpful_count' : 'not_helpful_count';
                await database_1.default.query(`UPDATE product_reviews SET ${countField} = ${countField} - 1 WHERE id = :review_id`, { replacements: { review_id: id }, type: sequelize_1.QueryTypes.UPDATE });
                return res.json({ success: true, message: 'Reaction removed' });
            }
            else {
                // Different reaction - update it
                await database_1.default.query('UPDATE review_reactions SET is_helpful = :is_helpful WHERE review_id = :review_id AND user_id = :user_id', { replacements: { review_id: id, user_id, is_helpful }, type: sequelize_1.QueryTypes.UPDATE });
                // Adjust counts
                const oldCountField = existingReaction.is_helpful ? 'helpful_count' : 'not_helpful_count';
                const newCountField = is_helpful ? 'helpful_count' : 'not_helpful_count';
                await database_1.default.query(`UPDATE product_reviews SET ${oldCountField} = ${oldCountField} - 1, ${newCountField} = ${newCountField} + 1 WHERE id = :review_id`, { replacements: { review_id: id }, type: sequelize_1.QueryTypes.UPDATE });
                return res.json({ success: true, message: 'Reaction updated' });
            }
        }
        // Create new reaction
        const insertQuery = `
      INSERT INTO review_reactions (id, review_id, user_id, is_helpful, created_at)
      VALUES (:id, :review_id, :user_id, :is_helpful, CURRENT_TIMESTAMP)
    `;
        await database_1.default.query(insertQuery, {
            replacements: {
                id: (0, uuid_1.v4)(),
                review_id: id,
                user_id,
                is_helpful
            },
            type: sequelize_1.QueryTypes.INSERT
        });
        // Increment count
        const countField = is_helpful ? 'helpful_count' : 'not_helpful_count';
        await database_1.default.query(`UPDATE product_reviews SET ${countField} = ${countField} + 1 WHERE id = :review_id`, { replacements: { review_id: id }, type: sequelize_1.QueryTypes.UPDATE });
        res.json({ success: true, message: 'Reaction added' });
    }
    catch (error) {
        console.error('Failed to react to review:', error);
        res.status(500).json({ error: 'Failed to react to review' });
    }
};
exports.reactToReview = reactToReview;
//# sourceMappingURL=productReviewController.js.map