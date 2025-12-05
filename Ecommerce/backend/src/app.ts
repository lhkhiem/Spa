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
import publicSettingsRoutes from './routes/publicSettings'; // Read-only storefront settings (logo, favicon, etc.)

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
import publicPageMetadataRoutes from './routes/publicPageMetadata'; // Public SEO metadata for pages
import publicFAQsRoutes from './routes/publicFAQs'; // Public FAQs
import publicAboutSectionsRoutes from './routes/publicAboutSections'; // Public About Sections
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

// ✅ SECURITY: Rate limiting để chống DDoS và brute force
const rateLimitStore = new Map<string, { count: number; resetTime: number; blocked?: boolean; blockUntil?: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

app.use((req, res, next) => {
  const ip = req.ip || 
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
    req.connection.remoteAddress || 
    'unknown';
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  // Check if IP is blocked
  if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
    const remainingTime = Math.ceil((entry.blockUntil - now) / 1000 / 60);
    console.warn(`[RateLimit] Blocked IP ${ip} - ${remainingTime} minutes remaining`);
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Your IP has been temporarily blocked.',
      retryAfter: remainingTime,
    });
  }
  
  // Reset if block expired
  if (entry?.blocked && entry.blockUntil && entry.blockUntil <= now) {
    rateLimitStore.delete(ip);
  }
  
  // Rate limiting: 150 requests per 15 minutes for public API (higher than CMS)
  const maxRequests = 150;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const blockDuration = 60 * 60 * 1000; // 1 hour if exceeded
  
  if (entry && entry.resetTime > now) {
    if (entry.count >= maxRequests) {
      // Exceeded limit - block IP
      entry.blocked = true;
      entry.blockUntil = now + blockDuration;
      console.warn(`[RateLimit] IP ${ip} exceeded limit - blocked for ${blockDuration / 1000 / 60} minutes`);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Your IP has been temporarily blocked.',
        retryAfter: Math.ceil(blockDuration / 1000 / 60),
      });
    }
    entry.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
  }
  
  // Add rate limit headers
  const currentEntry = rateLimitStore.get(ip);
  if (currentEntry) {
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - currentEntry.count));
    res.setHeader('X-RateLimit-Reset', new Date(currentEntry.resetTime).toISOString());
  }
  
  next();
});

// ✅ SECURITY: Security headers để chống các tấn công phổ biến
app.use((req, res, next) => {
  // Xóa headers có thể leak thông tin server
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS (chỉ cho HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: http:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  );
  
  // Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  );
  
  // Prevent caching of sensitive data
  if (req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Ecommerce Public Routes
app.use('/api/products', publicProductsRoutes); // Public product listing & detail
app.use('/api/product-categories', productCategoryRoutes); // Public category listing (GET only)
app.use('/api/brands', brandRoutes); // Public brand listing (GET only)
app.use('/api/public/homepage', publicHomepageRoutes); // Homepage data (hero, testimonials, etc.)
app.use('/api/public/posts', publicPostsRoutes); // Public blog posts
app.use('/api/menu-locations', menuLocationRoutes); // Menu locations (public GET only)
app.use('/api/menu-items', menuItemRoutes); // Menu items (public GET only)
app.use('/api/public/settings', publicSettingsRoutes); // Public read-only settings (appearance, etc.)
app.use('/api/orders', orderRoutes); // Create order + lookup (POST, GET)
app.use('/api/payments', paymentRoutes); // Payment gateway (ZaloPay)
app.use('/api/auth', publicAuthRoutes); // Customer authentication
app.use('/api/newsletter', newsletterRoutes); // Newsletter subscriptions
app.use('/api/consultations', consultationRoutes); // Consultation form submissions (public POST only)
app.use('/api/contacts', contactRoutes); // Contact form submissions (public POST only)
app.use('/api/analytics', analyticsRoutes); // Analytics tracking (public POST /track only)
app.use('/api/tracking-scripts', trackingScriptRoutes); // Tracking scripts (analytics) - public endpoint only
app.use('/api/public/page-metadata', publicPageMetadataRoutes); // Public SEO metadata (used by ecommerce frontend)
app.use('/api/public/faqs', publicFAQsRoutes); // Public FAQs (used by ecommerce frontend)
app.use('/api/public/about-sections', publicAboutSectionsRoutes); // Public About Sections (used by ecommerce frontend)
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
    // Add CORS headers for static files (images) - allow all origins for images
    const staticOptions = {
      setHeaders: (res: express.Response, filePath: string) => {
        // Allow all origins for images (no CORS restrictions for static assets)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      }
    };
    
    app.use('/uploads', express.static(uploadDir, staticOptions));
    app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'), staticOptions));
  } catch (e) {
    console.warn('Failed to ensure upload/temp dirs:', e);
  }
})();

export async function ready() {
  await sequelize.authenticate();
  console.log('Ecommerce Backend: Database connected');
}
