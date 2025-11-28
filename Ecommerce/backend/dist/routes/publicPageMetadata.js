"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pageMetadataController_1 = require("../controllers/public/pageMetadataController");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// Debug endpoint to check all SEO data - MUST be before :path(*) route
router.get('/-debug-all', async (req, res) => {
    try {
        const [seoRow] = await database_1.default.query('SELECT value FROM settings WHERE namespace = :ns', {
            type: 'SELECT',
            replacements: { ns: 'seo' },
        });
        const seoSettings = seoRow?.[0]?.value || { pages: [] };
        res.json(seoSettings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Public route - no auth required
// Path can include slashes, so we use :path(*) to match everything
router.get('/:path(*)', pageMetadataController_1.getPageMetadata);
exports.default = router;
//# sourceMappingURL=publicPageMetadata.js.map