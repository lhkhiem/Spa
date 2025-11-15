// Brand controller
// Handles CRUD operations for brands

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const { featured_only, q } = req.query;

    const conditions: string[] = [];
    const replacements: Record<string, unknown> = {};

    if (featured_only === 'true') {
      conditions.push('b.is_featured = TRUE');
    }

    if (q && typeof q === 'string' && q.trim().length > 0) {
      conditions.push('(b.name ILIKE :search OR b.slug ILIKE :search)');
      replacements.search = `%${q.trim()}%`;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        b.*,
        a.url as logo_url,
        a.cdn_url as logo_cdn_url,
        a.format as logo_format,
        a.width as logo_width,
        a.height as logo_height
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      ${whereClause}
      ORDER BY b.name ASC
    `;

    const result: any = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        b.*,
        a.url as logo_url
      FROM brands b
      LEFT JOIN assets a ON b.logo_id = a.id
      WHERE b.id = :id
    `;

    const result: any = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch brand:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, logo_id, website, is_featured } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = uuidv4();
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const query = `
      INSERT INTO brands (id, name, slug, description, logo_id, website, is_featured)
      VALUES (:id, :name, :slug, :description, :logo_id, :website, :is_featured)
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: {
        id,
        name,
        slug: generatedSlug,
        description: description || null,
        logo_id: logo_id || null,
        website: website || null,
        is_featured: is_featured ?? false,
      },
      type: QueryTypes.INSERT
    });

    res.status(201).json(result[0][0]);
  } catch (error) {
    console.error('Failed to create brand:', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, logo_id, website, is_featured } = req.body;

    const query = `
      UPDATE brands
      SET 
        name = COALESCE(:name, name),
        slug = COALESCE(:slug, slug),
        description = COALESCE(:description, description),
        logo_id = COALESCE(:logo_id, logo_id),
        website = COALESCE(:website, website),
        is_featured = COALESCE(:is_featured, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: { 
        id, 
        name: name ?? null, 
        slug: slug ?? null, 
        description: description !== undefined ? description : null, 
        logo_id: logo_id !== undefined ? logo_id : null, 
        website: website ?? null,
        is_featured: is_featured !== undefined ? is_featured : null,
      },
      type: QueryTypes.UPDATE
    });

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json(result[0][0]);
  } catch (error) {
    console.error('Failed to update brand:', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result: any = await sequelize.query(
      'DELETE FROM brands WHERE id = :id RETURNING *',
      {
        replacements: { id },
        type: QueryTypes.DELETE
      }
    );

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Failed to delete brand:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};
