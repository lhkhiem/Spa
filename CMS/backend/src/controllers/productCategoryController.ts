// Product Category controller
// Handles CRUD operations for product categories

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { featured_only } = req.query;

    let whereClause = '';
    if (featured_only === 'true') {
      whereClause = 'WHERE c.is_featured = TRUE';
    }

    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.parent_id,
        c.is_featured,
        c.created_at,
        c.updated_at,
        pc.name as parent_name,
        COALESCE(a.cdn_url, a.url) as image_url,
        COUNT(DISTINCT ppc.product_id) AS product_count
      FROM product_categories c
      LEFT JOIN product_categories pc ON c.parent_id = pc.id
      LEFT JOIN assets a ON c.image_id = a.id
      LEFT JOIN product_product_categories ppc ON ppc.category_id = c.id
      LEFT JOIN products p ON p.id = ppc.product_id AND p.status = 'published'
      ${whereClause}
      GROUP BY
        c.id,
        c.name,
        c.slug,
        c.description,
        c.parent_id,
        c.is_featured,
        c.created_at,
        c.updated_at,
        pc.name,
        a.cdn_url,
        a.url
      ORDER BY c.name ASC
    `;

    const result: any = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    res.json({ data: result });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.*,
        pc.name as parent_name,
        a.url as image_url
      FROM product_categories c
      LEFT JOIN product_categories pc ON c.parent_id = pc.id
      LEFT JOIN assets a ON c.image_id = a.id
      WHERE c.id = :id
    `;

    const result: any = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.parent_id,
        c.is_featured,
        c.created_at,
        c.updated_at,
        pc.name as parent_name,
        COALESCE(a.cdn_url, a.url) as image_url,
        COUNT(DISTINCT ppc.product_id) AS product_count
      FROM product_categories c
      LEFT JOIN product_categories pc ON c.parent_id = pc.id
      LEFT JOIN assets a ON c.image_id = a.id
      LEFT JOIN product_product_categories ppc ON ppc.category_id = c.id
      LEFT JOIN products p ON p.id = ppc.product_id AND p.status = 'published'
      WHERE c.slug = :slug
      GROUP BY
        c.id,
        c.name,
        c.slug,
        c.description,
        c.parent_id,
        c.is_featured,
        c.created_at,
        c.updated_at,
        pc.name,
        a.cdn_url,
        a.url
    `;

    const result: any = await sequelize.query(query, {
      replacements: { slug },
      type: QueryTypes.SELECT,
    });

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch category by slug:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, parent_id, description, image_id, is_featured } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = uuidv4();
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const query = `
      INSERT INTO product_categories (id, name, slug, parent_id, description, image_id, is_featured)
      VALUES (:id, :name, :slug, :parent_id, :description, :image_id, :is_featured)
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: {
        id,
        name,
        slug: generatedSlug,
        parent_id: parent_id || null,
        description: description || null,
        image_id: (image_id && image_id.trim() !== '') ? image_id : null,
        is_featured: is_featured || false
      },
      type: QueryTypes.INSERT
    });

    res.status(201).json(result[0][0]);
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, parent_id, description, image_id, is_featured } = req.body;

    const query = `
      UPDATE product_categories
      SET 
        name = COALESCE(:name, name),
        slug = COALESCE(:slug, slug),
        parent_id = :parent_id,
        description = COALESCE(:description, description),
        image_id = :image_id,
        is_featured = COALESCE(:is_featured, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: { 
        id, 
        name, 
        slug, 
        parent_id: parent_id || null, 
        description, 
        image_id: (image_id !== undefined && image_id !== null && String(image_id).trim() !== '') ? String(image_id) : null,
        is_featured 
      },
      type: QueryTypes.UPDATE
    });

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result[0][0]);
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const checkCategoryRelationships = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check for products in this category (via category_id)
    const productsQuery = `
      SELECT COUNT(*) as count
      FROM products
      WHERE category_id = :id
    `;
    const productsResult: any = await sequelize.query(productsQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    const productsCount = parseInt(productsResult[0]?.count || '0', 10);

    // Check for products via many-to-many relationship
    const productsManyToManyQuery = `
      SELECT COUNT(*) as count
      FROM product_product_categories
      WHERE category_id = :id
    `;
    const productsManyToManyResult: any = await sequelize.query(productsManyToManyQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    const productsManyToManyCount = parseInt(productsManyToManyResult[0]?.count || '0', 10);

    const totalProducts = productsCount + productsManyToManyCount;

    // Check for subcategories (children)
    const subcategoriesQuery = `
      SELECT COUNT(*) as count
      FROM product_categories
      WHERE parent_id = :id
    `;
    const subcategoriesResult: any = await sequelize.query(subcategoriesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    const subcategoriesCount = parseInt(subcategoriesResult[0]?.count || '0', 10);

    res.json({
      hasRelationships: totalProducts > 0 || subcategoriesCount > 0,
      productsCount: totalProducts,
      subcategoriesCount,
      warnings: [
        totalProducts > 0 ? `This category is used by ${totalProducts} product(s)` : null,
        subcategoriesCount > 0 ? `This category has ${subcategoriesCount} subcategory(ies)` : null
      ].filter(Boolean)
    });
  } catch (error) {
    console.error('Failed to check category relationships:', error);
    res.status(500).json({ error: 'Failed to check category relationships' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Always check relationships - no force delete allowed
    const relationshipsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM products WHERE category_id = :id) as products_count,
        (SELECT COUNT(*) FROM product_product_categories WHERE category_id = :id) as products_m2m_count,
        (SELECT COUNT(*) FROM product_categories WHERE parent_id = :id) as subcategories_count
    `;
    const relationships: any = await sequelize.query(relationshipsQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    
    const relationshipsData = relationships[0];
    const totalProducts = parseInt(relationshipsData?.products_count || '0', 10) + 
                         parseInt(relationshipsData?.products_m2m_count || '0', 10);
    const subcategoriesCount = parseInt(relationshipsData?.subcategories_count || '0', 10);

    // Block delete if there are any relationships
    if (totalProducts > 0 || subcategoriesCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with active relationships',
        hasRelationships: true,
        productsCount: totalProducts,
        subcategoriesCount,
        warnings: [
          totalProducts > 0 ? `This category is used by ${totalProducts} product(s)` : null,
          subcategoriesCount > 0 ? `This category has ${subcategoriesCount} subcategory(ies)` : null
        ].filter(Boolean),
        instructions: {
          products: totalProducts > 0 ? 'Remove or reassign all products from this category first' : null,
          subcategories: subcategoriesCount > 0 ? 'Delete or reassign all subcategories first' : null
        }
      });
    }

    const result: any = await sequelize.query(
      'DELETE FROM product_categories WHERE id = :id RETURNING *',
      {
        replacements: { id },
        type: QueryTypes.DELETE
      }
    );

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
