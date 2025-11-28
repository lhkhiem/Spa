"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const consultationController_1 = require("../controllers/consultationController");
const router = (0, express_1.Router)();
// Public route - submit consultation form
router.post('/', consultationController_1.submitConsultation);
// Admin routes - require authentication
router.get('/stats', auth_1.authMiddleware, consultationController_1.getConsultationStats);
router.get('/', auth_1.authMiddleware, consultationController_1.getConsultations);
router.get('/:id', auth_1.authMiddleware, consultationController_1.getConsultationById);
router.put('/:id', auth_1.authMiddleware, consultationController_1.updateConsultation);
router.delete('/:id', auth_1.authMiddleware, consultationController_1.deleteConsultation);
exports.default = router;
//# sourceMappingURL=consultations.js.map