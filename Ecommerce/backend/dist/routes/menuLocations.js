"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const menuLocationController_1 = require("../controllers/menuLocationController");
const router = (0, express_1.Router)();
router.get('/', menuLocationController_1.getMenuLocations);
router.get('/:id', menuLocationController_1.getMenuLocationById);
router.post('/', auth_1.authMiddleware, menuLocationController_1.createMenuLocation);
router.put('/:id', auth_1.authMiddleware, menuLocationController_1.updateMenuLocation);
router.patch('/:id', auth_1.authMiddleware, menuLocationController_1.updateMenuLocation);
router.delete('/:id', auth_1.authMiddleware, menuLocationController_1.deleteMenuLocation);
exports.default = router;
//# sourceMappingURL=menuLocations.js.map