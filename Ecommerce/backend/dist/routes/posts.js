"use strict";
// Routes cho các endpoint liên quan đến Post
// - Tất cả route dưới /api/posts dành cho CMS (yêu cầu auth)
// - Public client sử dụng /api/public/posts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', postController_1.getPosts);
router.get('/slug/:slug', postController_1.getPostBySlug); // Must come before /:id to avoid conflict
router.get('/:id', postController_1.getPostById);
router.post('/', postController_1.createPost);
router.patch('/:id', postController_1.updatePost);
router.delete('/:id', postController_1.deletePost);
router.post('/:id/publish', postController_1.publishPost);
exports.default = router;
//# sourceMappingURL=posts.js.map