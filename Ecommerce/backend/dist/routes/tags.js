"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tagController_1 = require("../controllers/tagController");
const router = (0, express_1.Router)();
router.get('/', tagController_1.getTags);
router.get('/:id', tagController_1.getTagById);
router.post('/', auth_1.authMiddleware, tagController_1.createTag);
router.put('/:id', auth_1.authMiddleware, tagController_1.updateTag);
router.patch('/:id', auth_1.authMiddleware, tagController_1.updateTag);
router.delete('/:id', auth_1.authMiddleware, tagController_1.deleteTag);
exports.default = router;
//# sourceMappingURL=tags.js.map