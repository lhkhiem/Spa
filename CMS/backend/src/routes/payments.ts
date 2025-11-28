import { Router, Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import { createZaloPayOrder, verifyCallbackMac, queryZaloPayOrder } from '../services/zalopay';

const router = Router();

/**
 * Create ZaloPay payment
 * POST /api/payments/zalopay/create
 * Body: { orderId, amount, description, appUser, items?, embedData? }
 */
router.post('/zalopay/create', async (req: Request, res: Response) => {
  try {
    const { orderId, amount, description, appUser, items, embedData } = req.body;

    if (!orderId || !amount || !description || !appUser) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, amount, description, appUser'
      });
    }

    // Validate order exists
    const orderQuery = `
      SELECT id, order_number, total, payment_method, payment_status
      FROM orders
      WHERE id = :orderId OR order_number = :orderId
      LIMIT 1
    `;
    const orders: any = await sequelize.query(orderQuery, {
      replacements: { orderId },
      type: QueryTypes.SELECT
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orders[0];

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order already paid'
      });
    }

    // Check payment method
    if (order.payment_method !== 'zalopay') {
      return res.status(400).json({
        success: false,
        error: 'Order payment method is not ZaloPay'
      });
    }

    // Use order total if amount not provided
    const paymentAmount = amount || Math.round(order.total);

    // Get customer phone or email for appUser (ZaloPay requires phone/email, not UUID)
    // customer_phone and customer_email are already in order object, but let's query to be sure
    const customerQuery = `
      SELECT customer_phone, customer_email, customer_name
      FROM orders
      WHERE id = :orderId
      LIMIT 1
    `;
    const customerData: any = await sequelize.query(customerQuery, {
      replacements: { orderId: order.id },
      type: QueryTypes.SELECT
    });
    
    const customerPhone = customerData?.[0]?.customer_phone || order.customer_phone;
    const customerEmail = customerData?.[0]?.customer_email || order.customer_email;
    
    // ZaloPay app_user should be phone or email, not UUID
    // Priority: provided appUser > customer phone > customer email > fallback to phone format
    let finalAppUser = appUser;
    if (!finalAppUser || finalAppUser.length > 50 || finalAppUser.includes('-')) {
      // If appUser is UUID or invalid, use phone or email
      if (customerPhone && /^[0-9]{10,11}$/.test(customerPhone.replace(/[^0-9]/g, ''))) {
        finalAppUser = customerPhone.replace(/[^0-9]/g, '');
      } else if (customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        finalAppUser = customerEmail;
      } else {
        // Fallback: use a valid phone format (ZaloPay requires valid format)
        finalAppUser = '0900000000'; // Default test phone
      }
    }

    // Sanitize description (remove special characters that might cause issues)
    const sanitizedDescription = (description || `Order ${order.order_number}`)
      .replace(/[^\w\s\-.,]/g, '')
      .substring(0, 255); // ZaloPay has description length limit

    // Create ZaloPay order
    // Use order_number instead of UUID for app_trans_id (ZaloPay requires short ID)
    const { body, response, app_trans_id } = await createZaloPayOrder({
      orderId: order.order_number || order.id, // Prefer order_number (shorter)
      amount: paymentAmount,
      description: sanitizedDescription,
      appUser: finalAppUser,
      items: items || [],
      embedData: embedData || {},
    });

    // Check if ZaloPay returned success
    if (response.return_code !== 1) {
      console.error('[Payments] ZaloPay create order failed:', {
        return_code: response.return_code,
        return_message: response.return_message,
        sub_return_code: response.sub_return_code,
        sub_return_message: response.sub_return_message,
      });
      return res.status(400).json({
        success: false,
        error: 'ZaloPay order creation failed',
        message: response.return_message || response.sub_return_message || 'Failed to create ZaloPay order',
        data: {
          return_code: response.return_code,
          return_message: response.return_message,
          sub_return_code: response.sub_return_code,
          sub_return_message: response.sub_return_message,
        }
      });
    }

    // Update order with ZaloPay info only if successful
    try {
      const updateQuery = `
        UPDATE orders
        SET zp_app_trans_id = :app_trans_id,
            zp_trans_token = :zp_trans_token,
            zp_order_url = :zp_order_url,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :order_id
      `;
      await sequelize.query(updateQuery, {
        replacements: {
          order_id: order.id,
          app_trans_id,
          zp_trans_token: response.zp_trans_token || null,
          zp_order_url: response.order_url || null,
        },
        type: QueryTypes.UPDATE
      });
    } catch (dbError: any) {
      console.error('[Payments] Failed to update order with ZaloPay info:', {
        order_id: order.id,
        app_trans_id,
        error: dbError?.message,
        code: dbError?.code,
        detail: dbError?.detail,
      });
      // Continue anyway - order was created successfully, just couldn't save ZaloPay info
      // This is not critical enough to fail the entire request
    }

    return res.json({
      success: true,
      data: {
        app_trans_id,
        order_url: response.order_url,
        zp_trans_token: response.zp_trans_token,
        return_code: response.return_code,
        return_message: response.return_message,
        order_id: order.id,
        order_number: order.order_number,
      }
    });
  } catch (error: any) {
    console.error('[Payments] Create ZaloPay order error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      response: error?.response?.data,
      requestBody: {
        orderId: req.body?.orderId,
        amount: req.body?.amount,
        description: req.body?.description,
        appUser: req.body?.appUser,
      },
    });
    
    // Check if it's a configuration error
    if (error?.message?.includes('ZaloPay configuration missing')) {
      return res.status(500).json({
        success: false,
        error: 'ZaloPay configuration error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          ZP_APP_ID: process.env.ZP_APP_ID ? 'Set' : 'Missing',
          ZP_KEY1: process.env.ZP_KEY1 ? 'Set' : 'Missing',
          ZP_CALLBACK_URL: process.env.ZP_CALLBACK_URL ? 'Set' : 'Missing',
        } : undefined
      });
    }
    
    // Check if it's a ZaloPay API error
    if (error?.message?.includes('ZaloPay API error')) {
      return res.status(400).json({
        success: false,
        error: 'ZaloPay API error',
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create ZaloPay order',
      message: error?.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? {
        stack: error?.stack,
        code: error?.code,
      } : undefined
    });
  }
});

