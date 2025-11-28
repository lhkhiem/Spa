"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const topicController_1 = require("../controllers/topicController");
const router = (0, express_1.Router)();
router.get('/', topicController_1.getTopics);
router.get('/:id', topicController_1.getTopicById);
router.post('/', auth_1.authMiddleware, topicController_1.createTopic);
router.put('/:id', auth_1.authMiddleware, topicController_1.updateTopic);
router.patch('/:id', auth_1.authMiddleware, topicController_1.updateTopic);
router.delete('/:id', auth_1.authMiddleware, topicController_1.deleteTopic);
router.post('/bulk/update-order', auth_1.authMiddleware, topicController_1.updateTopicsOrder);
exports.default = router;
//# sourceMappingURL=topics.js.map