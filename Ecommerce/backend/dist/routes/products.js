"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Public routes
router.get('/', productController_1.getProducts);
router.get('/featured', productController_1.getFeaturedProducts);
router.get('/best-sellers', productController_1.getBestSellers);
router.get('/:id', productController_1.getProductById);
// Protected routes
router.post('/import', auth_1.authMiddleware, upload.single('file'), productController_1.importProducts);
router.post('/', auth_1.authMiddleware, productController_1.createProduct);
router.put('/:id', auth_1.authMiddleware, productController_1.updateProduct);
router.patch('/:id', auth_1.authMiddleware, productController_1.updateProduct);
router.delete('/:id', auth_1.authMiddleware, productController_1.deleteProduct);
router.post('/:id/publish', auth_1.authMiddleware, productController_1.publishProduct);
router.post('/:id/duplicate', auth_1.authMiddleware, productController_1.duplicateProduct);
exports.default = router;
//# sourceMappingURL=products.js.map