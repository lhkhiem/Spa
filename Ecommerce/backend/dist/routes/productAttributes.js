"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const productAttributeController_1 = require("../controllers/productAttributeController");
const router = (0, express_1.Router)();
router.get('/', productAttributeController_1.getProductAttributes);
router.get('/:id', productAttributeController_1.getProductAttributeById);
router.post('/', auth_1.authMiddleware, productAttributeController_1.createProductAttribute);
router.put('/:id', auth_1.authMiddleware, productAttributeController_1.updateProductAttribute);
router.patch('/:id', auth_1.authMiddleware, productAttributeController_1.updateProductAttribute);
router.delete('/:id', auth_1.authMiddleware, productAttributeController_1.deleteProductAttribute);
exports.default = router;
//# sourceMappingURL=productAttributes.js.map