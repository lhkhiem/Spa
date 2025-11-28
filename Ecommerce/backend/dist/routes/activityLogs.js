"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const activityLogController_1 = require("../controllers/activityLogController");
const router = (0, express_1.Router)();
// Get recent activities (protected - admin only)
router.get('/', auth_1.authMiddleware, activityLogController_1.getRecentActivities);
exports.default = router;
//# sourceMappingURL=activityLogs.js.map