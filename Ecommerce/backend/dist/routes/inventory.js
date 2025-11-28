"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const inventoryController_1 = require("../controllers/inventoryController");
const router = (0, express_1.Router)();
// All inventory routes require authentication
router.use(auth_1.authMiddleware);
// Dashboard stats
router.get('/stats', inventoryController_1.getInventoryStats);
// Product list with inventory info
router.get('/products', inventoryController_1.getInventoryProducts);
// Stock movements
router.get('/products/:productId/movements', inventoryController_1.getProductMovements);
// Stock adjustment
router.post('/adjust', inventoryController_1.adjustStock);
router.post('/bulk-adjust', inventoryController_1.bulkAdjustStock);
// Low stock alerts
router.get('/alerts', inventoryController_1.getLowStockAlerts);
// Stock settings
router.get('/products/:productId/settings', inventoryController_1.getStockSettings);
router.put('/products/:productId/settings', inventoryController_1.updateStockSettings);
exports.default = router;
//# sourceMappingURL=inventory.js.map