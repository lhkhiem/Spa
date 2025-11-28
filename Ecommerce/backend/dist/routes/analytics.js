"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
// Public endpoint - Track pageview
router.post('/track', analyticsController_1.trackPageview);
// Protected routes - require auth (admin)
router.get('/stats', auth_1.authMiddleware, analyticsController_1.getAnalyticsStats);
router.get('/realtime', auth_1.authMiddleware, analyticsController_1.getRealtimeStats);
exports.default = router;
//# sourceMappingURL=analytics.js.map