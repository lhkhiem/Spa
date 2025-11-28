"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducationResource = exports.updateEducationResource = exports.createEducationResource = exports.getEducationResourceBySlug = exports.getEducationResourceById = exports.getEducationResources = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const slug_1 = require("../utils/slug");
// Normalize URL to remove domain, keep only relative path
const normalizeImageUrl = (url) => {
    if (!url || typeof url !== 'string')
        return null;
    // If already a relative path, return as is
    if (url.startsWith('/'))
        return url;
    // Remove protocol and domain
    try {
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search;
    }
    catch {
        // If URL parsing fails, try to extract path manually
        const match = url.match(/https?:\/\/[^\/]+(\/.*)/);
        return match ? match[1] : url;
    }
};
// Helper function to get full education resource with topics and tags
const getFullEducationResource = async (resourceId) => {
    try {
        // Validate UUID format
        if (!resourceId || typeof resourceId !== 'string') {
            throw new Error('Invalid resource ID');
        }
        const resourceQuery = `
      SELECT * FROM education_resources WHERE id = :id::uuid
    `;
        const resources = await database_1.default.query(resourceQuery, {
            replacements: { id: resourceId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        console.log('[getFullEducationResource] Query result:', resources?.length || 0, 'rows');
        if (!resources || !Array.isArray(resources) || resources.length === 0) {
            console.log('[getFullEducationResource] No resource found for ID:', resourceId);
            return null;
        }
        const resource = resources[0];
        if (!resource) {
            console.log('[getFullEducationResource] Resource is null/undefined');
            return null;
        }
        console.log('[getFullEducationResource] Found resource:', resource.id, resource.title);
        // Get topics - wrap in try-catch in case junction table doesn't exist
        let topics = [];
        try {
            const topicsQuery = `
        SELECT t.id, t.name, t.slug
        FROM topics t
        INNER JOIN education_resource_topics ert ON t.id = ert.topic_id
        WHERE ert.education_resource_id = :id::uuid
        ORDER BY t.name ASC
      `;
            const topicsResult = await database_1.default.query(topicsQuery, {
                replacements: { id: resourceId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            topics = Array.isArray(topicsResult) ? topicsResult : [];
            console.log('[getFullEducationResource] Found', topics.length, 'topics');
        }
        catch (error) {
            console.error('[getFullEducationResource] Error fetching topics:', error.message);
            console.error('[getFullEducationResource] Error details:', error);
            // If table doesn't exist, return empty array
            if (error.message?.includes('does not exist') ||
                error.message?.includes('relation') ||
                error.message?.includes('column') ||
                error.code === '42P01') {
                console.warn('[getFullEducationResource] Junction table education_resource_topics may not exist yet');
                topics = [];
            }
            else {
                // Log but don't throw - return empty array to allow resource to load
                console.error('[getFullEducationResource] Non-critical error fetching topics, continuing...');
                topics = [];
            }
        }
        // Get tags - wrap in try-catch in case junction table doesn't exist
        let tags = [];
        try {
            const tagsQuery = `
        SELECT t.id, t.name, t.slug
        FROM tags t
        INNER JOIN education_resource_tags ert ON t.id = ert.tag_id
        WHERE ert.education_resource_id = :id::uuid
        ORDER BY t.name ASC
      `;
            const tagsResult = await database_1.default.query(tagsQuery, {
                replacements: { id: resourceId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            tags = Array.isArray(tagsResult) ? tagsResult : [];
            console.log('[getFullEducationResource] Found', tags.length, 'tags');
        }
        catch (error) {
            console.error('[getFullEducationResource] Error fetching tags:', error.message);
            console.error('[getFullEducationResource] Error details:', error);
            // If table doesn't exist, return empty array
            if (error.message?.includes('does not exist') ||
                error.message?.includes('relation') ||
                error.message?.includes('column') ||
                error.code === '42P01') {
                console.warn('[getFullEducationResource] Junction table education_resource_tags may not exist yet');
                tags = [];
            }
            else {
                // Log but don't throw - return empty array to allow resource to load
                console.error('[getFullEducationResource] Non-critical error fetching tags, continuing...');
                tags = [];
            }
        }
        const result = {
            ...resource,
            topics: topics || [],
            tags: tags || [],
        };
        console.log('[getFullEducationResource] Returning resource with', result.topics.length, 'topics and', result.tags.length, 'tags');
        return result;
    }
    catch (error) {
        console.error('[getFullEducationResource] Unexpected error:', error);
        console.error('[getFullEducationResource] Error message:', error?.message);
        console.error('[getFullEducationResource] Error code:', error?.code);
        console.error('[getFullEducationResource] Error stack:', error?.stack);
        throw error;
    }
};
const getEducationResources = async (req, res) => {
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
      SELECT * FROM education_resources 
      ${whereClause}
      ORDER BY sort_order ASC, created_at ASC
    `;
        const resources = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ success: true, data: resources });
    }
    catch (error) {
        console.error('Failed to fetch education resources:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch education resources' });
    }
};
exports.getEducationResources = getEducationResources;
const getEducationResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('[getEducationResourceById] Requested ID:', id);
        if (!id) {
            return res.status(400).json({ success: false, error: 'Resource ID is required' });
        }
        const fullResource = await getFullEducationResource(id);
        console.log('[getEducationResourceById] Found resource:', fullResource ? 'Yes' : 'No');
        if (!fullResource) {
            console.log('[getEducationResourceById] Resource not found for ID:', id);
            return res.status(404).json({ success: false, error: 'Education resource not found' });
        }
        console.log('[getEducationResourceById] Returning resource with', fullResource.topics?.length || 0, 'topics and', fullResource.tags?.length || 0, 'tags');
        res.json({ success: true, data: fullResource });
    }
    catch (error) {
        console.error('[getEducationResourceById] Error:', error);
        console.error('[getEducationResourceById] Error message:', error?.message);
        console.error('[getEducationResourceById] Error code:', error?.code);
        console.error('[getEducationResourceById] Error stack:', error?.stack);
        // Ensure we always return a proper error message
        const errorMessage = error?.message || error?.toString() || 'Failed to fetch education resource';
        res.status(500).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? {
                code: error?.code,
                stack: error?.stack
            } : undefined
        });
    }
};
exports.getEducationResourceById = getEducationResourceById;
const getEducationResourceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const query = `
      SELECT * FROM education_resources 
      WHERE slug = :slug AND is_active = TRUE
    `;
        const resources = await database_1.default.query(query, {
            replacements: { slug },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!resources || resources.length === 0) {
            return res.status(404).json({ success: false, error: 'Education resource not found' });
        }
        res.json({ success: true, data: resources[0] });
    }
    catch (error) {
        console.error('Failed to fetch education resource by slug:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch education resource' });
    }
};
exports.getEducationResourceBySlug = getEducationResourceBySlug;
const createEducationResource = async (req, res) => {
    try {
        const { title, slug, description, image_url, link_url, link_text, duration, ceus, level, resource_type, is_featured, sort_order, is_active, topics, tags, } = req.body;
        if (!title || !image_url) {
            return res.status(400).json({ success: false, error: 'Title and image_url are required' });
        }
        // Generate slug if not provided
        let finalSlug = slug || (0, slug_1.generateSlug)(title);
        // Ensure slug is unique
        const checkSlugUnique = async (s) => {
            const existing = await database_1.default.query('SELECT id FROM education_resources WHERE slug = :slug', { replacements: { slug: s }, type: sequelize_1.QueryTypes.SELECT });
            return !existing || existing.length === 0;
        };
        finalSlug = await (0, slug_1.generateUniqueSlug)(finalSlug, checkSlugUnique);
        // Auto-generate link_url from slug if not provided
        const finalLinkUrl = link_url || `/education/${finalSlug}`;
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO education_resources (
        id, title, slug, description, image_url, link_url, link_text,
        duration, ceus, level, resource_type, is_featured, sort_order, is_active,
        created_at, updated_at
      )
      VALUES (
        :id::uuid, :title, :slug, :description, :image_url, :link_url, :link_text,
        :duration, :ceus, :level, :resource_type, :is_featured, :sort_order, :is_active,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                title,
                slug: finalSlug,
                description: description || null,
                image_url: normalizeImageUrl(image_url) || image_url,
                link_url: finalLinkUrl,
                link_text: link_text || 'Learn More',
                duration: duration || null,
                ceus: ceus || null,
                level: level || null,
                resource_type: resource_type || 'course',
                is_featured: is_featured !== undefined ? is_featured : false,
                sort_order: sort_order !== undefined ? sort_order : 0,
                is_active: is_active !== undefined ? is_active : true,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        console.log('[createEducationResource] Insert result:', result);
        const createdResource = result[0] && result[0][0] ? result[0][0] : result[0];
        if (!createdResource) {
            throw new Error('Failed to create resource - no data returned');
        }
        // Add topics
        console.log('[createEducationResource] Topics received:', topics);
        if (topics && Array.isArray(topics) && topics.length > 0) {
            console.log('[createEducationResource] Adding topics:', topics);
            for (const topicId of topics) {
                console.log('[createEducationResource] Inserting topic:', topicId, 'for resource:', id);
                await database_1.default.query('INSERT INTO education_resource_topics (education_resource_id, topic_id) VALUES (:resource_id::uuid, :topic_id::uuid) ON CONFLICT DO NOTHING', {
                    replacements: { resource_id: id, topic_id: topicId },
                    type: sequelize_1.QueryTypes.INSERT,
                });
            }
        }
        else {
            console.log('[createEducationResource] No topics to add or topics is not an array');
        }
        // Add tags
        console.log('[createEducationResource] Tags received:', tags);
        if (tags && Array.isArray(tags) && tags.length > 0) {
            console.log('[createEducationResource] Adding tags:', tags);
            for (const tagId of tags) {
                console.log('[createEducationResource] Inserting tag:', tagId, 'for resource:', id);
                await database_1.default.query('INSERT INTO education_resource_tags (education_resource_id, tag_id) VALUES (:resource_id::uuid, :tag_id::uuid) ON CONFLICT DO NOTHING', {
                    replacements: { resource_id: id, tag_id: tagId },
                    type: sequelize_1.QueryTypes.INSERT,
                });
            }
        }
        else {
            console.log('[createEducationResource] No tags to add or tags is not an array');
        }
        // Fetch topics and tags for response
        const topicsQuery = `
      SELECT t.id, t.name, t.slug
      FROM topics t
      INNER JOIN education_resource_topics ert ON t.id = ert.topic_id
      WHERE ert.education_resource_id = :id::uuid
      ORDER BY t.name ASC
    `;
        const resourceTopics = await database_1.default.query(topicsQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const tagsQuery = `
      SELECT t.id, t.name, t.slug
      FROM tags t
      INNER JOIN education_resource_tags ert ON t.id = ert.tag_id
      WHERE ert.education_resource_id = :id::uuid
      ORDER BY t.name ASC
    `;
        const resourceTags = await database_1.default.query(tagsQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        createdResource.topics = resourceTopics || [];
        createdResource.tags = resourceTags || [];
        res.status(201).json({ success: true, data: createdResource });
    }
    catch (error) {
        console.error('[createEducationResource] Failed to create education resource:', error);
        console.error('[createEducationResource] Error message:', error?.message);
        console.error('[createEducationResource] Error code:', error?.code);
        console.error('[createEducationResource] Error detail:', error?.detail);
        console.error('[createEducationResource] Error stack:', error?.stack);
        res.status(500).json({
            success: false,
            error: error?.message || 'Failed to create education resource',
            details: process.env.NODE_ENV === 'development' ? {
                code: error?.code,
                detail: error?.detail,
                stack: error?.stack
            } : undefined
        });
    }
};
exports.createEducationResource = createEducationResource;
const updateEducationResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, image_url, link_url, link_text, duration, ceus, level, resource_type, is_featured, sort_order, is_active, topics, tags, } = req.body;
        // Normalize image_url if provided
        const normalizedImageUrl = image_url ? normalizeImageUrl(image_url) : undefined;
        // Handle slug update - generate if title changed but slug not provided
        let finalSlug = slug;
        if (title && !slug) {
            // If title changed but slug not provided, generate new slug
            const baseSlug = (0, slug_1.generateSlug)(title);
            const checkSlugUnique = async (s) => {
                const existing = await database_1.default.query('SELECT id FROM education_resources WHERE slug = :slug AND id != :id', { replacements: { slug: s, id }, type: sequelize_1.QueryTypes.SELECT });
                return !existing || existing.length === 0;
            };
            finalSlug = await (0, slug_1.generateUniqueSlug)(baseSlug, checkSlugUnique);
        }
        // Auto-update link_url from slug if link_url not provided
        let finalLinkUrl = link_url;
        if (link_url === undefined || link_url === null || link_url === '') {
            // If link_url is not provided, generate from slug
            if (finalSlug) {
                finalLinkUrl = `/education/${finalSlug}`;
            }
            else {
                // Get current slug from DB if slug is not being updated
                const currentResource = await database_1.default.query('SELECT slug FROM education_resources WHERE id = :id::uuid', { replacements: { id }, type: sequelize_1.QueryTypes.SELECT });
                if (currentResource && currentResource.length > 0 && currentResource[0].slug) {
                    finalLinkUrl = `/education/${currentResource[0].slug}`;
                }
            }
        }
        const updates = [
            'title = COALESCE(:title, title)',
        ];
        const replacements = {
            id,
            title: title || null,
        };
        // Add slug update if provided
        if (finalSlug) {
            updates.push('slug = :slug');
            replacements.slug = finalSlug;
        }
        // Add image_url update if provided
        if (normalizedImageUrl !== undefined) {
            updates.push('image_url = :image_url');
            replacements.image_url = normalizedImageUrl;
        }
        // Add link_url update if provided or auto-generated
        if (finalLinkUrl !== undefined) {
            updates.push('link_url = :link_url');
            replacements.link_url = finalLinkUrl;
        }
        // Add remaining fields
        updates.push('description = :description', 'link_text = COALESCE(:link_text, link_text)', 'duration = :duration', 'ceus = :ceus', 'level = :level', 'resource_type = COALESCE(:resource_type, resource_type)', 'is_featured = :is_featured', 'sort_order = COALESCE(:sort_order, sort_order)', 'is_active = :is_active', 'updated_at = CURRENT_TIMESTAMP');
        replacements.description = description || null;
        replacements.link_text = link_text || null;
        replacements.duration = duration || null;
        replacements.ceus = ceus || null;
        replacements.level = level || null;
        replacements.resource_type = resource_type || null;
        replacements.is_featured = is_featured !== undefined ? is_featured : null;
        replacements.sort_order = sort_order !== undefined ? sort_order : null;
        replacements.is_active = is_active !== undefined ? is_active : null;
        const query = `
      UPDATE education_resources
      SET ${updates.join(', ')}
      WHERE id = :id::uuid
      RETURNING *
    `;
        console.log('[updateEducationResource] Executing UPDATE query with replacements:', Object.keys(replacements));
        const result = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE,
        });
        console.log('[updateEducationResource] Update result:', result);
        // Sequelize UPDATE with RETURNING returns [affectedRows, [rows]]
        const updatedResource = result[0] && result[0].length > 0 ? result[0][0] : null;
        if (!updatedResource) {
            // Check if resource exists
            const checkQuery = 'SELECT id FROM education_resources WHERE id = :id::uuid';
            const checkResult = await database_1.default.query(checkQuery, {
                replacements: { id },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (!checkResult || checkResult.length === 0) {
                return res.status(404).json({ success: false, error: 'Education resource not found' });
            }
            // Resource exists but update didn't return data, fetch it
            const fullResource = await getFullEducationResource(id);
            if (!fullResource) {
                return res.status(404).json({ success: false, error: 'Education resource not found' });
            }
            // Continue with fullResource instead
        }
        // Update topics if provided
        if (topics !== undefined) {
            console.log('[updateEducationResource] Updating topics:', topics);
            // Delete existing topics
            await database_1.default.query('DELETE FROM education_resource_topics WHERE education_resource_id = :resource_id::uuid', {
                replacements: { resource_id: id },
                type: sequelize_1.QueryTypes.DELETE,
            });
            // Add new topics
            if (Array.isArray(topics) && topics.length > 0) {
                for (const topicId of topics) {
                    console.log('[updateEducationResource] Adding topic:', topicId);
                    await database_1.default.query('INSERT INTO education_resource_topics (education_resource_id, topic_id) VALUES (:resource_id::uuid, :topic_id::uuid) ON CONFLICT DO NOTHING', {
                        replacements: { resource_id: id, topic_id: topicId },
                        type: sequelize_1.QueryTypes.INSERT,
                    });
                }
            }
        }
        else {
            console.log('[updateEducationResource] Topics not provided, skipping update');
        }
        // Update tags if provided
        if (tags !== undefined) {
            console.log('[updateEducationResource] Updating tags:', tags);
            // Delete existing tags
            await database_1.default.query('DELETE FROM education_resource_tags WHERE education_resource_id = :resource_id::uuid', {
                replacements: { resource_id: id },
                type: sequelize_1.QueryTypes.DELETE,
            });
            // Add new tags
            if (Array.isArray(tags) && tags.length > 0) {
                for (const tagId of tags) {
                    console.log('[updateEducationResource] Adding tag:', tagId);
                    await database_1.default.query('INSERT INTO education_resource_tags (education_resource_id, tag_id) VALUES (:resource_id::uuid, :tag_id::uuid) ON CONFLICT DO NOTHING', {
                        replacements: { resource_id: id, tag_id: tagId },
                        type: sequelize_1.QueryTypes.INSERT,
                    });
                }
            }
        }
        else {
            console.log('[updateEducationResource] Tags not provided, skipping update');
        }
        // Fetch updated resource with topics and tags
        const fullResource = await getFullEducationResource(id);
        if (!fullResource) {
            return res.status(404).json({ success: false, error: 'Education resource not found after update' });
        }
        res.json({ success: true, data: fullResource });
    }
    catch (error) {
        console.error('[updateEducationResource] Failed to update education resource:', error);
        console.error('[updateEducationResource] Error message:', error?.message);
        console.error('[updateEducationResource] Error code:', error?.code);
        console.error('[updateEducationResource] Error detail:', error?.detail);
        console.error('[updateEducationResource] Error stack:', error?.stack);
        res.status(500).json({
            success: false,
            error: error?.message || 'Failed to update education resource',
            details: process.env.NODE_ENV === 'development' ? {
                code: error?.code,
                detail: error?.detail,
                stack: error?.stack
            } : undefined
        });
    }
};
exports.updateEducationResource = updateEducationResource;
const deleteEducationResource = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM education_resources WHERE id = :id::uuid RETURNING *';
        const result = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (!result[0] || result[0].length === 0) {
            return res.status(404).json({ success: false, error: 'Education resource not found' });
        }
        res.json({ success: true, message: 'Education resource deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete education resource:', error);
        res.status(500).json({ success: false, error: 'Failed to delete education resource' });
    }
};
exports.deleteEducationResource = deleteEducationResource;
//# sourceMappingURL=educationResourcesController.js.map