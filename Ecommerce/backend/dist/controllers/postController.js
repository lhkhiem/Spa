"use strict";
// Controller xử lý các route liên quan đến Post
// - CRUD operations cho bài viết
// - Hỗ trợ phân trang, filter theo status
// - Search theo title/excerpt
// - Quản lý topics và tags của bài viết
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPost = exports.deletePost = exports.updatePost = exports.createPost = exports.getPostBySlug = exports.getPostById = exports.getPosts = void 0;
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const Post_1 = __importDefault(require("../models/Post"));
const Topic_1 = __importDefault(require("../models/Topic"));
const Tag_1 = __importDefault(require("../models/Tag"));
const Asset_1 = __importDefault(require("../models/Asset"));
const slug_1 = require("../utils/slug");
const activityLogController_1 = require("./activityLogController");
const postMetadataSync_1 = require("../utils/postMetadataSync");
// Lấy danh sách bài viết có phân trang
// Query params:
// - page: trang hiện tại
// - pageSize: số bài mỗi trang
// - status: trạng thái (published/draft)
// - featured_only: chỉ lấy featured posts
// - q: từ khóa tìm kiếm
const getPosts = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, status, featured_only, q } = req.query;
        const offset = (page - 1) * pageSize;
        const where = {};
        // Only filter by status if it's explicitly provided and not empty
        if (status && status !== '') {
            where.status = status;
        }
        // Filter by featured
        if (featured_only === 'true') {
            where.is_featured = true;
        }
        if (q) {
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { excerpt: { [sequelize_1.Op.iLike]: `%${q}%` } },
            ];
        }
        const { count, rows } = await Post_1.default.findAndCountAll({
            where,
            offset,
            limit: pageSize,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Asset_1.default,
                    as: 'cover_asset',
                    required: false,
                    attributes: ['id', 'url', 'cdn_url', 'format', 'width', 'height', 'sizes']
                },
                {
                    model: Topic_1.default,
                    as: 'topics',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Tag_1.default,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
            distinct: true,
        });
        const formatted = rows.map((post) => {
            const plain = post.toJSON();
            plain.topics = Array.isArray(plain.topics)
                ? plain.topics.map((t) => ({ id: t.id, name: t.name }))
                : [];
            plain.tags = Array.isArray(plain.tags)
                ? plain.tags.map((t) => ({ id: t.id, name: t.name }))
                : [];
            plain.readTime = plain.read_time;
            return plain;
        });
        res.json({
            data: formatted,
            total: count,
            page,
            pageSize,
        });
    }
    catch (error) {
        console.error('[getPosts] Error:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch posts', message: error.message });
    }
};
exports.getPosts = getPosts;
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post_1.default.findByPk(id, {
            include: [
                {
                    model: Asset_1.default,
                    as: 'cover_asset',
                    required: false,
                    attributes: ['id', 'url', 'cdn_url', 'format', 'width', 'height', 'sizes']
                },
                {
                    model: Topic_1.default,
                    as: 'topics',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Tag_1.default,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const plain = post.toJSON();
        plain.topics = Array.isArray(plain.topics)
            ? plain.topics.map((t) => ({ id: t.id, name: t.name }))
            : [];
        plain.tags = Array.isArray(plain.tags)
            ? plain.tags.map((t) => ({ id: t.id, name: t.name }))
            : [];
        plain.readTime = plain.read_time;
        res.json(plain);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};
exports.getPostById = getPostById;
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post_1.default.findOne({
            where: { slug },
            include: [
                {
                    model: Asset_1.default,
                    as: 'cover_asset',
                    required: false,
                    attributes: ['id', 'url', 'cdn_url', 'format', 'width', 'height', 'sizes']
                },
                {
                    model: Topic_1.default,
                    as: 'topics',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Tag_1.default,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const plain = post.toJSON();
        plain.topics = Array.isArray(plain.topics)
            ? plain.topics.map((t) => ({ id: t.id, name: t.name }))
            : [];
        plain.tags = Array.isArray(plain.tags)
            ? plain.tags.map((t) => ({ id: t.id, name: t.name }))
            : [];
        plain.readTime = plain.read_time;
        res.json(plain);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};
exports.getPostBySlug = getPostBySlug;
const createPost = async (req, res) => {
    try {
        console.log('[createPost] Request body:', JSON.stringify(req.body, null, 2));
        const { title, slug, excerpt, content, cover_asset_id, status, author_id, seo, header_code, topics, tags, published_at, read_time, readTime, is_featured, } = req.body;
        if (!title) {
            console.error('[createPost] Missing title');
            return res.status(400).json({ error: 'Title is required', code: 'VALIDATION_ERROR' });
        }
        console.log('[createPost] cover_asset_id:', cover_asset_id);
        // Slug generation and uniqueness
        const desired = slug ? (0, slug_1.generateSlug)(slug) : (0, slug_1.generateSlug)(title);
        const unique = await (0, slug_1.generateUniqueSlug)(desired, async (s) => {
            const exist = await Post_1.default.findOne({ where: { slug: s }, attributes: ['id'] });
            return !exist; // Return true if unique (doesn't exist)
        });
        // Normalize optional fields - ensure proper UUID or null
        const safeAuthorId = author_id || null;
        // Handle both HTML string and JSON content (backward compatibility)
        const safeContent = content !== undefined ? content : '';
        const safeCoverAsset = cover_asset_id || null;
        const safeSeo = seo || null;
        const safeHeaderCode = header_code || null;
        const safeReadTimeValue = typeof read_time === 'string'
            ? read_time.trim() || null
            : typeof readTime === 'string'
                ? readTime.trim() || null
                : null;
        // Set published_at to now if publishing without explicit date
        const finalPublishedAt = status === 'published'
            ? (published_at ? new Date(published_at) : new Date())
            : null;
        console.log('[createPost] Creating post:', { title, slug: unique, status, author_id: safeAuthorId, cover_asset_id: safeCoverAsset });
        const post = await Post_1.default.create({
            id: (0, uuid_1.v4)(),
            title,
            slug: unique,
            excerpt: excerpt || '',
            content: safeContent,
            cover_asset_id: safeCoverAsset,
            status: status || 'draft',
            author_id: safeAuthorId,
            published_at: finalPublishedAt,
            seo: safeSeo,
            header_code: safeHeaderCode,
            read_time: safeReadTimeValue,
            is_featured: is_featured !== undefined ? Boolean(is_featured) : true, // Default to true
        });
        console.log('[createPost] Post saved with cover_asset_id:', post.cover_asset_id);
        // Add topics
        if (topics && topics.length > 0) {
            const topicIds = await Topic_1.default.findAll({
                where: { id: topics },
                attributes: ['id'],
            });
            await post.addTopics(topicIds);
        }
        // Add tags
        if (tags && tags.length > 0) {
            const tagIds = await Tag_1.default.findAll({
                where: { id: tags },
                attributes: ['id'],
            });
            await post.addTags(tagIds);
        }
        console.log('[createPost] Post created successfully:', post.id);
        // Auto-sync metadata to CMS Settings
        await (0, postMetadataSync_1.syncPostMetadataToCMS)(post);
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'create', 'post', post.id, title, `Created post "${title}"`);
        res.status(201).json(post);
    }
    catch (error) {
        console.error('[createPost] Error:', error.message, error.stack);
        res.status(500).json({
            error: 'Failed to create post',
            message: error.message,
            code: 'SERVER_ERROR'
        });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('[updatePost] Request body:', JSON.stringify(req.body, null, 2));
        const { title, slug, excerpt, content, cover_asset_id, status, author_id, seo, header_code, topics, tags, published_at, read_time, readTime, is_featured, } = req.body;
        const post = await Post_1.default.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        console.log('[updatePost] cover_asset_id from request:', cover_asset_id);
        // Slug uniqueness if changed
        let nextSlug = post.slug;
        if (slug || title) {
            const base = slug ? (0, slug_1.generateSlug)(slug) : (0, slug_1.generateSlug)(title || nextSlug);
            if (base !== nextSlug) {
                nextSlug = await (0, slug_1.generateUniqueSlug)(base, async (s) => {
                    const exist = await Post_1.default.findOne({ where: { slug: s }, attributes: ['id'] });
                    // Return true if unique (doesn't exist or is the same post)
                    return !exist || exist.id === post.id;
                });
            }
        }
        // Normalize optional fields - ensure proper UUID or null
        const safeAuthorId = author_id !== undefined ? (author_id || null) : post.author_id;
        const safeCover = cover_asset_id !== undefined ? (cover_asset_id || null) : post.cover_asset_id;
        const safeReadTimeValue = read_time !== undefined
            ? typeof read_time === 'string'
                ? read_time.trim() || null
                : null
            : readTime !== undefined
                ? typeof readTime === 'string'
                    ? readTime.trim() || null
                    : null
                : post.read_time;
        const finalPublishedAt = status === 'published'
            ? (published_at ? new Date(published_at) : (post.published_at || new Date()))
            : (published_at ? new Date(published_at) : null);
        console.log('[updatePost] Updating post:', id, { status, author_id: safeAuthorId, cover_asset_id: safeCover });
        // Handle both HTML string and JSON content (backward compatibility)
        const updatedContent = content !== undefined ? content : post.content;
        await post.update({
            title: title || post.title,
            slug: nextSlug,
            excerpt: excerpt !== undefined ? excerpt : post.excerpt,
            content: updatedContent,
            cover_asset_id: safeCover,
            status: status || post.status,
            author_id: safeAuthorId,
            published_at: finalPublishedAt,
            seo: seo !== undefined ? seo : post.seo,
            header_code: header_code !== undefined ? header_code : post.header_code,
            read_time: safeReadTimeValue,
            is_featured: is_featured !== undefined ? Boolean(is_featured) : (post.is_featured !== undefined ? post.is_featured : true),
            updated_at: new Date(),
        });
        // Update topics
        if (topics) {
            const topicIds = await Topic_1.default.findAll({
                where: { id: topics },
                attributes: ['id'],
            });
            await post.setTopics(topicIds);
        }
        // Update tags
        if (tags) {
            const tagIds = await Tag_1.default.findAll({
                where: { id: tags },
                attributes: ['id'],
            });
            await post.setTags(tagIds);
        }
        console.log('[updatePost] Post updated successfully');
        // Auto-sync metadata to CMS Settings
        await (0, postMetadataSync_1.syncPostMetadataToCMS)(post);
        // Log activity
        const postTitle = title || post.title;
        await (0, activityLogController_1.logActivity)(req, 'update', 'post', id, postTitle, `Updated post "${postTitle}"`);
        res.json(post);
    }
    catch (error) {
        console.error('[updatePost] Error:', error.message);
        res.status(500).json({
            error: 'Failed to update post',
            message: error.message
        });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post_1.default.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const postTitle = post.title;
        const postSlug = post.slug;
        await post.destroy();
        // Remove metadata from CMS Settings
        try {
            const { removeMetadataFromCMS } = await Promise.resolve().then(() => __importStar(require('../utils/removeMetadataFromCMS')));
            await removeMetadataFromCMS(`/posts/${postSlug}`);
        }
        catch (metaError) {
            console.error('[deletePost] Failed to remove metadata:', metaError);
            // Continue anyway - post is already deleted
        }
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'post', id, postTitle, `Deleted post "${postTitle}"`);
        res.json({ message: 'Post deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
exports.deletePost = deletePost;
const publishPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post_1.default.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        await post.update({
            status: 'published',
            published_at: new Date(),
            updated_at: new Date(),
        });
        // Log activity
        const postTitle = post.title;
        await (0, activityLogController_1.logActivity)(req, 'publish', 'post', id, postTitle, `Published post "${postTitle}"`);
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to publish post' });
    }
};
exports.publishPost = publishPost;
//# sourceMappingURL=postController.js.map