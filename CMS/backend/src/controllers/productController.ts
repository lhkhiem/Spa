// Product controller
// Handles CRUD operations for products
// Uses raw SQL queries via Sequelize for complex joins

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';
import sequelize from '../config/database';
import { generateSlug } from '../utils/slug';
import { logActivity } from './activityLogController';

// Get all products with filters and pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      pageSize = 20, 
      status, 
      category_id,
      brand_id,
      q 
    } = req.query;
    
    const offset = ((page as any) - 1) * (pageSize as any);
    const limit = pageSize as any;

    const whereConditions: string[] = [];
    const replacements: any = { limit, offset };
    let joinClause = '';

    if (status) {
      whereConditions.push(`p.status = :status`);
      replacements.status = status;
    }

    // Filter by category using junction table (n-n relationship)
    if (category_id) {
      joinClause = `INNER JOIN product_product_categories ppc ON p.id = ppc.product_id`;
      whereConditions.push(`ppc.category_id = :category_id`);
      replacements.category_id = category_id;
    }

    if (brand_id) {
      whereConditions.push(`p.brand_id = :brand_id`);
      replacements.brand_id = brand_id;
    }

    if (q) {
      whereConditions.push(`(p.name ILIKE :search OR p.description ILIKE :search OR p.sku ILIKE :search)`);
      replacements.search = `%${q}%`;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      ${joinClause}
      ${whereClause}
    `;
    const countResult: any = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    const total = parseInt(countResult[0].total);

    // Get products with related data
    const query = `
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url,
        a.sizes as thumbnail_sizes
      FROM products p
      ${joinClause}
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT :limit OFFSET :offset
    `;

    const result: any = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Load categories for each product (n-n relationship)
    for (const product of result) {
      const categoriesQuery = `
        SELECT c.id, c.name, c.slug
        FROM product_categories c
        JOIN product_product_categories ppc ON c.id = ppc.category_id
        WHERE ppc.product_id = :product_id
        ORDER BY c.name ASC
      `;
      const categoriesResult: any = await sequelize.query(categoriesQuery, {
        replacements: { product_id: product.id },
        type: QueryTypes.SELECT
      });
      product.categories = categoriesResult;
    }

    res.json({
      data: result,
      total,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
      totalPages: Math.ceil(total / (pageSize as any))
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID with all related data
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.id = :id
    `;

    const result: any = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result[0];

    // Get product categories (n-n relationship)
    const categoriesQuery = `
      SELECT c.id, c.name, c.slug
      FROM product_categories c
      JOIN product_product_categories ppc ON c.id = ppc.category_id
      WHERE ppc.product_id = :id
      ORDER BY c.name ASC
    `;
    const categoriesResult: any = await sequelize.query(categoriesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    product.categories = categoriesResult;

    // Get product images
    const imagesQuery = `
      SELECT pi.*, a.url, a.width, a.height, a.format
      FROM product_images pi
      JOIN assets a ON pi.asset_id = a.id
      WHERE pi.product_id = :id
      ORDER BY pi.sort_order ASC
    `;
    const imagesResult: any = await sequelize.query(imagesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    product.images = imagesResult;

    // Get product attributes
    const attributesQuery = `
      SELECT * FROM product_attributes
      WHERE product_id = :id
      ORDER BY name ASC
    `;
    const attributesResult: any = await sequelize.query(attributesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });
    product.attributes = attributesResult;

    res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log('[createProduct] Request body:', JSON.stringify(req.body, null, 2));
    const {
      name,
      slug,
      description,
      content,
      categories, // Array of category IDs for n-n relationship (required, no direct category_id)
      brand_id,
      sku,
      price,
      compare_price,
      cost_price,
      stock,
      status,
      is_featured,
      is_best_seller,
      thumbnail_id,
      seo,
      images,
      attributes
    } = req.body;

    // Validate required fields
    if (!name || price === undefined) {
      console.error('[createProduct] Validation failed: missing name or price');
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const id = uuidv4();
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const query = `
      INSERT INTO products (
        id, name, slug, description, content, brand_id,
        sku, price, compare_price, cost_price, stock, status,
        is_featured, is_best_seller, thumbnail_id, seo
      )
      VALUES (
        :id, :name, :slug, :description, :content, :brand_id,
        :sku, :price, :compare_price, :cost_price, :stock, :status,
        :is_featured, :is_best_seller, :thumbnail_id, :seo
      )
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: {
        id,
        name,
        slug: generatedSlug,
        description: description || null,
        content: content ? JSON.stringify(content) : null,
        brand_id: brand_id || null,
        sku: sku || null,
        price: Math.round(price), // Round to integer for VNĐ (no decimals)
        compare_price: compare_price ? Math.round(compare_price) : null,
        cost_price: cost_price ? Math.round(cost_price) : null,
        stock: stock || 0,
        status: status || 'draft',
        is_featured: is_featured ?? false,
        is_best_seller: is_best_seller ?? false,
        thumbnail_id: thumbnail_id || null,
        seo: seo ? JSON.stringify(seo) : null
      },
      type: QueryTypes.INSERT
    });

    const product = result[0][0];

    // Add product categories (n-n relationship)
    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        const catQuery = `
          INSERT INTO product_product_categories (product_id, category_id)
          VALUES (:product_id, :category_id)
          ON CONFLICT DO NOTHING
        `;
        await sequelize.query(catQuery, {
          replacements: {
            product_id: id,
            category_id: categoryId
          },
          type: QueryTypes.INSERT
        });
      }
    }

    // Add product images if provided (expecting array of asset IDs)
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const assetId = typeof images[i] === 'string' ? images[i] : images[i].asset_id;
        const imgQuery = `
          INSERT INTO product_images (id, product_id, asset_id, sort_order)
          VALUES (:img_id, :product_id, :asset_id, :sort_order)
        `;
        await sequelize.query(imgQuery, {
          replacements: {
            img_id: uuidv4(),
            product_id: id,
            asset_id: assetId,
            sort_order: i
          },
          type: QueryTypes.INSERT
        });
      }
    }

    // Add product attributes if provided
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        const attrQuery = `
          INSERT INTO product_attributes (id, product_id, name, value)
          VALUES (:attr_id, :product_id, :name, :value)
        `;
        await sequelize.query(attrQuery, {
          replacements: {
            attr_id: uuidv4(),
            product_id: id,
            name: attr.name,
            value: attr.value
          },
          type: QueryTypes.INSERT
        });
      }
    }

    // Log activity
    await logActivity(req, 'create', 'product', id, name, `Created product "${name}"`);

    res.status(201).json(product);
  } catch (error: any) {
    console.error('[createProduct] Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log('[updateProduct] Request body:', JSON.stringify(req.body, null, 2));
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      content,
      categories, // Array of category IDs for n-n relationship (required, no direct category_id)
      brand_id,
      sku,
      price,
      compare_price,
      cost_price,
      stock,
      status,
      is_featured,
      is_best_seller,
      thumbnail_id,
      seo,
      images,
      attributes
    } = req.body;

    // Build dynamic update query based on provided fields
    const updateFields: string[] = [];
    const replacements: any = { id };

    if (name !== undefined) {
      updateFields.push('name = :name');
      replacements.name = name;
    }
    if (slug !== undefined) {
      updateFields.push('slug = :slug');
      replacements.slug = slug;
    }
    if (description !== undefined) {
      updateFields.push('description = :description');
      replacements.description = description;
    }
    if (content !== undefined) {
      updateFields.push('content = :content');
      replacements.content = content ? JSON.stringify(content) : null;
    }
    // category_id is deprecated - use categories array (many-to-many) instead
    // if (category_id !== undefined) {
    //   updateFields.push('category_id = :category_id');
    //   replacements.category_id = category_id;
    // }
    if (brand_id !== undefined) {
      updateFields.push('brand_id = :brand_id');
      replacements.brand_id = brand_id;
    }
    if (sku !== undefined) {
      updateFields.push('sku = :sku');
      replacements.sku = sku;
    }
    if (price !== undefined) {
      updateFields.push('price = :price');
      replacements.price = Math.round(price); // Round to integer for VNĐ
    }
    if (compare_price !== undefined) {
      updateFields.push('compare_price = :compare_price');
      replacements.compare_price = compare_price ? Math.round(compare_price) : null;
    }
    if (cost_price !== undefined) {
      updateFields.push('cost_price = :cost_price');
      replacements.cost_price = cost_price ? Math.round(cost_price) : null;
    }
    if (stock !== undefined) {
      updateFields.push('stock = :stock');
      replacements.stock = stock;
    }
    if (status !== undefined) {
      updateFields.push('status = :status');
      replacements.status = status;
    }
    if (is_featured !== undefined) {
      updateFields.push('is_featured = :is_featured');
      replacements.is_featured = is_featured;
    }
    if (is_best_seller !== undefined) {
      updateFields.push('is_best_seller = :is_best_seller');
      replacements.is_best_seller = is_best_seller;
    }
    if (thumbnail_id !== undefined) {
      updateFields.push('thumbnail_id = :thumbnail_id');
      replacements.thumbnail_id = thumbnail_id;
    }
    if (seo !== undefined) {
      updateFields.push('seo = :seo');
      replacements.seo = seo ? JSON.stringify(seo) : null;
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    if (updateFields.length === 1) {
      // Only updated_at, nothing to update
      return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `
      UPDATE products
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements,
      type: QueryTypes.UPDATE
    });

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update categories (n-n relationship) if provided
    if (categories !== undefined) {
      // Delete existing category associations
      await sequelize.query('DELETE FROM product_product_categories WHERE product_id = :id', {
        replacements: { id },
        type: QueryTypes.DELETE
      });
      
      // Add new category associations
      if (categories.length > 0) {
        for (const categoryId of categories) {
          const catQuery = `
            INSERT INTO product_product_categories (product_id, category_id)
            VALUES (:product_id, :category_id)
            ON CONFLICT DO NOTHING
          `;
          await sequelize.query(catQuery, {
            replacements: {
              product_id: id,
              category_id: categoryId
            },
            type: QueryTypes.INSERT
          });
        }
      }
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await sequelize.query('DELETE FROM product_images WHERE product_id = :id', {
        replacements: { id },
        type: QueryTypes.DELETE
      });
      
      // Add new images (expecting array of asset IDs)
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const assetId = typeof images[i] === 'string' ? images[i] : images[i].asset_id;
          const imgQuery = `
            INSERT INTO product_images (id, product_id, asset_id, sort_order)
            VALUES (:img_id, :product_id, :asset_id, :sort_order)
          `;
          await sequelize.query(imgQuery, {
            replacements: {
              img_id: uuidv4(),
              product_id: id,
              asset_id: assetId,
              sort_order: i
            },
            type: QueryTypes.INSERT
          });
        }
      }
    }

    // Update attributes if provided
    if (attributes !== undefined) {
      // Delete existing attributes
      await sequelize.query('DELETE FROM product_attributes WHERE product_id = :id', {
        replacements: { id },
        type: QueryTypes.DELETE
      });
      
      // Add new attributes
      if (attributes.length > 0) {
        for (const attr of attributes) {
          const attrQuery = `
            INSERT INTO product_attributes (id, product_id, name, value)
            VALUES (:attr_id, :product_id, :name, :value)
          `;
          await sequelize.query(attrQuery, {
            replacements: {
              attr_id: uuidv4(),
              product_id: id,
              name: attr.name,
              value: attr.value
            },
            type: QueryTypes.INSERT
          });
        }
      }
    }

    const updatedProduct = result[0][0];
    
    // Log activity
    await logActivity(req, 'update', 'product', id, updatedProduct.name, `Updated product "${updatedProduct.name}"`);

    res.json(updatedProduct);
  } catch (error: any) {
    console.error('[updateProduct] Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result: any = await sequelize.query(
      'DELETE FROM products WHERE id = :id RETURNING *',
      {
        replacements: { id },
        type: QueryTypes.DELETE
      }
    );

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = result[0][0];
    
    // Log activity (don't fail if logging fails)
    try {
      await logActivity(req, 'delete', 'product', id, deletedProduct.name, `Deleted product "${deletedProduct.name}"`);
    } catch (logError) {
      console.error('Failed to log activity for product deletion:', logError);
      // Continue anyway - product is already deleted
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Publish product
export const publishProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE products
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING *
    `;

    const result: any = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.UPDATE
    });

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result[0][0]);
  } catch (error) {
    console.error('Failed to publish product:', error);
    res.status(500).json({ error: 'Failed to publish product' });
  }
};

// Duplicate product
export const duplicateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get original product with all related data
    const productQuery = `
      SELECT * FROM products WHERE id = :id
    `;
    const productResult: any = await sequelize.query(productQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (productResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const originalProduct = productResult[0];

    // Generate new name and slug
    const baseName = originalProduct.name;
    let newName = `${baseName} (Copy)`;
    let baseSlug = generateSlug(baseName) || `product-${Date.now()}`;
    let newSlug = `${baseSlug}-copy`;

    // Ensure unique slug
    let counter = 1;
    while (true) {
      const existing = await sequelize.query(
        'SELECT id FROM products WHERE slug = :slug LIMIT 1',
        { replacements: { slug: newSlug }, type: QueryTypes.SELECT }
      );
      if ((existing as any[]).length === 0) break;
      newSlug = `${baseSlug}-copy-${counter++}`;
      newName = `${baseName} (Copy ${counter > 1 ? counter : ''})`.trim();
    }

    // Generate new SKU (if original has SKU)
    let newSku: string | null = null;
    if (originalProduct.sku) {
      const skuBase = originalProduct.sku;
      let skuCounter = 1;
      newSku = `${skuBase}-COPY`;
      while (true) {
        const existing = await sequelize.query(
          'SELECT id FROM products WHERE sku = :sku LIMIT 1',
          { replacements: { sku: newSku }, type: QueryTypes.SELECT }
        );
        if ((existing as any[]).length === 0) break;
        newSku = `${skuBase}-COPY${skuCounter++}`;
      }
    }

    // Create new product
    const newId = uuidv4();
    const insertQuery = `
      INSERT INTO products (
        id, name, slug, description, content, brand_id,
        sku, price, compare_price, cost_price, stock, status,
        is_featured, is_best_seller, thumbnail_id, seo
      )
      VALUES (
        :id, :name, :slug, :description, :content, :brand_id,
        :sku, :price, :compare_price, :cost_price, :stock, :status,
        :is_featured, :is_best_seller, :thumbnail_id, :seo
      )
      RETURNING *
    `;

    const insertResult: any = await sequelize.query(insertQuery, {
      replacements: {
        id: newId,
        name: newName,
        slug: newSlug,
        description: originalProduct.description,
        content: originalProduct.content,
        brand_id: originalProduct.brand_id,
        sku: newSku,
        price: originalProduct.price,
        compare_price: originalProduct.compare_price,
        cost_price: originalProduct.cost_price,
        stock: originalProduct.stock || 0,
        status: 'draft', // Always set to draft for copied products
        is_featured: false, // Reset flags
        is_best_seller: false,
        thumbnail_id: originalProduct.thumbnail_id,
        seo: originalProduct.seo
      },
      type: QueryTypes.INSERT
    });

    const newProduct = insertResult[0][0];

    // Copy categories (n-n relationship)
    const categoriesQuery = `
      SELECT category_id FROM product_product_categories WHERE product_id = :id
    `;
    const categoriesResult: any = await sequelize.query(categoriesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (categoriesResult.length > 0) {
      for (const cat of categoriesResult) {
        await sequelize.query(
          'INSERT INTO product_product_categories (product_id, category_id) VALUES (:product_id, :category_id) ON CONFLICT DO NOTHING',
          {
            replacements: {
              product_id: newId,
              category_id: cat.category_id
            },
            type: QueryTypes.INSERT
          }
        );
      }
    }

    // Copy images
    const imagesQuery = `
      SELECT asset_id, sort_order FROM product_images WHERE product_id = :id ORDER BY sort_order ASC
    `;
    const imagesResult: any = await sequelize.query(imagesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (imagesResult.length > 0) {
      for (let i = 0; i < imagesResult.length; i++) {
        const img = imagesResult[i];
        await sequelize.query(
          'INSERT INTO product_images (id, product_id, asset_id, sort_order) VALUES (:img_id, :product_id, :asset_id, :sort_order)',
          {
            replacements: {
              img_id: uuidv4(),
              product_id: newId,
              asset_id: img.asset_id,
              sort_order: img.sort_order || i
            },
            type: QueryTypes.INSERT
          }
        );
      }
    }

    // Copy attributes
    const attributesQuery = `
      SELECT name, value FROM product_attributes WHERE product_id = :id
    `;
    const attributesResult: any = await sequelize.query(attributesQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (attributesResult.length > 0) {
      for (const attr of attributesResult) {
        await sequelize.query(
          'INSERT INTO product_attributes (id, product_id, name, value) VALUES (:attr_id, :product_id, :name, :value)',
          {
            replacements: {
              attr_id: uuidv4(),
              product_id: newId,
              name: attr.name,
              value: attr.value
            },
            type: QueryTypes.INSERT
          }
        );
      }
    }

    // Return the new product with related data (similar to getProductById)
    const fullProductQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.id = :id
    `;
    const fullProductResult: any = await sequelize.query(fullProductQuery, {
      replacements: { id: newId },
      type: QueryTypes.SELECT
    });

    const fullProduct = fullProductResult[0];

    // Log activity
    await logActivity(req, 'duplicate', 'product', newId, newName, `Duplicated product from "${originalProduct.name}"`);

    // Load categories
    const newCategoriesQuery = `
      SELECT c.id, c.name, c.slug
      FROM product_categories c
      JOIN product_product_categories ppc ON c.id = ppc.category_id
      WHERE ppc.product_id = :id
      ORDER BY c.name ASC
    `;
    const newCategoriesResult: any = await sequelize.query(newCategoriesQuery, {
      replacements: { id: newId },
      type: QueryTypes.SELECT
    });
    fullProduct.categories = newCategoriesResult;

    // Load images
    const newImagesQuery = `
      SELECT pi.*, a.url, a.width, a.height, a.format
      FROM product_images pi
      JOIN assets a ON pi.asset_id = a.id
      WHERE pi.product_id = :id
      ORDER BY pi.sort_order ASC
    `;
    const newImagesResult: any = await sequelize.query(newImagesQuery, {
      replacements: { id: newId },
      type: QueryTypes.SELECT
    });
    fullProduct.images = newImagesResult;

    // Load attributes
    const newAttributesQuery = `
      SELECT * FROM product_attributes
      WHERE product_id = :id
      ORDER BY name ASC
    `;
    const newAttributesResult: any = await sequelize.query(newAttributesQuery, {
      replacements: { id: newId },
      type: QueryTypes.SELECT
    });
    fullProduct.attributes = newAttributesResult;

    res.status(201).json(fullProduct);
  } catch (error: any) {
    console.error('Failed to duplicate product:', error);
    res.status(500).json({ error: 'Failed to duplicate product', message: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.is_featured = TRUE AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT :limit
    `;

    const result: any = await sequelize.query(query, {
      replacements: { limit: parseInt(limit as string) },
      type: QueryTypes.SELECT
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
};

// Get best sellers
export const getBestSellers = async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        a.url as thumbnail_url
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN assets a ON p.thumbnail_id = a.id
      WHERE p.is_best_seller = TRUE AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT :limit
    `;

    const result: any = await sequelize.query(query, {
      replacements: { limit: parseInt(limit as string) },
      type: QueryTypes.SELECT
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch best sellers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch best sellers' });
  }
};

type ProductImportRow = {
  name?: unknown;
  slug?: unknown;
  sku?: unknown;
  price?: unknown;
  compare_price?: unknown;
  cost_price?: unknown;
  stock?: unknown;
  status?: unknown;
  is_featured?: unknown;
  is_best_seller?: unknown;
  [key: string]: unknown;
};

const allowedStatuses = new Set(['draft', 'published', 'archived']);

const parseNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y', 'on', 'x'].includes(normalized);
  }
  return false;
};

const slugExists = async (slug: string): Promise<boolean> => {
  const existing = await sequelize.query(
    `SELECT id FROM products WHERE slug = :slug LIMIT 1`,
    { replacements: { slug }, type: QueryTypes.SELECT }
  );
  return (existing as any[]).length > 0;
};

// Local function for product slug generation with cache
const ensureUniqueProductSlug = async (initial: string, cache: Set<string>) => {
  let base = generateSlug(initial);
  if (!base) {
    base = `product-${Date.now()}`;
  }

  let candidate = base;
  let counter = 1;

  while (cache.has(candidate) || (await slugExists(candidate))) {
    candidate = `${base}-${counter++}`;
  }

  cache.add(candidate);
  return candidate;
};

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const importProducts = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    } catch (error) {
      console.error('Failed to parse Excel file:', error);
      return res.status(400).json({ error: 'Invalid Excel file' });
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ error: 'Excel file does not contain any sheet' });
    }

    const rows = XLSX.utils.sheet_to_json<ProductImportRow>(
      workbook.Sheets[sheetName],
      { defval: null, raw: false }
    );

    if (!rows.length) {
      return res.status(400).json({ error: 'Excel sheet is empty' });
    }

    const errors: Array<{ row: number; message: string }> = [];
    let successCount = 0;
    const slugCache = new Set<string>();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2; // header row is 1

      try {
        const name = (row.name ?? row.Name ?? '').toString().trim();
        if (!name) {
          throw new Error('Column "name" is required');
        }

        const priceValue = parseNumber(row.price ?? (row as any).Price);
        if (priceValue === null) {
          throw new Error('Column "price" is required');
        }

        let slugValue = (row.slug ?? (row as any).Slug ?? '').toString().trim();
        if (!slugValue) {
          slugValue = name;
        }
        slugValue = await ensureUniqueProductSlug(slugValue, slugCache);

        let skuValue = row.sku ?? (row as any).SKU ?? null;
        if (skuValue !== null && skuValue !== undefined) {
          skuValue = skuValue.toString().trim();
          if (skuValue === '') {
            skuValue = null;
          }
        }

        if (skuValue) {
          const existingSku = await sequelize.query(
            `SELECT id FROM products WHERE sku = :sku LIMIT 1`,
            { replacements: { sku: skuValue }, type: QueryTypes.SELECT }
          );
          if ((existingSku as any[]).length > 0) {
            throw new Error(`SKU "${skuValue}" already exists`);
          }
        }

        const comparePrice = parseNumber(row.compare_price ?? (row as any).comparePrice ?? (row as any).Compare_Price);
        const costPrice = parseNumber(row.cost_price ?? (row as any).costPrice ?? (row as any).Cost_Price);
        const stockValue = parseNumber(row.stock ?? (row as any).Stock);
        const statusRaw = (row.status ?? (row as any).Status ?? '').toString().trim().toLowerCase();
        const statusValue = allowedStatuses.has(statusRaw) ? statusRaw : 'draft';
        const isFeatured = parseBoolean(row.is_featured ?? (row as any).Is_Featured);
        const isBestSeller = parseBoolean(row.is_best_seller ?? (row as any).Is_Best_Seller);

        const id = uuidv4();

        await sequelize.query(
          `
            INSERT INTO products (
              id,
              name,
              slug,
              sku,
              description,
              price,
              compare_price,
              cost_price,
              stock,
              status,
              is_featured,
              is_best_seller,
              created_at,
              updated_at
            )
            VALUES (
              :id,
              :name,
              :slug,
              :sku,
              :description,
              :price,
              :compare_price,
              :cost_price,
              :stock,
              :status,
              :is_featured,
              :is_best_seller,
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
            )
          `,
          {
            replacements: {
              id,
              name,
              slug: slugValue,
              sku: skuValue || null,
              description: null,
              price: priceValue,
              compare_price: comparePrice ?? null,
              cost_price: costPrice ?? null,
              stock: stockValue !== null ? Math.max(0, Math.floor(stockValue)) : 0,
              status: statusValue,
              is_featured: isFeatured,
              is_best_seller: isBestSeller
            },
            type: QueryTypes.INSERT
          }
        );

        successCount += 1;
      } catch (error: any) {
        errors.push({
          row: rowNumber,
          message: error?.message ?? 'Unexpected error'
        });
      }
    }

    res.json({
      successCount,
      failureCount: errors.length,
      errors
    });
  } catch (error) {
    console.error('Failed to import products:', error);
    res.status(500).json({ error: 'Failed to import products' });
  }
};
