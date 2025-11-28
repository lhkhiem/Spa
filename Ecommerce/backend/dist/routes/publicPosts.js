"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/public/postController");
const router = express_1.default.Router();
router.get('/', postController_1.listPublishedPosts);
router.get('/slug/:slug', postController_1.getPublishedPostBySlug);
exports.default = router;
//# sourceMappingURL=publicPosts.js.map