"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const settingsController_1 = require("../controllers/settingsController");
const router = (0, express_1.Router)();
router.get('/:namespace', auth_1.authMiddleware, settingsController_1.getNamespace);
router.put('/:namespace', auth_1.authMiddleware, settingsController_1.putNamespace);
router.post('/clear-cache', auth_1.authMiddleware, settingsController_1.clearCache);
router.post('/reset-default', auth_1.authMiddleware, settingsController_1.resetDefaults);
exports.default = router;
//# sourceMappingURL=settings.js.map