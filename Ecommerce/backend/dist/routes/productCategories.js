"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const productCategoryController_1 = require("../controllers/productCategoryController");
const router = (0, express_1.Router)();
// Must be before /:id to avoid route conflicts
router.get('/slug/:slug', productCategoryController_1.getCategoryBySlug);
router.get('/:id/relationships', auth_1.authMiddleware, productCategoryController_1.checkCategoryRelationships);
router.get('/:id', productCategoryController_1.getCategoryById);
router.get('/', productCategoryController_1.getCategories);
router.post('/', auth_1.authMiddleware, productCategoryController_1.createCategory);
router.put('/:id', auth_1.authMiddleware, productCategoryController_1.updateCategory);
router.delete('/:id', auth_1.authMiddleware, productCategoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=productCategories.js.map