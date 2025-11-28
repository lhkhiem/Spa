"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const brandController_1 = require("../controllers/brandController");
const router = (0, express_1.Router)();
router.get('/', brandController_1.getBrands);
router.get('/slug/:slug', brandController_1.getBrandBySlug);
router.get('/:id', brandController_1.getBrandById);
router.post('/', auth_1.authMiddleware, brandController_1.createBrand);
router.put('/:id', auth_1.authMiddleware, brandController_1.updateBrand);
router.delete('/:id', auth_1.authMiddleware, brandController_1.deleteBrand);
exports.default = router;
//# sourceMappingURL=brands.js.map