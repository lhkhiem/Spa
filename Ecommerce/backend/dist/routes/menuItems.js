"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const menuItemController_1 = require("../controllers/menuItemController");
const router = (0, express_1.Router)();
router.get('/', menuItemController_1.getMenuItems);
router.get('/:id', menuItemController_1.getMenuItemById);
router.post('/', auth_1.authMiddleware, menuItemController_1.createMenuItem);
router.put('/:id', auth_1.authMiddleware, menuItemController_1.updateMenuItem);
router.patch('/:id', auth_1.authMiddleware, menuItemController_1.updateMenuItem);
router.delete('/:id', auth_1.authMiddleware, menuItemController_1.deleteMenuItem);
router.post('/bulk/update-order', auth_1.authMiddleware, menuItemController_1.updateMenuItemsOrder);
exports.default = router;
//# sourceMappingURL=menuItems.js.map