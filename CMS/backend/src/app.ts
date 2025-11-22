import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import sequelize from './config/database';
// Import models to initialize associations
import './models';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import topicRoutes from './routes/topics';
import tagRoutes from './routes/tags';
import productRoutes from './routes/products';
import productCategoryRoutes from './routes/productCategories';
import brandRoutes from './routes/brands';
import assetRoutes from './routes/assets';
import usersRoutes from './routes/users'; // Admin users for post authors
import settingsRoutes from './routes/settings';
import mediaRoutes from './routes/media';
import healthRoutes from './routes/health';
import menuLocationRoutes from './routes/menuLocations';
import menuItemRoutes from './routes/menuItems';
// import cartRoutes from './routes/cart'; // Disabled: Customer cart management not needed
import orderRoutes from './routes/orders'; // Admin order management (not customer management)
import paymentRoutes from './routes/payments'; // Payment gateway (ZaloPay)
// import wishlistRoutes from './routes/wishlist'; // Disabled: Customer wishlist management not needed
// import reviewRoutes from './routes/reviews'; // Disabled: Customer review management not needed
import trackingScriptRoutes from './routes/trackingScripts';
import homepageRoutes from './routes/homepage';
import sliderRoutes from './routes/sliders';
import publicPostsRoutes from './routes/publicPosts';
import publicHomepageRoutes from './routes/publicHomepage';
import publicProductsRoutes from './routes/publicProducts';
import contactRoutes from './routes/contacts';
import consultationRoutes from './routes/consultations';
import emailRoutes from './routes/email';
import publicAuthRoutes from './routes/publicAuth'; // Customer authentication
import inventoryRoutes from './routes/inventory'; // Inventory management
// import publicUserRoutes from './routes/publicUser'; // Disabled: Customer user management not needed
// import publicOrdersRoutes from './routes/publicOrders'; // Disabled: Customer orders not needed
// import publicCartRoutes from './routes/publicCart'; // Disabled: Customer cart not needed

dotenv.config();

export const app = express();

// Middleware
// CORS with credentials to support cookie-based auth from Admin app and Website
// CORS cấu hình cho cả Admin UI và Website khách
const publicIp = process.env.PUBLIC_IP || '116.100.161.72';

const allowedOrigins = [
  process.env.ADMIN_ORIGIN || 'http://localhost:3013', // Giao diện admin
  process.env.WEBSITE_ORIGIN || 'http://localhost:3010', // Website khách (nếu chạy qua reverse proxy)
  `http://${publicIp}:3013`, // Admin qua IP public
  `http://${publicIp}:3010`, // Website khách qua IP public
  `http://${publicIp}:3000`, // Website Next.js dev qua IP public
  `http://${publicIp}:3011`, // Truy cập trực tiếp API qua IP public
  'http://14.225.205.116:3013', // CMS Admin IP thực tế
  'http://14.225.205.116:3000', // Ecommerce Frontend IP thực tế
  'http://localhost:3000', // Website khách khi chạy Next.js dev trên máy
  'http://127.0.0.1:3000', // Dự phòng khi truy cập bằng 127.0.0.1
  'http://127.0.0.1:3010',
  // Production domains
  'http://banyco-demo.pressup.vn', // Production website
  'https://banyco-demo.pressup.vn', // Production website (HTTPS)
  'http://admin.banyco-demo.pressup.vn', // CMS Admin subdomain
  'https://admin.banyco-demo.pressup.vn', // CMS Admin subdomain (HTTPS)
  'http://api.banyco-demo.pressup.vn', // API subdomain
  'https://api.banyco-demo.pressup.vn', // API subdomain (HTTPS)
];

app.use(cors({
  origin: (origin, callback) => {
    // Request không có Origin (như Postman, server-to-server, hoặc same-origin requests) → cho phép
    if (!origin) {
      return callback(null, true);
    }
    // Nếu origin nằm trong whitelist → cho phép
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Log để debug
    console.warn(`[CORS] Origin not allowed: ${origin}`);
    // Origin lạ → chặn và báo lỗi rõ ràng
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/users', usersRoutes); // Admin users for post authors
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/public/posts', publicPostsRoutes);
app.use('/api/public/homepage', publicHomepageRoutes);
app.use('/api/public/products', publicProductsRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/public/auth', publicAuthRoutes); // Customer authentication
// app.use('/api/public/user', publicUserRoutes); // Disabled: Customer user management not needed
// app.use('/api/public/orders', publicOrdersRoutes); // Disabled: Customer orders not needed
// app.use('/api/public/cart', publicCartRoutes); // Disabled: Customer cart not needed
app.use('/api/menu-locations', menuLocationRoutes);
app.use('/api/menu-items', menuItemRoutes);
// app.use('/api/cart', cartRoutes); // Disabled: Customer cart management not needed
app.use('/api/orders', orderRoutes); // Admin order management (not customer management)
app.use('/api/payments', paymentRoutes); // Payment gateway (ZaloPay)
// app.use('/api/wishlist', wishlistRoutes); // Disabled: Customer wishlist management not needed
// app.use('/api/reviews', reviewRoutes); // Disabled: Customer review management not needed
app.use('/api/tracking-scripts', trackingScriptRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/sliders', sliderRoutes);

// Ensure upload and temp dirs on boot and serve uploads
(async () => {
  try {
    const uploadDir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../storage/uploads');
    const tempDir = path.resolve(__dirname, '../storage/temp');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });
    // Static: serve uploads from storage/uploads to keep public URL stable as /uploads
    app.use('/uploads', express.static(uploadDir));
    // Fallback to legacy uploads dir if file not found in storage
    app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to ensure upload/temp dirs:', e);
  }
})();

// Basic health root handled in healthRoutes

export async function ready() {
  await sequelize.authenticate();
  // Ensure one owner exists
  try {
    const [owner] = await sequelize.query(`SELECT id FROM users WHERE role = 'owner' LIMIT 1`, { type: 'SELECT' as any });
    if (!(owner as any)?.id) {
      const first: any = await sequelize.query(`SELECT id FROM users ORDER BY created_at ASC LIMIT 1`, { type: 'SELECT' as any });
      const id = (first as any[])[0]?.id;
      if (id) {
        await sequelize.query(`UPDATE users SET role = 'owner' WHERE id = :id`, { type: 'UPDATE' as any, replacements: { id } });
        // eslint-disable-next-line no-console
        console.log('Promoted earliest user to owner');
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Owner bootstrap failed or skipped:', e);
  }
}
