"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
// Public route - submit contact form
router.post('/', contactController_1.submitContact);
// Admin routes - require authentication
router.get('/stats', auth_1.authMiddleware, contactController_1.getContactStats);
router.get('/', auth_1.authMiddleware, contactController_1.getContacts);
router.get('/:id', auth_1.authMiddleware, contactController_1.getContactById);
router.put('/:id', auth_1.authMiddleware, contactController_1.updateContact);
router.delete('/:id', auth_1.authMiddleware, contactController_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contacts.js.map