/**
 * ZaloPay Callback (IPN)
 * POST /api/payments/zalopay/callback
 * ZaloPay sends: { data: "<json string>", mac: "<hex>", type: 1 }
 */
router.post('/zalopay/callback', async (req: Request, res: Response) => {
  try {
    const { data, mac, type } = req.body || {};

    if (!data || !mac) {
      console.error('[ZaloPay Callback] Missing data or mac');
      return res.json({ return_code: 2, return_message: 'Missing data or mac' });
    }

    // Verify MAC
    const macOk = verifyCallbackMac(data, mac);

    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      console.error('[ZaloPay Callback] Failed to parse data:', e);
      return res.json({ return_code: 2, return_message: 'Invalid data format' });
    }

    const { app_trans_id, amount, zp_trans_id, return_code } = parsed;

    if (!app_trans_id) {
      console.error('[ZaloPay Callback] Missing app_trans_id');
      return res.json({ return_code: 2, return_message: 'Missing app_trans_id' });
    }

    // Log callback event (for debugging)
    console.log('[ZaloPay Callback] Received:', {
      app_trans_id,
      amount,
      zp_trans_id,
      return_code,
      mac_valid: macOk,
    });

    if (!macOk) {
      console.error('[ZaloPay Callback] Invalid MAC');
      // Return error so ZaloPay may retry later
      return res.json({ return_code: 2, return_message: 'Invalid MAC' });
    }

    // Find order by zp_app_trans_id
    const orderQuery = `
      SELECT 
        id, order_number, total, payment_status, zp_app_trans_id,
        customer_email, customer_name, customer_phone,
        shipping_address, billing_address,
        payment_method, status
      FROM orders
      WHERE zp_app_trans_id = :app_trans_id
      LIMIT 1
    `;
    const orders: any = await sequelize.query(orderQuery, {
      replacements: { app_trans_id },
      type: QueryTypes.SELECT
    });

    if (!orders || orders.length === 0) {
      console.error('[ZaloPay Callback] Order not found:', app_trans_id);
      return res.json({ return_code: 2, return_message: 'Order not found' });
    }

    const order = orders[0];

    // Check return_code from ZaloPay
    const isSuccess = return_code === 1;

    // Validate amount if payment is successful (allow 100 VND difference for rounding)
    if (isSuccess && amount && Math.abs(amount - Number(order.total)) > 100) {
      console.error('[ZaloPay Callback] Amount mismatch:', {
        order_id: order.id,
        order_number: order.order_number,
        order_amount: order.total,
        callback_amount: amount,
        difference: Math.abs(amount - Number(order.total)),
      });
      return res.json({ return_code: 2, return_message: 'Amount mismatch' });
    }

    // Idempotency check: if order is already paid and this is a success callback, skip update
    if (order.payment_status === 'paid' && isSuccess) {
      console.log('[ZaloPay Callback] Order already paid, skipping update:', {
        order_id: order.id,
        order_number: order.order_number,
        app_trans_id,
      });
      return res.json({ return_code: 1, return_message: 'Already processed' });
    }

    // Log before update
    console.log('[ZaloPay Callback] Processing payment:', {
      order_id: order.id,
      order_number: order.order_number,
      order_total: order.total,
      callback_amount: amount,
      return_code,
      zp_trans_id,
      current_payment_status: order.payment_status,
      current_order_status: order.status,
      new_payment_status: isSuccess ? 'paid' : 'failed',
    });

    // Update order status
    const updateQuery = `
      UPDATE orders
      SET zp_trans_id = :zp_trans_id,
          payment_status = :payment_status,
          payment_transaction_id = :zp_trans_id::text,
          status = CASE
            WHEN :payment_status = 'paid' AND status = 'pending' THEN 'processing'
            WHEN :payment_status = 'paid' AND status IN ('processing', 'shipped', 'delivered') THEN status
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :order_id
        AND (payment_status != :payment_status OR zp_trans_id IS NULL)
    `;
    
    const updateResult: any = await sequelize.query(updateQuery, {
      replacements: {
        order_id: order.id,
        zp_trans_id: zp_trans_id || null,
        payment_status: isSuccess ? 'paid' : 'failed',
      },
      type: QueryTypes.UPDATE
    });

    // Check if update actually happened (rows affected)
    const rowsAffected = updateResult[1] || 0;
    
    console.log('[ZaloPay Callback] Updated order:', {
      order_id: order.id,
      order_number: order.order_number,
      payment_status: isSuccess ? 'paid' : 'failed',
      rows_affected: rowsAffected,
    });

    // Send confirmation email if payment is successful and order was actually updated
    if (isSuccess && rowsAffected > 0) {
      try {
        const { emailService } = await import('../services/email');
        const { getOrderConfirmationTemplate } = await import('../utils/emailTemplates');
        
        // Get order items for email
        const itemsQuery = `
          SELECT product_name, quantity, unit_price, total_price
          FROM order_items
          WHERE order_id = :order_id
        `;
        const orderItems: any = await sequelize.query(itemsQuery, {
          replacements: { order_id: order.id },
          type: QueryTypes.SELECT
        });

        const shippingAddress = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.WEBSITE_ORIGIN || 'https://banyco.vn';
        const orderUrl = `${siteUrl}/order-lookup`;

        const emailData = {
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          orderNumber: order.order_number,
          orderDate: order.created_at || new Date(),
          total: Number(order.total),
          paymentMethod: order.payment_method,
          items: orderItems.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: Number(item.unit_price),
            subtotal: Number(item.total_price),
          })),
          shippingAddress: {
            name: shippingAddress.name || order.customer_name,
            phone: shippingAddress.phone || order.customer_phone,
            address: shippingAddress.address || shippingAddress.street || '',
            city: shippingAddress.city || '',
            district: shippingAddress.district || '',
            ward: shippingAddress.ward || '',
          },
          orderUrl,
        };

        if (emailService.isEnabled()) {
          const emailHtml = getOrderConfirmationTemplate(emailData);
          emailService.sendEmail({
            to: order.customer_email,
            subject: `Xác nhận đơn hàng ${order.order_number} - Banyco`,
            html: emailHtml,
          }).catch((error) => {
            console.error('[ZaloPay Callback] Failed to send confirmation email:', error);
            // Don't fail the callback if email fails
          });
        }
      } catch (emailError: any) {
        console.error('[ZaloPay Callback] Email error:', emailError);
        // Don't fail the callback if email fails
      }
    }

    // Respond success to ZaloPay
    return res.json({ return_code: 1, return_message: 'Success' });
  } catch (error: any) {
    console.error('[ZaloPay Callback] Error:', error);
    return res.json({ return_code: 2, return_message: 'Internal error' });
  }
});

