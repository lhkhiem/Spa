"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.ready = ready;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const promises_1 = __importDefault(require("fs/promises"));
const database_1 = __importDefault(require("./config/database"));
// Import models to initialize associations
require("./models");
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const topics_1 = __importDefault(require("./routes/topics"));
const tags_1 = __importDefault(require("./routes/tags"));
const products_1 = __importDefault(require("./routes/products"));
const productCategories_1 = __importDefault(require("./routes/productCategories"));
const brands_1 = __importDefault(require("./routes/brands"));
const assets_1 = __importDefault(require("./routes/assets"));
const users_1 = __importDefault(require("./routes/users")); // Admin users for post authors
const settings_1 = __importDefault(require("./routes/settings"));
const media_1 = __importDefault(require("./routes/media"));
const health_1 = __importDefault(require("./routes/health"));
const menuLocations_1 = __importDefault(require("./routes/menuLocations"));
const menuItems_1 = __importDefault(require("./routes/menuItems"));
// import cartRoutes from './routes/cart'; // Disabled: Customer cart management not needed
const orders_1 = __importDefault(require("./routes/orders")); // Admin order management (not customer management)
const payments_1 = __importDefault(require("./routes/payments")); // Payment gateway (ZaloPay)
// import wishlistRoutes from './routes/wishlist'; // Disabled: Customer wishlist management not needed
// import reviewRoutes from './routes/reviews'; // Disabled: Customer review management not needed
const trackingScripts_1 = __importDefault(require("./routes/trackingScripts"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const homepage_1 = __importDefault(require("./routes/homepage"));
const sliders_1 = __importDefault(require("./routes/sliders"));
const aboutSections_1 = __importDefault(require("./routes/aboutSections"));
const publicPosts_1 = __importDefault(require("./routes/publicPosts"));
const publicHomepage_1 = __importDefault(require("./routes/publicHomepage"));
const publicProducts_1 = __importDefault(require("./routes/publicProducts"));
const publicPageMetadata_1 = __importDefault(require("./routes/publicPageMetadata"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const consultations_1 = __importDefault(require("./routes/consultations"));
const email_1 = __importDefault(require("./routes/email"));
const publicAuth_1 = __importDefault(require("./routes/publicAuth")); // Customer authentication
const inventory_1 = __importDefault(require("./routes/inventory")); // Inventory management
const activityLogs_1 = __importDefault(require("./routes/activityLogs")); // Activity tracking
const syncMetadata_1 = __importDefault(require("./routes/syncMetadata")); // Metadata sync
const debugSeo_1 = __importDefault(require("./routes/debugSeo")); // Debug SEO
const pageMetadata_1 = __importDefault(require("./routes/pageMetadata")); // Page metadata CRUD
const newsletter_1 = __importDefault(require("./routes/newsletter")); // Newsletter subscriptions
// import publicUserRoutes from './routes/publicUser'; // Disabled: Customer user management not needed
// import publicOrdersRoutes from './routes/publicOrders'; // Disabled: Customer orders not needed
// import publicCartRoutes from './routes/publicCart'; // Disabled: Customer cart not needed
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const publicIp = process.env.PUBLIC_IP || '14.225.205.116';
// Build allowed origins from environment variables
const buildAllowedOrigins = () => {
    const origins = [];
    // Development origins (always include)
    origins.push(process.env.ADMIN_ORIGIN || 'http://localhost:3013', process.env.WEBSITE_ORIGIN || 'http://localhost:3010', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:3010', 'http://127.0.0.1:3013');
    // IP-based origins (for direct IP access)
    origins.push(`http://${publicIp}:3013`, `http://${publicIp}:3010`, `http://${publicIp}:3000`, `http://${publicIp}:3011`);
    // Production domains from environment variables
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    const apiDomain = process.env.API_DOMAIN;
    const adminDomain = process.env.ADMIN_DOMAIN;
    if (frontendDomain) {
        origins.push(`http://${frontendDomain}`, `https://${frontendDomain}`, `http://www.${frontendDomain}`, `https://www.${frontendDomain}`);
    }
    if (apiDomain && apiDomain !== frontendDomain) {
        origins.push(`http://${apiDomain}`, `https://${apiDomain}`);
    }
    if (adminDomain) {
        origins.push(`http://${adminDomain}`, `https://${adminDomain}`);
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
exports.app.use((0, cors_1.default)({
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
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
exports.app.use((0, cookie_parser_1.default)());
// Routes
exports.app.use('/api/auth', auth_1.default);
exports.app.use('/api/posts', posts_1.default);
exports.app.use('/api/topics', topics_1.default);
exports.app.use('/api/tags', tags_1.default);
exports.app.use('/api/product-categories', productCategories_1.default);
exports.app.use('/api/brands', brands_1.default);
exports.app.use('/api/products', products_1.default);
exports.app.use('/api/assets', assets_1.default);
exports.app.use('/api/users', users_1.default); // Admin users for post authors
exports.app.use('/api/settings', settings_1.default);
exports.app.use('/api/media', media_1.default);
exports.app.use('/api/health', health_1.default);
exports.app.use('/api/public/posts', publicPosts_1.default);
exports.app.use('/api/public/homepage', publicHomepage_1.default);
exports.app.use('/api/public/products', publicProducts_1.default);
exports.app.use('/api/public/page-metadata', publicPageMetadata_1.default);
exports.app.use('/api/contacts', contacts_1.default);
exports.app.use('/api/consultations', consultations_1.default);
exports.app.use('/api/email', email_1.default);
exports.app.use('/api/inventory', inventory_1.default);
exports.app.use('/api/sync-metadata', syncMetadata_1.default);
exports.app.use('/api/public/auth', publicAuth_1.default); // Customer authentication
// app.use('/api/public/user', publicUserRoutes); // Disabled: Customer user management not needed
// app.use('/api/public/orders', publicOrdersRoutes); // Disabled: Customer orders not needed
// app.use('/api/public/cart', publicCartRoutes); // Disabled: Customer cart not needed
exports.app.use('/api/menu-locations', menuLocations_1.default);
exports.app.use('/api/menu-items', menuItems_1.default);
// app.use('/api/cart', cartRoutes); // Disabled: Customer cart management not needed
exports.app.use('/api/orders', orders_1.default); // Admin order management (not customer management)
exports.app.use('/api/payments', payments_1.default); // Payment gateway (ZaloPay)
// app.use('/api/wishlist', wishlistRoutes); // Disabled: Customer wishlist management not needed
// app.use('/api/reviews', reviewRoutes); // Disabled: Customer review management not needed
exports.app.use('/api/tracking-scripts', trackingScripts_1.default);
exports.app.use('/api/analytics', analytics_1.default);
exports.app.use('/api/homepage', homepage_1.default);
exports.app.use('/api/sliders', sliders_1.default);
exports.app.use('/api/about-sections', aboutSections_1.default);
exports.app.use('/api/activity-logs', activityLogs_1.default);
exports.app.use('/api/debug', debugSeo_1.default);
exports.app.use('/api/page-metadata', pageMetadata_1.default);
exports.app.use('/api/newsletter', newsletter_1.default);
// Ensure upload and temp dirs on boot and serve uploads
(async () => {
    try {
        const uploadDir = process.env.UPLOAD_PATH || path_1.default.resolve(__dirname, '../storage/uploads');
        const tempDir = path_1.default.resolve(__dirname, '../storage/temp');
        await promises_1.default.mkdir(uploadDir, { recursive: true });
        await promises_1.default.mkdir(tempDir, { recursive: true });
        // Static: serve uploads from storage/uploads to keep public URL stable as /uploads
        exports.app.use('/uploads', express_1.default.static(uploadDir));
        // Fallback to legacy uploads dir if file not found in storage
        exports.app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to ensure upload/temp dirs:', e);
    }
})();
// Basic health root handled in healthRoutes
async function ready() {
    await database_1.default.authenticate();
    // Ensure one owner exists
    try {
        const [owner] = await database_1.default.query(`SELECT id FROM users WHERE role = 'owner' LIMIT 1`, { type: 'SELECT' });
        if (!owner?.id) {
            const first = await database_1.default.query(`SELECT id FROM users ORDER BY created_at ASC LIMIT 1`, { type: 'SELECT' });
            const id = first[0]?.id;
            if (id) {
                await database_1.default.query(`UPDATE users SET role = 'owner' WHERE id = :id`, { type: 'UPDATE', replacements: { id } });
                // eslint-disable-next-line no-console
                console.log('Promoted earliest user to owner');
            }
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Owner bootstrap failed or skipped:', e);
    }
}
//# sourceMappingURL=app.js.map