"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const pageMetadataController_1 = require("../controllers/pageMetadataController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Get all page metadata
router.get('/', pageMetadataController_1.getAllPageMetadata);
// Get single page metadata
router.get('/:path(*)', pageMetadataController_1.getPageMetadata);
// Create or update page metadata
router.post('/', pageMetadataController_1.savePageMetadata);
router.put('/:path(*)', pageMetadataController_1.savePageMetadata);
router.patch('/:path(*)', pageMetadataController_1.savePageMetadata);
// Delete page metadata
router.delete('/:path(*)', pageMetadataController_1.deletePageMetadata);
exports.default = router;
//# sourceMappingURL=pageMetadata.js.map