/**
 * Query ZaloPay order status
 * GET /api/payments/zalopay/query/:appTransId
 * Useful for retry/backfill if callback was missed
 */
router.get('/zalopay/query/:appTransId', async (req: Request, res: Response) => {
  try {
    const { appTransId } = req.params;

    if (!appTransId) {
      return res.status(400).json({
        success: false,
        error: 'Missing app_trans_id'
      });
    }

    // Query ZaloPay
    const queryResult = await queryZaloPayOrder(appTransId);

    // Find order
    const orderQuery = `
      SELECT 
        id, order_number, payment_status, status, total,
        customer_email, customer_name, customer_phone,
        shipping_address, payment_method, created_at
      FROM orders
      WHERE zp_app_trans_id = :app_trans_id
      LIMIT 1
    `;
    const orders: any = await sequelize.query(orderQuery, {
      replacements: { app_trans_id: appTransId },
      type: QueryTypes.SELECT
    });

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        data: queryResult,
        message: 'Order not found in database'
      });
    }

    const order = orders[0];
    const returnCode = queryResult.return_code;
    const isSuccess = returnCode === 1;

    // Validate amount if payment is successful
    if (isSuccess && queryResult.amount && Math.abs(queryResult.amount - Number(order.total)) > 100) {
      console.error('[Payments] Query - Amount mismatch:', {
        order_id: order.id,
        order_amount: order.total,
        query_amount: queryResult.amount,
      });
    }

    // Update order if status changed
    if (order.payment_status !== (isSuccess ? 'paid' : 'failed')) {
      const updateQuery = `
        UPDATE orders
        SET zp_trans_id = :zp_trans_id,
            payment_status = :payment_status,
            payment_transaction_id = :zp_trans_id::text,
            status = CASE
              WHEN :payment_status = 'paid' AND status = 'pending' THEN 'processing'
              WHEN :payment_status = 'paid' AND status IN ('processing', 'shipped', 'delivered') THEN status
              ELSE status
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :order_id
      `;
      
      const updateResult: any = await sequelize.query(updateQuery, {
        replacements: {
          order_id: order.id,
          zp_trans_id: queryResult.zp_trans_id || null,
          payment_status: isSuccess ? 'paid' : 'failed',
        },
        type: QueryTypes.UPDATE
      });

      const rowsAffected = updateResult[1] || 0;

      console.log('[Payments] Query - Updated order:', {
        order_id: order.id,
        order_number: order.order_number,
        payment_status: isSuccess ? 'paid' : 'failed',
        rows_affected: rowsAffected,
      });

      // Send confirmation email if payment is successful and order was actually updated
      if (isSuccess && rowsAffected > 0) {
        try {
          const { emailService } = await import('../services/email');
          const { getOrderConfirmationTemplate } = await import('../utils/emailTemplates');
          
          // Get order items
          const itemsQuery = `
            SELECT product_name, quantity, unit_price, total_price
            FROM order_items
            WHERE order_id = :order_id
          `;
          const orderItems: any = await sequelize.query(itemsQuery, {
            replacements: { order_id: order.id },
            type: QueryTypes.SELECT
          });

          const shippingAddress = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;

          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.WEBSITE_ORIGIN || 'https://banyco.vn';
          const orderUrl = `${siteUrl}/order-lookup`;

          const emailData = {
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            orderNumber: order.order_number,
            orderDate: order.created_at || new Date(),
            total: Number(order.total),
            paymentMethod: order.payment_method,
            items: orderItems.map((item: any) => ({
              name: item.product_name,
              quantity: item.quantity,
              price: Number(item.unit_price),
              subtotal: Number(item.total_price),
            })),
            shippingAddress: {
              name: shippingAddress.name || order.customer_name,
              phone: shippingAddress.phone || order.customer_phone,
              address: shippingAddress.address || shippingAddress.street || '',
              city: shippingAddress.city || '',
              district: shippingAddress.district || '',
              ward: shippingAddress.ward || '',
            },
            orderUrl,
          };

          if (emailService.isEnabled()) {
            const emailHtml = getOrderConfirmationTemplate(emailData);
            emailService.sendEmail({
              to: order.customer_email,
              subject: `Xác nhận đơn hàng ${order.order_number} - Banyco`,
              html: emailHtml,
            }).catch((error) => {
              console.error('[Payments] Query - Failed to send confirmation email:', error);
            });
          }
        } catch (emailError: any) {
          console.error('[Payments] Query - Email error:', emailError);
        }
      }
    }

    return res.json({
      success: true,
      data: queryResult
    });
  } catch (error: any) {
    console.error('[Payments] Query ZaloPay order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to query ZaloPay order',
      message: error.message
    });
  }
});

export default router;


