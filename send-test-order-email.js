#!/usr/bin/env node

/**
 * Gửi email xác nhận đơn hàng "ảo" để test cấu hình SMTP
 * - Sử dụng EmailService và template order confirmation từ CMS backend (đã build)
 * - KHÔNG ghi mật khẩu email vào code, dùng config trong database (Settings > Email)
 *
 * Cách chạy:
 *   cd /var/www/Spa
 *   node send-test-order-email.js [email_nhan_test]
 *
 * Ví dụ:
 *   node send-test-order-email.js hoangkhiem.tech@gmail.com
 */

// Bắt buộc chạy sau khi CMS backend đã build (có thư mục dist)

async function main() {
  const toEmail = process.argv[2] || 'hoangkhiem.tech@gmail.com';

  console.log('=== TEST SEND ORDER CONFIRMATION EMAIL ===');
  console.log('To:', toEmail);
  console.log('');

  try {
    // Import emailService và template từ bản build của CMS backend
    const emailModule = await import('./CMS/backend/dist/services/email.js');
    const templatesModule = await import('./CMS/backend/dist/utils/emailTemplates.js');

    const emailService = emailModule.emailService;
    const { getOrderConfirmationTemplate } = templatesModule;

    // Đảm bảo đã load config xong trước khi kiểm tra isEnabled
    console.log('[Test] Initializing EmailService (loading config)...');
    if (typeof emailService.initialize === 'function') {
      await emailService.initialize();
    } else if (typeof emailService.loadConfig === 'function') {
      await emailService.loadConfig();
    }

    console.log('[Test] Checking if email service is enabled...');
    if (!emailService.isEnabled()) {
      console.error('[Test] ❌ EmailService is NOT enabled sau khi load config.');
      console.error('[Test] Hãy kiểm tra lại cấu hình trong CMS: Settings -> Email.');
      return;
    }

    console.log('[Test] EmailService is enabled. Preparing fake order data...');

    const now = new Date();
    const fakeOrderNumber = 'ORD-TEST-' + now.getTime().toString(36).toUpperCase();

    const emailData = {
      customerName: 'Khách hàng Test',
      customerEmail: toEmail,
      orderNumber: fakeOrderNumber,
      orderDate: now,
      total: 61000, // 61k VND giống đơn mẫu
      paymentMethod: 'cod',
      items: [
        {
          name: 'Sản phẩm test 1',
          quantity: 1,
          price: 61000,
          subtotal: 61000,
        },
      ],
      shippingAddress: {
        name: 'Khách hàng Test',
        phone: '0900000000',
        address: 'Địa chỉ test',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
      },
      orderUrl: 'https://banyco.vn/order-lookup',
    };

    console.log('[Test] Generating email HTML from template...');
    const html = getOrderConfirmationTemplate(emailData);

    console.log('[Test] Sending email via EmailService...');
    const ok = await emailService.sendEmail({
      to: toEmail,
      subject: `TEST - Xác nhận đơn hàng ${fakeOrderNumber} - Banyco`,
      html,
    });

    if (ok) {
      console.log('\n✅ TEST THÀNH CÔNG: Email xác nhận đơn hàng đã được gửi.');
      console.log('   Vui lòng kiểm tra hộp thư (và Spam) của:', toEmail);
    } else {
      console.error('\n❌ TEST THẤT BẠI: EmailService trả về false.');
      console.error('   Hãy mở logs PM2 để xem chi tiết:');
      console.error('   pm2 logs cms-backend --lines 100 | grep -i email');
    }
  } catch (err) {
    console.error('\n❌ LỖI KHI CHẠY TEST:');
    console.error(err);
    if (err && err.stack) {
      console.error(err.stack);
    }
  }
}

main();




