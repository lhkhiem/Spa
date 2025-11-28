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
// Ecommerce routes - COMMENTED (moved to Ecommerce Backend)
// import paymentRoutes from './routes/payments'; // Moved to Ecommerce Backend
// import wishlistRoutes from './routes/wishlist'; // Disabled: Customer wishlist management not needed
// import reviewRoutes from './routes/reviews'; // Disabled: Customer review management not needed
import trackingScriptRoutes from './routes/trackingScripts';
import analyticsRoutes from './routes/analytics';
import homepageRoutes from './routes/homepage';
import sliderRoutes from './routes/sliders';
import aboutSectionRoutes from './routes/aboutSections';
import publicPostsRoutes from './routes/publicPosts';
import publicHomepageRoutes from './routes/publicHomepage';
import publicPageMetadataRoutes from './routes/publicPageMetadata';
import contactRoutes from './routes/contacts';
import consultationRoutes from './routes/consultations';
import emailRoutes from './routes/email';
// Ecommerce routes - COMMENTED (moved to Ecommerce Backend)
// import publicProductsRoutes from './routes/publicProducts'; // Moved to Ecommerce Backend
// import publicAuthRoutes from './routes/publicAuth'; // Moved to Ecommerce Backend
import inventoryRoutes from './routes/inventory'; // Inventory management
import activityLogRoutes from './routes/activityLogs'; // Activity tracking
import syncMetadataRoutes from './routes/syncMetadata'; // Metadata sync
import debugSeoRoutes from './routes/debugSeo'; // Debug SEO
import pageMetadataRoutes from './routes/pageMetadata'; // Page metadata CRUD
// Ecommerce routes - COMMENTED (moved to Ecommerce Backend)
// import newsletterRoutes from './routes/newsletter'; // Moved to Ecommerce Backend
// import publicUserRoutes from './routes/publicUser'; // Disabled: Customer user management not needed
// import publicOrdersRoutes from './routes/publicOrders'; // Disabled: Customer orders not needed
// import publicCartRoutes from './routes/publicCart'; // Disabled: Customer cart not needed

dotenv.config();

export const app = express();

// Middleware
// CORS with credentials to support cookie-based auth from Admin app and Website
// CORS cấu hình cho cả Admin UI và Website khách
import { getFrontendDomain, getApiDomain, getAdminDomain } from './utils/domainUtils';

const publicIp = process.env.PUBLIC_IP || '14.225.205.116';

// Build allowed origins from environment variables
const buildAllowedOrigins = (): string[] => {
  const origins: string[] = [];
  
  // Development origins (always include)
  origins.push(
    process.env.ADMIN_ORIGIN || 'http://localhost:3013',
    process.env.WEBSITE_ORIGIN || 'http://localhost:3010',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3010',
    'http://127.0.0.1:3013'
  );
  
  // IP-based origins (for direct IP access)
  origins.push(
    `http://${publicIp}:3013`,
    `http://${publicIp}:3010`,
    `http://${publicIp}:3000`,
    `http://${publicIp}:3011`
  );
  
  // Production domains from environment variables
  const frontendDomain = process.env.FRONTEND_DOMAIN;
  const apiDomain = process.env.API_DOMAIN;
  const adminDomain = process.env.ADMIN_DOMAIN;
  
  if (frontendDomain) {
    origins.push(
      `http://${frontendDomain}`,
      `https://${frontendDomain}`,
      `http://www.${frontendDomain}`,
      `https://www.${frontendDomain}`
    );
  }
  
  if (apiDomain && apiDomain !== frontendDomain) {
    origins.push(
      `http://${apiDomain}`,
      `https://${apiDomain}`
    );
  }
  
  if (adminDomain) {
    origins.push(
      `http://${adminDomain}`,
      `https://${adminDomain}`
    );
  }
  
  // Legacy support: if using old env vars (ADMIN_ORIGIN, WEBSITE_ORIGIN with full URLs)
  if (process.env.ADMIN_ORIGIN && process.env.ADMIN_ORIGIN.startsWith('http')) {
    origins.push(process.env.ADMIN_ORIGIN);
    if (process.env.ADMIN_ORIGIN.startsWith('http://')) {
      origins.push(process.env.ADMIN_ORIGIN.replace('http://', 'https://'));
    }
  }
  
  if (process.env.WEBSITE_ORIGIN && process.env.WEBSITE_ORIGIN.startsWith('http')) {
    origins.push(process.env.WEBSITE_ORIGIN);
    if (process.env.WEBSITE_ORIGIN.startsWith('http://')) {
      origins.push(process.env.WEBSITE_ORIGIN.replace('http://', 'https://'));
    }
  }
  
  // Remove duplicates
  return [...new Set(origins)];
};

const allowedOrigins = buildAllowedOrigins();

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
app.use('/api/public/page-metadata', publicPageMetadataRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sync-metadata', syncMetadataRoutes);
app.use('/api/menu-locations', menuLocationRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/tracking-scripts', trackingScriptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/about-sections', aboutSectionRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/debug', debugSeoRoutes);
app.use('/api/page-metadata', pageMetadataRoutes);

// Ecommerce routes - COMMENTED (moved to Ecommerce Backend)
// These routes are now handled by Ecommerce Backend (port 3012)
// app.use('/api/public/products', publicProductsRoutes); // Moved to Ecommerce Backend
// app.use('/api/public/auth', publicAuthRoutes); // Moved to Ecommerce Backend
// app.use('/api/payments', paymentRoutes); // Moved to Ecommerce Backend (or keep if CMS needs to manage payments)
// app.use('/api/newsletter', newsletterRoutes); // Moved to Ecommerce Backend (or keep if CMS needs to manage newsletter)

// Orders: Admin management only (public routes moved to Ecommerce Backend)
// Note: orderRoutes contains both public (POST, GET lookup) and admin (GET, PUT, DELETE) routes
// Public routes are handled by Ecommerce Backend, admin routes remain here
app.use('/api/orders', orderRoutes); // Admin order management (public routes handled by Ecommerce Backend)

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
