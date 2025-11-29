// Ecommerce Backend - Public APIs only
// Independent from CMS Backend
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import sequelize from './config/database';
// Import models to initialize associations
import './models';

// Public routes only
import publicProductsRoutes from './routes/publicProducts';
import publicAuthRoutes from './routes/publicAuth'; // Customer authentication
import publicHomepageRoutes from './routes/publicHomepage'; // Homepage data (hero, testimonials, etc.)
import publicPostsRoutes from './routes/publicPosts'; // Public blog posts
import orderRoutes from './routes/orders'; // Create order + lookup
import paymentRoutes from './routes/payments'; // Payment gateway (ZaloPay)
import newsletterRoutes from './routes/newsletter'; // Newsletter subscriptions
import trackingScriptRoutes from './routes/trackingScripts'; // Tracking scripts (analytics)
import menuLocationRoutes from './routes/menuLocations'; // Menu locations (public GET only)
import menuItemRoutes from './routes/menuItems'; // Menu items (public GET only)
import healthRoutes from './routes/health';

// Public read routes (modify to remove admin CRUD)
import productCategoryRoutes from './routes/productCategories'; // Only GET routes
import brandRoutes from './routes/brands'; // Only GET routes

// CMS-only routes - COMMENTED (not used in Ecommerce Backend)
// import authRoutes from './routes/auth'; // Admin auth - CMS only
// import postRoutes from './routes/posts'; // CMS only
// import topicRoutes from './routes/topics'; // CMS only
// import tagRoutes from './routes/tags'; // CMS only
// import productRoutes from './routes/products'; // Admin CRUD - CMS only
// import assetRoutes from './routes/assets'; // CMS only
// import usersRoutes from './routes/users'; // Admin users - CMS only
// import settingsRoutes from './routes/settings'; // CMS only
// import mediaRoutes from './routes/media'; // CMS only
// import menuLocationRoutes from './routes/menuLocations'; // CMS only
// import menuItemRoutes from './routes/menuItems'; // CMS only
// import trackingScriptRoutes from './routes/trackingScripts'; // CMS only
import analyticsRoutes from './routes/analytics'; // Public analytics tracking
// import homepageRoutes from './routes/homepage'; // CMS only
// import sliderRoutes from './routes/sliders'; // CMS only
// import aboutSectionRoutes from './routes/aboutSections'; // CMS only
// import publicPostsRoutes from './routes/publicPosts'; // CMS only
// import publicHomepageRoutes from './routes/publicHomepage'; // CMS only
// import publicPageMetadataRoutes from './routes/publicPageMetadata'; // CMS only
import contactRoutes from './routes/contacts'; // Public contact form submissions
import consultationRoutes from './routes/consultations'; // Public consultation form submissions
// import emailRoutes from './routes/email'; // CMS only
// import inventoryRoutes from './routes/inventory'; // CMS only
// import activityLogRoutes from './routes/activityLogs'; // CMS only
// import syncMetadataRoutes from './routes/syncMetadata'; // CMS only
// import debugSeoRoutes from './routes/debugSeo'; // CMS only
// import pageMetadataRoutes from './routes/pageMetadata'; // CMS only

dotenv.config();

export const app = express();

// Middleware
// CORS - chỉ cho phép Ecommerce Frontend
const buildAllowedOrigins = (): string[] => {
  const origins: string[] = [];
  
  // Development origins
  origins.push(
    process.env.ECOMMERCE_FRONTEND_ORIGIN || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  );
  
  // Production domains
  const frontendDomain = process.env.FRONTEND_DOMAIN;
  if (frontendDomain) {
    origins.push(
      `http://${frontendDomain}`,
      `https://${frontendDomain}`,
      `http://www.${frontendDomain}`,
      `https://www.${frontendDomain}`
    );
  }
  
  // Explicitly add banyco.vn domains
  origins.push(
    'https://banyco.vn',
    'http://banyco.vn',
    'https://www.banyco.vn',
    'http://www.banyco.vn'
  );
  
  // Legacy support
  if (process.env.WEBSITE_ORIGIN && process.env.WEBSITE_ORIGIN.startsWith('http')) {
    origins.push(process.env.WEBSITE_ORIGIN);
    if (process.env.WEBSITE_ORIGIN.startsWith('http://')) {
      origins.push(process.env.WEBSITE_ORIGIN.replace('http://', 'https://'));
    }
  }
  
  return [...new Set(origins)];
};

const allowedOrigins = buildAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Origin not allowed: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Ecommerce Public Routes
app.use('/api/products', publicProductsRoutes); // Public product listing & detail
app.use('/api/product-categories', productCategoryRoutes); // Public category listing (GET only)
app.use('/api/brands', brandRoutes); // Public brand listing (GET only)
app.use('/api/public/homepage', publicHomepageRoutes); // Homepage data (hero, testimonials, etc.)
app.use('/api/public/posts', publicPostsRoutes); // Public blog posts
app.use('/api/menu-locations', menuLocationRoutes); // Menu locations (public GET only)
app.use('/api/menu-items', menuItemRoutes); // Menu items (public GET only)
app.use('/api/orders', orderRoutes); // Create order + lookup (POST, GET)
app.use('/api/payments', paymentRoutes); // Payment gateway (ZaloPay)
app.use('/api/auth', publicAuthRoutes); // Customer authentication
app.use('/api/newsletter', newsletterRoutes); // Newsletter subscriptions
app.use('/api/consultations', consultationRoutes); // Consultation form submissions (public POST only)
app.use('/api/contacts', contactRoutes); // Contact form submissions (public POST only)
app.use('/api/analytics', analyticsRoutes); // Analytics tracking (public POST /track only)
app.use('/api/tracking-scripts', trackingScriptRoutes); // Tracking scripts (analytics) - public endpoint only
app.use('/api/health', healthRoutes); // Health check

// Ensure upload and temp dirs on boot and serve uploads
(async () => {
  try {
    // Use absolute path from project root (not relative to dist/)
    // __dirname in compiled code: /var/www/Spa/Ecommerce/backend/dist
    // Go up to project root: /var/www/Spa
    const projectRoot = path.resolve(__dirname, '../../../');
    const cmsUploadDir = path.join(projectRoot, 'CMS/backend/storage/uploads');
    const ecommerceUploadDir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../storage/uploads');
    const tempDir = path.resolve(__dirname, '../storage/temp');
    
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    
    // Check if CMS storage exists and is accessible
    let uploadDir = cmsUploadDir;
    try {
      const stats = await fs.stat(cmsUploadDir);
      if (stats.isDirectory()) {
        uploadDir = cmsUploadDir;
        console.log('[Ecommerce Backend] Serving uploads from CMS storage:', uploadDir);
      }
    } catch (e) {
      // CMS storage not available, try to use ecommerce storage
      try {
        await fs.mkdir(ecommerceUploadDir, { recursive: true });
        uploadDir = ecommerceUploadDir;
        console.log('[Ecommerce Backend] Serving uploads from ecommerce storage:', uploadDir);
      } catch (mkdirError) {
        console.warn('[Ecommerce Backend] Failed to create ecommerce upload dir:', mkdirError);
      }
    }
    
    // Serve uploads - CMS storage first (shared), then fallbacks
    app.use('/uploads', express.static(uploadDir));
    app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
  } catch (e) {
    console.warn('Failed to ensure upload/temp dirs:', e);
  }
})();

export async function ready() {
  await sequelize.authenticate();
  console.log('Ecommerce Backend: Database connected');
}
