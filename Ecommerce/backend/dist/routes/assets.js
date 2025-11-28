"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const assetController_1 = require("../controllers/assetController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/', assetController_1.listAssets);
router.get('/folders', assetController_1.listFolders);
router.get('/:id', assetController_1.getAssetById);
router.post('/folders', auth_1.authMiddleware, assetController_1.createFolder);
router.post('/upload', auth_1.authMiddleware, upload.single('file'), assetController_1.uploadFile);
router.post('/fetch', auth_1.authMiddleware, assetController_1.fetchRemote);
router.delete('/:id', auth_1.authMiddleware, assetController_1.deleteAsset);
exports.default = router;
//# sourceMappingURL=assets.js.map