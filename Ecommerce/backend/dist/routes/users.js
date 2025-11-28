"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const usersController_1 = require("../controllers/usersController");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, usersController_1.listUsers);
router.post('/', auth_1.authMiddleware, usersController_1.createUser);
router.put('/:id', auth_1.authMiddleware, usersController_1.updateUser);
router.delete('/:id', auth_1.authMiddleware, usersController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map