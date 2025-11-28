"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const trackingScriptController_1 = require("../controllers/trackingScriptController");
const router = (0, express_1.Router)();
// Public endpoint - Get active scripts for frontend
router.get('/active', trackingScriptController_1.getActiveScripts);
// Protected routes - require auth (admin)
router.get('/', auth_1.authMiddleware, trackingScriptController_1.getTrackingScripts);
router.get('/:id', auth_1.authMiddleware, trackingScriptController_1.getTrackingScriptById);
router.post('/', auth_1.authMiddleware, trackingScriptController_1.createTrackingScript);
router.put('/:id', auth_1.authMiddleware, trackingScriptController_1.updateTrackingScript);
router.patch('/:id', auth_1.authMiddleware, trackingScriptController_1.updateTrackingScript);
router.delete('/:id', auth_1.authMiddleware, trackingScriptController_1.deleteTrackingScript);
router.patch('/:id/toggle', auth_1.authMiddleware, trackingScriptController_1.toggleTrackingScript);
exports.default = router;
//# sourceMappingURL=trackingScripts.js.map