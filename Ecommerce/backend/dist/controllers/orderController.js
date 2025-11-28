"use strict";
// Order Controller
// Handles order creation, retrieval, and management
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
exports.deleteOrder = exports.updateOrder = exports.getOrdersByPhone = exports.createOrder = exports.getOrderByNumber = exports.getOrderById = exports.getOrders = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const activityLogController_1 = require("./activityLogController");
const numericOrderFields = [
    'subtotal',
    'tax_amount',
    'shipping_cost',
    'discount_amount',
    'total',
];
const normalizeOrderRow = (order) => {
    if (!order)
        return;
    // Normalize numeric fields
    numericOrderFields.forEach((field) => {
        if (order[field] !== undefined && order[field] !== null) {
            order[field] = Number(order[field]);
        }
    });
    // Normalize status fields
    if (order.payment_status) {
        order.payment_status = String(order.payment_status);
    }
    if (order.status) {
        order.status = String(order.status);
    }
    // Parse JSONB fields if they're strings
    if (order.shipping_address) {
        if (typeof order.shipping_address === 'string') {
            try {
                order.shipping_address = JSON.parse(order.shipping_address);
            }
            catch (error) {
                // keep original string if parse fails
                console.warn('[normalizeOrderRow] Failed to parse shipping_address:', error);
            }
        }
    }
    if (order.billing_address) {
        if (typeof order.billing_address === 'string') {
            try {
                order.billing_address = JSON.parse(order.billing_address);
            }
            catch (error) {
                // keep original string if parse fails
                console.warn('[normalizeOrderRow] Failed to parse billing_address:', error);
            }
        }
    }
    return order;
};
const normalizeOrderItem = (item) => {
    if (!item)
        return item;
    const normalized = { ...item };
    if (normalized.quantity !== undefined && normalized.quantity !== null) {
        normalized.quantity = Number(normalized.quantity);
    }
    if (normalized.unit_price !== undefined && normalized.unit_price !== null) {
        normalized.unit_price = Number(normalized.unit_price);
    }
    const total = normalized.total_price !== undefined && normalized.total_price !== null
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
            }
            catch (error) {
                // keep original string
            }
        }
    }
    return normalized;
};
// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}
// Get all orders (admin) or user's orders
const getOrders = async (req, res) => {
    try {
        const { customer_id, status, page = 1, pageSize = 20 } = req.query;
        const whereConditions = [];
        const replacements = {
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
        // Only show non-deleted orders by default
        // To show deleted orders, pass ?include_deleted=true
        const includeDeleted = req.query.include_deleted === 'true';
        if (!includeDeleted) {
            whereConditions.push('o.deleted_at IS NULL');
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
        const countResult = await database_1.default.query(countQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
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
        const orders = await database_1.default.query(ordersQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT
        });
        // Get items for each order
        for (const order of orders) {
            const itemsQuery = `
        SELECT 
          id,
          product_id,
          product_name,
          product_sku as sku,
          quantity,
          unit_price,
          total_price,
          variant_info
        FROM order_items
        WHERE order_id = :order_id
        ORDER BY created_at ASC
      `;
            const items = await database_1.default.query(itemsQuery, {
                replacements: { order_id: order.id },
                type: sequelize_1.QueryTypes.SELECT
            });
            order.items = items.map((item) => normalizeOrderItem(item));
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
    }
    catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderQuery = `
      SELECT * FROM orders WHERE id = :id AND deleted_at IS NULL
    `;
        const orders = await database_1.default.query(orderQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orders[0];
        // Get order items
        const itemsQuery = `
      SELECT 
        id,
        product_id,
        product_name,
        product_sku as sku,
        quantity,
        unit_price,
        total_price,
        variant_info
      FROM order_items
      WHERE order_id = :order_id
      ORDER BY created_at ASC
    `;
        const items = await database_1.default.query(itemsQuery, {
            replacements: { order_id: id },
            type: sequelize_1.QueryTypes.SELECT
        });
        order.items = items.map((item) => normalizeOrderItem(item));
        normalizeOrderRow(order);
        res.json(order);
    }
    catch (error) {
        console.error('Failed to fetch order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
// Get order by order number
const getOrderByNumber = async (req, res) => {
    try {
        const { order_number } = req.params;
        const orderQuery = `
      SELECT * FROM orders WHERE order_number = :order_number AND deleted_at IS NULL
    `;
        const orders = await database_1.default.query(orderQuery, {
            replacements: { order_number },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orders[0];
        // Get order items
        const itemsQuery = `
      SELECT 
        id,
        product_id,
        product_name,
        product_sku as sku,
        quantity,
        unit_price,
        total_price,
        variant_info
      FROM order_items
      WHERE order_id = :order_id
      ORDER BY created_at ASC
    `;
        const items = await database_1.default.query(itemsQuery, {
            replacements: { order_id: order.id },
            type: sequelize_1.QueryTypes.SELECT
        });
        order.items = items.map((item) => normalizeOrderItem(item));
        normalizeOrderRow(order);
        res.json(order);
    }
    catch (error) {
        console.error('Failed to fetch order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderByNumber = getOrderByNumber;
// Create new order from cart
const createOrder = async (req, res) => {
    try {
        const { customer_id, customer_email, customer_name, customer_phone, // Required for phone-based order lookup
        shipping_address, billing_address, shipping_method, payment_method, items, // Array of { product_id, quantity, variant_info }
        notes, subtotal: frontendSubtotal, // Optional: frontend calculated subtotal
        shipping_cost: frontendShippingCost, // Optional: frontend calculated shipping
        tax_amount: frontendTaxAmount, // Optional: frontend calculated tax
         } = req.body;
        // Validation
        if (!customer_email || !customer_name || !customer_phone || !shipping_address || !billing_address || !payment_method) {
            return res.status(400).json({ error: 'Missing required fields: customer_email, customer_name, customer_phone, shipping_address, billing_address, payment_method' });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }
        // Start transaction
        const transaction = await database_1.default.transaction();
        try {
            const orderId = (0, uuid_1.v4)();
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
                const products = await database_1.default.query(productQuery, {
                    replacements: { product_id: item.product_id },
                    type: sequelize_1.QueryTypes.SELECT,
                    transaction
                });
                if (!products || products.length === 0) {
                    throw new Error(`Product ${item.product_id} not found or not available`);
                }
                const product = products[0];
                // Check stock
                if (product.stock < item.quantity) {
                    const stockError = new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                    stockError.statusCode = 400;
                    stockError.code = 'INSUFFICIENT_STOCK';
                    stockError.productName = product.name;
                    stockError.availableStock = product.stock;
                    stockError.requestedQuantity = item.quantity;
                    throw stockError;
                }
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;
            }
            // Use frontend calculated values if provided, otherwise calculate on backend
            // Frontend values take precedence for consistency with what user sees
            if (frontendSubtotal !== undefined && frontendSubtotal !== null) {
                subtotal = Number(frontendSubtotal);
            }
            if (frontendShippingCost !== undefined && frontendShippingCost !== null) {
                shippingCost = Number(frontendShippingCost);
            }
            if (frontendTaxAmount !== undefined && frontendTaxAmount !== null) {
                taxAmount = Number(frontendTaxAmount);
            }
            const total = subtotal + taxAmount + shippingCost;
            // customer_phone is required and provided separately (not in shipping_address)
            // Use customer_phone directly
            const phoneNumber = customer_phone;
            // Create order
            const orderQuery = `
        INSERT INTO orders (
          id, order_number, customer_id, customer_email, customer_name, customer_phone,
          shipping_address, billing_address,
          subtotal, tax_amount, shipping_cost, discount_amount, total,
          shipping_method, payment_method, payment_status, status, notes,
          created_at, updated_at
        )
        VALUES (
          :id, :order_number, :customer_id, :customer_email, :customer_name, :customer_phone,
          :shipping_address::jsonb, :billing_address::jsonb,
          :subtotal, :tax_amount, :shipping_cost, :discount_amount, :total,
          :shipping_method, :payment_method, 'pending', 'pending', :notes,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *
      `;
            const newOrders = await database_1.default.query(orderQuery, {
                replacements: {
                    id: orderId,
                    order_number: orderNumber,
                    customer_id: customer_id || null,
                    customer_email,
                    customer_name,
                    customer_phone: phoneNumber,
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
                type: sequelize_1.QueryTypes.INSERT,
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
                const products = await database_1.default.query(productQuery, {
                    replacements: { product_id: item.product_id },
                    type: sequelize_1.QueryTypes.SELECT,
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
                    const assets = await database_1.default.query(assetQuery, {
                        replacements: { asset_id: product.thumbnail_id },
                        type: sequelize_1.QueryTypes.SELECT,
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
                await database_1.default.query(itemQuery, {
                    replacements: {
                        id: (0, uuid_1.v4)(),
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
                    type: sequelize_1.QueryTypes.INSERT,
                    transaction
                });
                // Update product stock within transaction
                // CRITICAL: Only update stock once here, StockService will only record movement (not update stock again)
                const stockUpdateQuery = `
          UPDATE products
          SET stock = stock - :quantity,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = :product_id
        `;
                await database_1.default.query(stockUpdateQuery, {
                    replacements: {
                        product_id: item.product_id,
                        quantity: item.quantity
                    },
                    type: sequelize_1.QueryTypes.UPDATE,
                    transaction
                });
            }
            await transaction.commit();
            // Record stock movements after transaction commits (to track inventory changes)
            // NOTE: StockService.updateStock will try to update stock again, so we need to use a method that only records movement
            // For now, we'll manually insert stock movement record without updating stock again
            const userId = req.user?.id;
            for (const item of items) {
                try {
                    // Get current stock after the update
                    const currentStockQuery = `
            SELECT stock FROM products WHERE id = :product_id
          `;
                    const currentStockResult = await database_1.default.query(currentStockQuery, {
                        replacements: { product_id: item.product_id },
                        type: sequelize_1.QueryTypes.SELECT
                    });
                    const currentStock = currentStockResult[0]?.stock || 0;
                    const previousStock = currentStock + item.quantity; // Stock before deduction
                    // Record stock movement without updating stock (stock already updated in transaction)
                    const movementQuery = `
            INSERT INTO stock_movements (
              id, product_id, variant_id, quantity, previous_stock, new_stock,
              reference_type, reference_id, notes, user_id, created_at
            )
            VALUES (
              gen_random_uuid(), :product_id, :variant_id, :quantity, :previous_stock, :new_stock,
              :reference_type, :reference_id, :notes, :user_id, CURRENT_TIMESTAMP
            )
          `;
                    await database_1.default.query(movementQuery, {
                        replacements: {
                            product_id: item.product_id,
                            variant_id: item.variant_info?.variantId || null,
                            quantity: -item.quantity, // negative for sale
                            previous_stock: previousStock,
                            new_stock: currentStock,
                            reference_type: 'order',
                            reference_id: orderId,
                            notes: `Order ${orderNumber} - Sale`,
                            user_id: userId || null
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                }
                catch (error) {
                    // Log error but don't fail the order creation
                    console.error(`[createOrder] Failed to record stock movement for product ${item.product_id}:`, error.message);
                }
            }
            // Get full order with items
            const fullOrderQuery = `
        SELECT * FROM orders WHERE id = :order_id AND deleted_at IS NULL
      `;
            const fullOrders = await database_1.default.query(fullOrderQuery, {
                replacements: { order_id: orderId },
                type: sequelize_1.QueryTypes.SELECT
            });
            const fullOrder = fullOrders[0];
            const itemsQuery = `
        SELECT * FROM order_items WHERE order_id = :order_id
      `;
            const orderItems = await database_1.default.query(itemsQuery, {
                replacements: { order_id: orderId },
                type: sequelize_1.QueryTypes.SELECT
            });
            fullOrder.items = orderItems.map((item) => normalizeOrderItem(item));
            normalizeOrderRow(fullOrder);
            // If payment method is ZaloPay, return order with payment_redirect flag
            // Frontend should call /api/payments/zalopay/create to get order_url
            if (payment_method === 'zalopay') {
                return res.status(201).json({
                    ...fullOrder,
                    payment_redirect: true,
                    payment_redirect_url: `/api/payments/zalopay/create`
                });
            }
            res.status(201).json(fullOrder);
        }
        catch (error) {
            await transaction.rollback();
            console.error('[createOrder] Transaction error:', {
                message: error?.message,
                code: error?.code,
                detail: error?.detail,
                stack: error?.stack,
                name: error?.name,
            });
            throw error;
        }
    }
    catch (error) {
        console.error('[createOrder] Failed to create order:', {
            message: error?.message,
            code: error?.code,
            detail: error?.detail,
            stack: error?.stack,
            name: error?.name,
            statusCode: error?.statusCode,
            requestBody: {
                customer_email: req.body?.customer_email,
                customer_name: req.body?.customer_name,
                customer_phone: req.body?.customer_phone,
                payment_method: req.body?.payment_method,
                items_count: req.body?.items?.length,
            },
        });
        // Handle specific error types with appropriate status codes
        const statusCode = error?.statusCode || 500;
        const isClientError = statusCode >= 400 && statusCode < 500;
        res.status(statusCode).json({
            error: error?.message || 'Failed to create order',
            code: error?.code,
            ...(error?.code === 'INSUFFICIENT_STOCK' && {
                productName: error?.productName,
                availableStock: error?.availableStock,
                requestedQuantity: error?.requestedQuantity,
            }),
            details: process.env.NODE_ENV === 'development' ? {
                code: error?.code,
                detail: error?.detail,
                message: error?.message,
                stack: isClientError ? undefined : error?.stack, // Don't expose stack for client errors
            } : undefined
        });
    }
};
exports.createOrder = createOrder;
// Get orders by phone number (public endpoint for order lookup)
const getOrdersByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        console.log('[getOrdersByPhone] Called with phone:', phone);
        if (!phone) {
            console.log('[getOrdersByPhone] Phone is missing');
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập số điện thoại',
                message: 'Vui lòng nhập số điện thoại để tra cứu đơn hàng'
            });
        }
        // Normalize phone number (remove spaces, dashes, parentheses) - căn cứ vào customer_phone
        const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
        // Simple query - căn cứ vào customer_phone với exact match và LIKE
        const orderQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.subtotal,
        o.tax_amount,
        o.shipping_cost,
        o.discount_amount,
        o.total,
        o.status,
        o.payment_status,
        o.payment_method,
        o.tracking_number,
        o.shipping_address,
        o.created_at,
        o.shipped_at,
        o.delivered_at
      FROM orders o
      WHERE o.customer_phone IS NOT NULL
        AND o.deleted_at IS NULL
        AND (
          o.customer_phone = :phone 
          OR o.customer_phone LIKE :phone_like
        )
      ORDER BY o.created_at DESC
      LIMIT 50
    `;
        console.log('[getOrdersByPhone] Querying with phone:', phone, 'normalized:', normalizedPhone);
        const orders = await database_1.default.query(orderQuery, {
            replacements: {
                phone,
                phone_like: `%${normalizedPhone}%`
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        // Filter by normalized phone in code (more reliable than SQL REPLACE)
        const filteredOrders = orders.filter((order) => {
            if (!order.customer_phone)
                return false;
            const orderPhoneNormalized = order.customer_phone.replace(/[\s\-\(\)]/g, '');
            return order.customer_phone === phone || orderPhoneNormalized === normalizedPhone;
        });
        console.log('[getOrdersByPhone] Found orders before filter:', orders?.length || 0);
        console.log('[getOrdersByPhone] Found orders after filter:', filteredOrders?.length || 0);
        if (!filteredOrders || filteredOrders.length === 0) {
            console.log('[getOrdersByPhone] No orders found for phone:', phone);
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng nào với số điện thoại này',
                error: 'Không tìm thấy đơn hàng nào với số điện thoại này'
            });
        }
        // Get items for each order
        for (const order of filteredOrders) {
            try {
                // Normalize order row first (before adding items)
                normalizeOrderRow(order);
                const itemsQuery = `
          SELECT 
            oi.id,
            oi.product_id,
            oi.product_name,
            oi.product_sku as sku,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            oi.variant_info
          FROM order_items oi
          WHERE oi.order_id = :order_id
          ORDER BY oi.created_at ASC
        `;
                const items = await database_1.default.query(itemsQuery, {
                    replacements: { order_id: order.id },
                    type: sequelize_1.QueryTypes.SELECT
                });
                order.items = items.map((item) => normalizeOrderItem(item));
            }
            catch (itemError) {
                console.error(`[getOrdersByPhone] Error processing items for order ${order.id}:`, itemError);
                console.error(`[getOrdersByPhone] Item error message:`, itemError?.message);
                console.error(`[getOrdersByPhone] Item error stack:`, itemError?.stack);
                // Still normalize order even if items fail
                try {
                    normalizeOrderRow(order);
                }
                catch (normalizeError) {
                    console.error(`[getOrdersByPhone] Error normalizing order ${order.id}:`, normalizeError);
                }
                order.items = []; // Set empty items if error
            }
        }
        res.json({
            success: true,
            data: filteredOrders,
            count: filteredOrders.length
        });
    }
    catch (error) {
        console.error('[getOrdersByPhone] Error:', error);
        console.error('[getOrdersByPhone] Error message:', error?.message);
        console.error('[getOrdersByPhone] Error stack:', error?.stack);
        // Return detailed error for debugging
        res.status(500).json({
            success: false,
            error: 'Lỗi khi tìm kiếm đơn hàng',
            message: 'Đã xảy ra lỗi khi tra cứu đơn hàng. Vui lòng thử lại sau.',
            details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        });
    }
};
exports.getOrdersByPhone = getOrdersByPhone;
// Update order (admin only)
const updateOrder = async (req, res) => {
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
        const updates = [];
        const replacements = { id };
        if (status) {
            updates.push('status = :status');
            replacements.status = status;
            // Set timestamp based on status
            if (status === 'shipped') {
                updates.push('shipped_at = CURRENT_TIMESTAMP');
            }
            else if (status === 'delivered') {
                updates.push('delivered_at = CURRENT_TIMESTAMP');
            }
            else if (status === 'cancelled') {
                updates.push('cancelled_at = CURRENT_TIMESTAMP');
                // Note: Stock restoration will happen AFTER order update succeeds
            }
        }
        if (tracking_number) {
            updates.push('tracking_number = :tracking_number');
            replacements.tracking_number = tracking_number;
        }
        if (payment_status) {
            updates.push('payment_status = :payment_status');
            replacements.payment_status = payment_status;
            // NOTE: Payment failed does NOT restore stock automatically
            // Stock will only be restored when order status is set to 'cancelled'
            // This allows users to retry payment without losing their reserved stock
            if (payment_status === 'failed') {
                console.log('[updateOrder] Payment status set to failed for order:', id, '- Stock remains reserved until order is cancelled');
            }
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
        const updated = await database_1.default.query(updateQuery, {
            replacements,
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!updated || updated.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const normalized = Array.isArray(updated) ? updated[0] : updated;
        normalizeOrderRow(normalized);
        // CRITICAL: Restore stock AFTER order update succeeds (if order was cancelled)
        if (status === 'cancelled') {
            console.log('[updateOrder] Order cancelled, restoring stock for order:', id);
            try {
                // Get order items
                const itemsQuery = `SELECT product_id, quantity, variant_info FROM order_items WHERE order_id = :id`;
                const orderItems = await database_1.default.query(itemsQuery, {
                    replacements: { id },
                    type: sequelize_1.QueryTypes.SELECT
                });
                // Restore stock for each item
                const { StockService } = await Promise.resolve().then(() => __importStar(require('../services/stockService')));
                const userId = req.user?.id;
                for (const item of orderItems) {
                    try {
                        const variantInfo = item.variant_info ? (typeof item.variant_info === 'string' ? JSON.parse(item.variant_info) : item.variant_info) : null;
                        // Get current stock
                        const currentStockQuery = variantInfo?.variantId
                            ? `SELECT stock FROM product_variants WHERE id = :id`
                            : `SELECT stock FROM products WHERE id = :id`;
                        const currentStockResult = await database_1.default.query(currentStockQuery, {
                            replacements: { id: variantInfo?.variantId || item.product_id },
                            type: sequelize_1.QueryTypes.SELECT
                        });
                        const currentStock = currentStockResult[0]?.stock || 0;
                        const previousStock = currentStock - item.quantity; // Stock before restoration
                        // Update stock directly
                        const stockUpdateQuery = variantInfo?.variantId
                            ? `UPDATE product_variants SET stock = stock + :quantity, updated_at = CURRENT_TIMESTAMP WHERE id = :id`
                            : `UPDATE products SET stock = stock + :quantity, updated_at = CURRENT_TIMESTAMP WHERE id = :id`;
                        await database_1.default.query(stockUpdateQuery, {
                            replacements: {
                                id: variantInfo?.variantId || item.product_id,
                                quantity: item.quantity
                            },
                            type: sequelize_1.QueryTypes.UPDATE
                        });
                        // Record stock movement
                        const movementQuery = `
              INSERT INTO stock_movements (
                id, product_id, variant_id, movement_type, quantity, previous_stock, new_stock,
                reference_type, reference_id, notes, created_by, created_at
              )
              VALUES (
                gen_random_uuid(), :product_id, :variant_id, :movement_type, :quantity, :previous_stock, :new_stock,
                :reference_type, :reference_id, :notes, :user_id, CURRENT_TIMESTAMP
              )
            `;
                        await database_1.default.query(movementQuery, {
                            replacements: {
                                product_id: item.product_id,
                                variant_id: variantInfo?.variantId || null,
                                movement_type: 'return',
                                quantity: item.quantity, // positive to restore
                                previous_stock: previousStock,
                                new_stock: currentStock + item.quantity,
                                reference_type: 'order',
                                reference_id: id,
                                notes: `Order cancelled - Stock restored`,
                                user_id: userId || null
                            },
                            type: sequelize_1.QueryTypes.INSERT
                        });
                        console.log(`[updateOrder] Restored ${item.quantity} units for product ${item.product_id} (variant: ${variantInfo?.variantId || 'none'})`);
                    }
                    catch (error) {
                        console.error(`[updateOrder] Failed to restore stock for product ${item.product_id}:`, error.message);
                        // Continue with other items even if one fails
                    }
                }
                console.log('[updateOrder] Stock restoration completed for order:', id);
            }
            catch (error) {
                console.error('[updateOrder] Failed to restore stock:', error);
                // Don't fail the order update if stock restoration fails
                // Log error but continue
            }
        }
        // Log activity
        const orderNumber = normalized.order_number || id;
        const statusChange = status ? `Status changed to "${status}"` : '';
        const paymentChange = payment_status ? `Payment status changed to "${payment_status}"` : '';
        const changes = [statusChange, paymentChange].filter(Boolean).join(', ') || 'Updated order';
        await (0, activityLogController_1.logActivity)(req, 'update', 'order', id, orderNumber, `${changes} - Order #${orderNumber}`);
        res.json(normalized);
    }
    catch (error) {
        console.error('Failed to update order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};
exports.updateOrder = updateOrder;
// Soft delete order (admin only) - sets deleted_at timestamp instead of hard delete
// This preserves order data for accounting, reporting, and audit purposes
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Get order info before soft deleting
        const getOrderQuery = 'SELECT order_number, deleted_at FROM orders WHERE id = :id';
        const orderResult = await database_1.default.query(getOrderQuery, {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!orderResult || orderResult.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orderResult[0];
        const orderNumber = order.order_number || id;
        // Check if already deleted
        if (order.deleted_at) {
            return res.status(400).json({ error: 'Order is already deleted (archived)' });
        }
        // Soft delete: set deleted_at timestamp instead of hard delete
        const query = `
      UPDATE orders 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = :id AND deleted_at IS NULL
      RETURNING id, deleted_at
    `;
        const updated = await database_1.default.query(query, {
            replacements: { id },
            type: sequelize_1.QueryTypes.UPDATE
        });
        if (!updated || updated.length === 0 || !updated[0]) {
            return res.status(404).json({ error: 'Order not found or already deleted' });
        }
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'order', id, orderNumber, `Archived (soft deleted) order #${orderNumber}`);
        res.json({
            success: true,
            message: 'Order archived successfully',
            deleted_at: updated[0].deleted_at
        });
    }
    catch (error) {
        console.error('Failed to archive order:', error);
        res.status(500).json({ error: 'Failed to archive order' });
    }
};
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orderController.js.map