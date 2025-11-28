"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
// Test email configuration
router.get('/test', auth_1.authMiddleware, emailController_1.testEmailConfig);
// Send test email
router.post('/test-send', auth_1.authMiddleware, emailController_1.sendTestEmail);
exports.default = router;
//# sourceMappingURL=email.js.map