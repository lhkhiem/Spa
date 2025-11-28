"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearningLibraryPosts = exports.getHomepageStats = exports.getEducationResources = exports.getTestimonials = exports.getBestSellerProducts = exports.getFeaturedBrands = exports.getFeaturedCategories = exports.getHeroSliders = exports.getValueProps = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const domainUtils_1 = require("../../utils/domainUtils");
const buildWhereClause = (conditions) => conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
const parseLimit = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.min(parsed, 50);
};
const getValueProps = async (req, res) => {
    try {
        const { active_only = 'true' } = req.query;
        const conditions = [];
        if (active_only === 'true') {
            conditions.push('is_active = TRUE');
        }
        const query = `
      SELECT id, title, subtitle, icon_key, icon_color, icon_background, sort_order
      FROM value_props
      ${buildWhereClause(conditions)}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const valueProps = await database_1.default.query(query, { type: sequelize_1.QueryTypes.SELECT });
        res.json({ success: true, data: valueProps });
    }
    catch (error) {
        console.error('[public] Failed to fetch value props:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch value props' });
    }
};
exports.getValueProps = getValueProps;
const getHeroSliders = async (req, res) => {
    try {
        const { active_only = 'true', limit } = req.query;
        const conditions = [];
        if (active_only === 'true') {
            conditions.push('s.is_active = TRUE');
        }
        const limitValue = parseLimit(limit, 5);
        const limitClause = limitValue > 0 ? 'LIMIT :limit' : '';
        const query = `
      SELECT
        s.id,
        s.title,
        s.description,
        s.button_text,
        s.button_link,
        s.order_index,
        s.is_active,
        COALESCE(a.cdn_url, a.url, s.image_url) AS image_url
      FROM sliders s
      LEFT JOIN assets a ON s.image_id = a.id
      ${buildWhereClause(conditions)}
      ORDER BY s.order_index ASC, s.created_at DESC
      ${limitClause}
    `;
        const slides = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: limitClause ? { limit: limitValue } : {},
        });
        res.json({
            success: true,
            data: slides.map((slide) => ({
                id: slide.id,
                title: slide.title,
                description: slide.description,
                ctaText: slide.button_text,
                ctaLink: slide.button_link,
                imageUrl: (0, domainUtils_1.normalizeMediaUrl)(slide.image_url),
                order: slide.order_index,
                isActive: slide.is_active,
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch hero sliders:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch hero sliders' });
    }
};
exports.getHeroSliders = getHeroSliders;
const getFeaturedCategories = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitValue = parseLimit(limit, 6);
        const limitClause = limitValue > 0 ? 'LIMIT :limit' : '';
        const query = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        COALESCE(a.cdn_url, a.url) AS image_url
      FROM product_categories c
      LEFT JOIN assets a ON c.image_id = a.id
      WHERE c.is_featured = TRUE
      ORDER BY c.updated_at DESC, c.created_at DESC
      ${limitClause}
    `;
        const categories = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: limitClause ? { limit: limitValue } : {},
        });
        res.json({
            success: true,
            data: categories.map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                imageUrl: (0, domainUtils_1.normalizeMediaUrl)(category.image_url),
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch featured categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch featured categories' });
    }
};
exports.getFeaturedCategories = getFeaturedCategories;
const getFeaturedBrands = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitValue = parseLimit(limit, 6);
        const limitClause = limitValue > 0 ? 'LIMIT :limit' : '';
        const query = `
      SELECT
        b.id,
        b.name,
        b.slug,
        b.description,
        COALESCE(a.cdn_url, a.url) AS logo_url
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      WHERE b.is_featured = TRUE
      ORDER BY b.updated_at DESC, b.created_at DESC
      ${limitClause}
    `;
        const brands = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: limitClause ? { limit: limitValue } : {},
        });
        res.json({
            success: true,
            data: brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                tagline: brand.description,
                logoUrl: (0, domainUtils_1.normalizeMediaUrl)(brand.logo_url),
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch featured brands:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch featured brands' });
    }
};
exports.getFeaturedBrands = getFeaturedBrands;
const getBestSellerProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitValue = parseLimit(limit, 6);
        const limitClause = limitValue > 0 ? 'LIMIT :limit' : '';
        const query = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.price,
        p.compare_price,
        p.stock,
        p.published_at,
        COALESCE(a.cdn_url, a.url) AS image_url,
        AVG(pr.rating) AS average_rating,
        COUNT(pr.id) AS review_count
      FROM products p
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      LEFT JOIN product_reviews pr ON pr.product_id = p.id AND pr.status = 'approved'
      WHERE p.status = 'published' AND p.is_best_seller = TRUE
      GROUP BY
        p.id, p.name, p.slug, p.price, p.compare_price, p.stock, p.published_at, a.cdn_url, a.url
      ORDER BY p.published_at DESC NULLS LAST, p.updated_at DESC
      ${limitClause}
    `;
        const products = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: limitClause ? { limit: limitValue } : {},
        });
        res.json({
            success: true,
            data: products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price) || 0,
                salePrice: product.compare_price ? Number(product.compare_price) : null,
                imageUrl: (0, domainUtils_1.normalizeMediaUrl)(product.image_url),
                rating: product.average_rating ? Number(product.average_rating) : null,
                reviewCount: Number(product.review_count) || 0,
                inStock: Number(product.stock) > 0,
                badge: 'Best Seller',
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch best seller products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch best seller products' });
    }
};
exports.getBestSellerProducts = getBestSellerProducts;
const getTestimonials = async (req, res) => {
    try {
        const { featured_only, active_only = 'true' } = req.query;
        const conditions = [];
        if (active_only === 'true') {
            conditions.push('is_active = TRUE');
        }
        if (featured_only === 'true') {
            conditions.push('is_featured = TRUE');
        }
        const query = `
      SELECT id, customer_name, customer_title, customer_initials, testimonial_text, rating, is_featured, sort_order
      FROM testimonials
      ${buildWhereClause(conditions)}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const testimonials = await database_1.default.query(query, { type: sequelize_1.QueryTypes.SELECT });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        console.error('[public] Failed to fetch testimonials:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
    }
};
exports.getTestimonials = getTestimonials;
const getEducationResources = async (req, res) => {
    try {
        const { featured_only, active_only = 'true' } = req.query;
        const conditions = [];
        if (active_only === 'true') {
            conditions.push('is_active = TRUE');
        }
        if (featured_only === 'true') {
            conditions.push('is_featured = TRUE');
        }
        const query = `
      SELECT id, title, slug, description, image_url, link_url, link_text, resource_type, duration, ceus, level, sort_order
      FROM education_resources
      ${buildWhereClause(conditions)}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const resources = await database_1.default.query(query, { type: sequelize_1.QueryTypes.SELECT });
        res.json({
            success: true,
            data: resources.map((resource) => ({
                ...resource,
                image_url: (0, domainUtils_1.normalizeMediaUrl)(resource.image_url),
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch education resources:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch education resources' });
    }
};
exports.getEducationResources = getEducationResources;
const DEFAULT_HOMEPAGE_STATS = {
    // Giá trị mặc định nếu settings chưa được cấu hình
    activeCustomers: '84,000+',
    countriesServed: '47',
    yearsInBusiness: '40+',
};
const getHomepageStats = async (_req, res) => {
    try {
        const result = await database_1.default.query(`
        SELECT value
        FROM settings
        WHERE namespace = 'homepage_metrics'
        LIMIT 1
      `, { type: sequelize_1.QueryTypes.SELECT });
        const row = result[0];
        const stats = row?.value || DEFAULT_HOMEPAGE_STATS;
        res.json({ success: true, data: stats });
    }
    catch (error) {
        console.error('[public] Failed to fetch homepage stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch homepage stats' });
    }
};
exports.getHomepageStats = getHomepageStats;
const getLearningLibraryPosts = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitValue = parseLimit(limit, 4);
        const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        COALESCE(p.read_time, p.content -> 'meta' ->> 'readTime', '') AS read_time,
        p.content -> 'meta' ->> 'category' AS category,
        COALESCE(p.content -> 'meta' ->> 'imageUrl', a.cdn_url, a.url) AS raw_image_url,
        STRING_AGG(DISTINCT t.name, ' & ') FILTER (WHERE t.name IS NOT NULL) AS topic_names,
        p.published_at
      FROM posts p
      LEFT JOIN post_topics pt ON pt.post_id = p.id
      LEFT JOIN topics t ON t.id = pt.topic_id
      LEFT JOIN assets a ON a.id = p.cover_asset_id
      WHERE p.status = 'published'
      GROUP BY
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.read_time,
        p.content,
        p.published_at,
        a.cdn_url,
        a.url
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
      LIMIT :limit
    `;
        const posts = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { limit: limitValue },
        });
        res.json({
            success: true,
            data: posts.map((post) => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                readTime: post.read_time,
                category: post.category,
                imageUrl: (0, domainUtils_1.normalizeMediaUrl)(post.raw_image_url) ?? post.raw_image_url,
                topic: post.topic_names ? String(post.topic_names) : 'General',
                publishedAt: post.published_at,
            })),
        });
    }
    catch (error) {
        console.error('[public] Failed to fetch learning library posts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch learning posts' });
    }
};
exports.getLearningLibraryPosts = getLearningLibraryPosts;
//# sourceMappingURL=homepageController.js.map