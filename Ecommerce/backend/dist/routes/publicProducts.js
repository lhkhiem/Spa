"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/public/productController");
const router = (0, express_1.Router)();
// Danh sách sản phẩm public với filter/sort/pagination
router.get('/', productController_1.listProducts);
// Chi tiết sản phẩm theo slug
router.get('/:slug', productController_1.getProductDetail);
exports.default = router;
//# sourceMappingURL=publicProducts.js.map