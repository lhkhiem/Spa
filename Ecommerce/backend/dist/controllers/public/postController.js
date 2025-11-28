"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedPostBySlug = exports.listPublishedPosts = void 0;
const sequelize_1 = require("sequelize");
const Post_1 = __importDefault(require("../../models/Post"));
const Topic_1 = __importDefault(require("../../models/Topic"));
const Tag_1 = __importDefault(require("../../models/Tag"));
const Asset_1 = __importDefault(require("../../models/Asset"));
const DEFAULT_PAGE_SIZE = 10;
const formatPost = (post) => {
    const plain = post.toJSON();
    plain.topics = Array.isArray(plain.topics)
        ? plain.topics.map((t) => ({ id: t.id, name: t.name }))
        : [];
    plain.tags = Array.isArray(plain.tags)
        ? plain.tags.map((t) => ({ id: t.id, name: t.name }))
        : [];
    plain.readTime = plain.read_time;
    return plain;
};
const listPublishedPosts = async (req, res) => {
    try {
        const { page = 1, pageSize = DEFAULT_PAGE_SIZE, q, topic, tag, featured_only } = req.query;
        const offset = ((Number(page) || 1) - 1) * (Number(pageSize) || DEFAULT_PAGE_SIZE);
        const where = { status: 'published' };
        if (featured_only === 'true') {
            where.is_featured = true;
        }
        if (q && typeof q === 'string' && q.trim().length > 0) {
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { excerpt: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { content: { [sequelize_1.Op.iLike]: `%${q}%` } },
            ];
        }
        const topicFilter = topic && typeof topic === 'string' ? topic.split(',') : undefined;
        const tagFilter = tag && typeof tag === 'string' ? tag.split(',') : undefined;
        const { count, rows } = await Post_1.default.findAndCountAll({
            where,
            offset,
            limit: Number(pageSize) || DEFAULT_PAGE_SIZE,
            order: [
                ['is_featured', 'DESC'],
                ['published_at', 'DESC'],
            ],
            include: [
                {
                    model: Asset_1.default,
                    as: 'cover_asset',
                    required: false,
                    attributes: ['id', 'url', 'cdn_url', 'format', 'width', 'height', 'sizes'],
                },
                {
                    model: Topic_1.default,
                    as: 'topics',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    ...(topicFilter ? { where: { id: topicFilter } } : {}),
                },
                {
                    model: Tag_1.default,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    ...(tagFilter ? { where: { id: tagFilter } } : {}),
                },
            ],
            distinct: true,
        });
        res.json({
            success: true,
            data: rows.map(formatPost),
            total: count,
            page: Number(page) || 1,
            pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
        });
    }
    catch (error) {
        console.error('[public] listPublishedPosts error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch posts' });
    }
};
exports.listPublishedPosts = listPublishedPosts;
const getPublishedPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post_1.default.findOne({
            where: { slug, status: 'published' },
            include: [
                {
                    model: Asset_1.default,
                    as: 'cover_asset',
                    required: false,
                    attributes: ['id', 'url', 'cdn_url', 'format', 'width', 'height', 'sizes'],
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
        });
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.json({ success: true, data: formatPost(post) });
    }
    catch (error) {
        console.error('[public] getPublishedPostBySlug error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch post' });
    }
};
exports.getPublishedPostBySlug = getPublishedPostBySlug;
//# sourceMappingURL=postController.js.map