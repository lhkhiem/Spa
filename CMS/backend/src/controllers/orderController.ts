// Order Controller
// Handles order creation, retrieval, and management

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

const numericOrderFields = [
  'subtotal',
  'tax_amount',
  'shipping_cost',
  'discount_amount',
  'total',
];

const normalizeOrderRow = (order: any) => {
  if (!order) return;
  numericOrderFields.forEach((field) => {
    if (order[field] !== undefined && order[field] !== null) {
      order[field] = Number(order[field]);
    }
  });
  if (order.payment_status) {
    order.payment_status = String(order.payment_status);
  }
  if (order.status) {
    order.status = String(order.status);
  }
  return order;
};

const normalizeOrderItem = (item: any) => {
  if (!item) return item;
  const normalized: any = { ...item };
  if (normalized.quantity !== undefined && normalized.quantity !== null) {
    normalized.quantity = Number(normalized.quantity);
  }
  if (normalized.unit_price !== undefined && normalized.unit_price !== null) {
    normalized.unit_price = Number(normalized.unit_price);
  }
  const total =
    normalized.total_price !== undefined && normalized.total_price !== null
      ? normalized.total_price
      : normalized.subtotal ?? normalized.unit_price * normalized.quantity;
  if (total !== undefined && total !== null) {
    normalized.total_price = Number(total);
  }
  if (normalized.subtotal !== undefined && normalized.subtotal !== null) {
    normalized.subtotal = Number(normalized.subtotal);
  }
  if (normalized.variant_info) {
    if (typeof normalized.variant_info === 'string') {
      try {
        normalized.variant_info = JSON.parse(normalized.variant_info);
      } catch (error) {
        // keep original string
      }
    }
  }
  return normalized;
};

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Get all orders (admin) or user's orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { customer_id, status, page = 1, pageSize = 20 } = req.query;
    
    const whereConditions: string[] = [];
    const replacements: any = { 
      limit: Number(pageSize), 
      offset: (Number(page) - 1) * Number(pageSize) 
    };

    if (customer_id) {
      whereConditions.push('o.customer_id = :customer_id');
      replacements.customer_id = customer_id;
    }

    if (status) {
      whereConditions.push('o.status = :status');
      replacements.status = status;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `;
    const countResult: any = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    const total = countResult[0].total;

    // Get orders
    const ordersQuery = `
      SELECT o.*
      FROM orders o
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
    const orders: any = await sequelize.query(ordersQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Get items for each order
    for (const order of orders) {
      const itemsQuery = `
        SELECT * FROM order_items
        WHERE order_id = :order_id
        ORDER BY created_at ASC
      `;
      const items: any = await sequelize.query(itemsQuery, {
        replacements: { order_id: order.id },
        type: QueryTypes.SELECT
      });
      order.items = items.map((item: any) => normalizeOrderItem(item));
      normalizeOrderRow(order);
    }

    res.json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize))
      }
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderQuery = `
      SELECT * FROM orders WHERE id = :id
    `;
    const orders: any = await sequelize.query(orderQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const itemsQuery = `
      SELECT * FROM order_items
      WHERE order_id = :order_id
      ORDER BY created_at ASC
    `;
    const items: any = await sequelize.query(itemsQuery, {
      replacements: { order_id: id },
      type: QueryTypes.SELECT
    });

    order.items = items.map((item: any) => normalizeOrderItem(item));
    normalizeOrderRow(order);

    res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Get order by order number
export const getOrderByNumber = async (req: Request, res: Response) => {
  try {
    const { order_number } = req.params;

    const orderQuery = `
      SELECT * FROM orders WHERE order_number = :order_number
    `;
    const orders: any = await sequelize.query(orderQuery, {
      replacements: { order_number },
      type: QueryTypes.SELECT
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const itemsQuery = `
      SELECT * FROM order_items
      WHERE order_id = :order_id
      ORDER BY created_at ASC
    `;
    const items: any = await sequelize.query(itemsQuery, {
      replacements: { order_id: order.id },
      type: QueryTypes.SELECT
    });

    order.items = items.map((item: any) => normalizeOrderItem(item));
    normalizeOrderRow(order);

    res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Create new order from cart
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      customer_email,
      customer_name,
      shipping_address,
      billing_address,
      shipping_method,
      payment_method,
      items, // Array of { product_id, quantity, variant_info }
      notes
    } = req.body;

    // Validation
    if (!customer_email || !customer_name || !shipping_address || !billing_address || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      const orderId = uuidv4();
      const orderNumber = generateOrderNumber();

      // Calculate totals from items
      let subtotal = 0;
      let taxAmount = 0;
      let shippingCost = 0;

      for (const item of items) {
        // Get product details
        const productQuery = `
          SELECT price, stock, name, sku, thumbnail_id
          FROM products
          WHERE id = :product_id AND status = 'published'
        `;
        const products: any = await sequelize.query(productQuery, {
          replacements: { product_id: item.product_id },
          type: QueryTypes.SELECT,
          transaction
        });

        if (!products || products.length === 0) {
          throw new Error(`Product ${item.product_id} not found or not available`);
        }

        const product = products[0];

        // Check stock
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
      }

      // TODO: Apply shipping rules, tax calculation, discounts
      // For now, default values
      shippingCost = 0;
      taxAmount = 0;

      const total = subtotal + taxAmount + shippingCost;

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          id, order_number, customer_id, customer_email, customer_name,
          shipping_address, billing_address,
          subtotal, tax_amount, shipping_cost, discount_amount, total,
          shipping_method, payment_method, payment_status, status, notes,
          created_at, updated_at
        )
        VALUES (
          :id, :order_number, :customer_id, :customer_email, :customer_name,
          :shipping_address::jsonb, :billing_address::jsonb,
          :subtotal, :tax_amount, :shipping_cost, :discount_amount, :total,
          :shipping_method, :payment_method, 'pending', 'pending', :notes,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *
      `;
      const newOrders: any = await sequelize.query(orderQuery, {
        replacements: {
          id: orderId,
          order_number: orderNumber,
          customer_id: customer_id || null,
          customer_email,
          customer_name,
          shipping_address: JSON.stringify(shipping_address),
          billing_address: JSON.stringify(billing_address),
          subtotal,
          tax_amount: taxAmount,
          shipping_cost: shippingCost,
          discount_amount: 0,
          total,
          shipping_method: shipping_method || null,
          payment_method,
          notes: notes || null
        },
        type: QueryTypes.INSERT,
        transaction
      });

      const order = newOrders[0];

      // Create order items and update stock
      for (const item of items) {
        // Get product details again
        const productQuery = `
          SELECT id, name, sku, price, thumbnail_id
          FROM products
          WHERE id = :product_id
        `;
        const products: any = await sequelize.query(productQuery, {
          replacements: { product_id: item.product_id },
          type: QueryTypes.SELECT,
          transaction
        });
        const product = products[0];

        const lineTotal = product.price * item.quantity;

        // Get thumbnail URL
        let thumbnailUrl = null;
        if (product.thumbnail_id) {
          const assetQuery = `
            SELECT url FROM assets WHERE id = :asset_id
          `;
          const assets: any = await sequelize.query(assetQuery, {
            replacements: { asset_id: product.thumbnail_id },
            type: QueryTypes.SELECT,
            transaction
          });
          if (assets && assets.length > 0) {
            thumbnailUrl = assets[0].url;
          }
        }

        const itemQuery = `
          INSERT INTO order_items (
            id, order_id, product_id, product_name, product_sku, product_image_url,
            quantity, unit_price, total_price, variant_info, created_at
          )
          VALUES (
            :id, :order_id, :product_id, :product_name, :product_sku, :product_image_url,
            :quantity, :unit_price, :total_price, :variant_info::jsonb, CURRENT_TIMESTAMP
          )
        `;
        await sequelize.query(itemQuery, {
          replacements: {
            id: uuidv4(),
            order_id: orderId,
            product_id: item.product_id,
            product_name: product.name,
            product_sku: product.sku,
            product_image_url: thumbnailUrl,
            quantity: item.quantity,
            unit_price: product.price,
            total_price: lineTotal,
            variant_info: JSON.stringify(item.variant_info || {})
          },
          type: QueryTypes.INSERT,
          transaction
        });

        // Update product stock
        const stockUpdateQuery = `
          UPDATE products
          SET stock = stock - :quantity,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = :product_id
        `;
        await sequelize.query(stockUpdateQuery, {
          replacements: {
            product_id: item.product_id,
            quantity: item.quantity
          },
          type: QueryTypes.UPDATE,
          transaction
        });
      }

      await transaction.commit();

      // Get full order with items
      const fullOrderQuery = `
        SELECT * FROM orders WHERE id = :order_id
      `;
      const fullOrders: any = await sequelize.query(fullOrderQuery, {
        replacements: { order_id: orderId },
        type: QueryTypes.SELECT
      });
      const fullOrder = fullOrders[0];

      const itemsQuery = `
        SELECT * FROM order_items WHERE order_id = :order_id
      `;
      const orderItems: any = await sequelize.query(itemsQuery, {
        replacements: { order_id: orderId },
        type: QueryTypes.SELECT
      });
      fullOrder.items = orderItems.map((item: any) => normalizeOrderItem(item));
      normalizeOrderRow(fullOrder);

      res.status(201).json(fullOrder);
    } catch (error: any) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

// Update order (admin only)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, tracking_number, payment_status, admin_notes } = req.body;

    // Validation
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const allowedPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (payment_status && !allowedPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment_status' });
    }

    // Build update query
    const updates: string[] = [];
    const replacements: any = { id };

    if (status) {
      updates.push('status = :status');
      replacements.status = status;
      
      // Set timestamp based on status
      if (status === 'shipped') {
        updates.push('shipped_at = CURRENT_TIMESTAMP');
      } else if (status === 'delivered') {
        updates.push('delivered_at = CURRENT_TIMESTAMP');
      } else if (status === 'cancelled') {
        updates.push('cancelled_at = CURRENT_TIMESTAMP');
      }
    }

    if (tracking_number) {
      updates.push('tracking_number = :tracking_number');
      replacements.tracking_number = tracking_number;
    }

    if (payment_status) {
      updates.push('payment_status = :payment_status');
      replacements.payment_status = payment_status;
    }

    if (admin_notes) {
      updates.push('admin_notes = :admin_notes');
      replacements.admin_notes = admin_notes;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const updateQuery = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE id = :id
      RETURNING *
    `;
    const updated: any = await sequelize.query(updateQuery, {
      replacements,
      type: QueryTypes.UPDATE
    });

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const normalized = Array.isArray(updated) ? updated[0] : updated;
    normalizeOrderRow(normalized);
    res.json(normalized);
  } catch (error) {
    console.error('Failed to update order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete order (admin only, usually not allowed)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM orders WHERE id = :id RETURNING id
    `;
    const deleted: any = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

















