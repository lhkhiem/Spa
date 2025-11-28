import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../config/database';
import { normalizeMediaUrl } from '../../utils/domainUtils';

const DEFAULT_PAGE_SIZE = 10;

export const listPublishedPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE, q, topic, tag, featured_only } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(pageSize) || DEFAULT_PAGE_SIZE);
    const limit = Number(pageSize) || DEFAULT_PAGE_SIZE;

    // Build WHERE clause
    const whereConditions: string[] = ["p.status = 'published'"];
    const replacements: any = { limit, offset };

    if (featured_only === 'true') {
      whereConditions.push('p.is_featured = TRUE');
    }

    if (q && typeof q === 'string' && q.trim().length > 0) {
      whereConditions.push(`(
        p.title ILIKE :search OR 
        p.excerpt ILIKE :search OR 
        p.content::text ILIKE :search
      )`);
      replacements.search = `%${q.trim()}%`;
    }

    if (topic && typeof topic === 'string') {
      const topicIds = topic.split(',').map(t => t.trim()).filter(Boolean);
      if (topicIds.length > 0) {
        whereConditions.push(`EXISTS (
          SELECT 1 FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id AND t.id = ANY(:topicIds::uuid[])
        )`);
        replacements.topicIds = `{${topicIds.join(',')}}`;
      }
    }

    if (tag && typeof tag === 'string') {
      const tagIds = tag.split(',').map(t => t.trim()).filter(Boolean);
      if (tagIds.length > 0) {
        whereConditions.push(`EXISTS (
          SELECT 1 FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id AND t.id = ANY(:tagIds::uuid[])
        )`);
        replacements.tagIds = `{${tagIds.join(',')}}`;
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const listQuery = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.read_time,
        p.is_featured,
        p.published_at,
        p.created_at,
        a.id as cover_asset_id,
        a.url as cover_asset_url,
        a.cdn_url as cover_asset_cdn_url,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id
        ) AS topics_json,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ) AS tags_json
      FROM posts p
      LEFT JOIN assets a ON a.id = p.cover_asset_id
      ${whereClause}
      ORDER BY p.is_featured DESC, p.published_at DESC NULLS LAST, p.created_at DESC
      LIMIT :limit OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int AS total
      FROM posts p
      ${whereClause}
    `;

    const [items, countRows] = await Promise.all([
      sequelize.query(listQuery, {
        replacements,
        type: QueryTypes.SELECT,
      }),
      sequelize.query<{ total: number }>(countQuery, {
        replacements: { ...replacements, limit: undefined, offset: undefined },
        type: QueryTypes.SELECT,
      }),
    ]);

    const total = countRows?.[0]?.total ?? 0;

    const data = (items as any[]).map((row) => {
      const topics = Array.isArray(row.topics_json) ? row.topics_json : [];
      const tags = Array.isArray(row.tags_json) ? row.tags_json : [];
      const coverImageUrl = normalizeMediaUrl(row.cover_asset_cdn_url) || normalizeMediaUrl(row.cover_asset_url);

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        readTime: row.read_time,
        isFeatured: row.is_featured,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        topics,
        tags,
        coverAsset: coverImageUrl ? {
          id: row.cover_asset_id,
          url: row.cover_asset_url,
          cdnUrl: row.cover_asset_cdn_url,
        } : null,
      };
    });

    res.json({
      success: true,
      data,
      total,
      page: Number(page) || 1,
      pageSize: limit,
    });
  } catch (error) {
    console.error('[public] listPublishedPosts error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
};

export const getPublishedPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.read_time,
        p.is_featured,
        p.published_at,
        p.created_at,
        a.id as cover_asset_id,
        a.url as cover_asset_url,
        a.cdn_url as cover_asset_cdn_url,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id
        ) AS topics_json,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ) AS tags_json
      FROM posts p
      LEFT JOIN assets a ON a.id = p.cover_asset_id
      WHERE p.status = 'published' AND p.slug = :slug
      LIMIT 1
    `;

    const result: any = await sequelize.query(query, {
      replacements: { slug },
      type: QueryTypes.SELECT,
    });

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const row = result[0];
    const topics = Array.isArray(row.topics_json) ? row.topics_json : [];
    const tags = Array.isArray(row.tags_json) ? row.tags_json : [];
    const coverImageUrl = normalizeMediaUrl(row.cover_asset_cdn_url) || normalizeMediaUrl(row.cover_asset_url);

    const data = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      readTime: row.read_time,
      isFeatured: row.is_featured,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      topics,
      tags,
      coverAsset: coverImageUrl ? {
        id: row.cover_asset_id,
        url: row.cover_asset_url,
        cdnUrl: row.cover_asset_cdn_url,
      } : null,
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('[public] getPublishedPostBySlug error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
};
