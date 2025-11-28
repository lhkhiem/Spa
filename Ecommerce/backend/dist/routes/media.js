"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const mediaController_1 = require("../controllers/mediaController");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), 'storage', 'temp'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max (will be compressed to webp)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});
// Error handler for multer
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error('[handleMulterError] Multer error:', err);
        console.error('[handleMulterError] Error code:', err.code);
        console.error('[handleMulterError] Error message:', err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.log('[handleMulterError] File size limit exceeded');
            return res.status(413).json({
                error: 'File quá lớn. Giới hạn tối đa là 100MB. File sẽ được nén sau khi upload.'
            });
        }
        if (err.message?.includes('Only image files')) {
            console.log('[handleMulterError] Invalid file type');
            return res.status(400).json({
                error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'
            });
        }
        console.log('[handleMulterError] Generic multer error');
        return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    next();
};
// Media routes
router.get('/', auth_1.authMiddleware, mediaController_1.listMedia);
router.post('/upload', auth_1.authMiddleware, upload.single('file'), handleMulterError, mediaController_1.uploadMedia);
router.post('/upload/by-url', auth_1.authMiddleware, mediaController_1.uploadMediaFromUrl);
router.put('/:id', auth_1.authMiddleware, mediaController_1.updateMedia);
router.post('/:id/rename', auth_1.authMiddleware, mediaController_1.renameMedia);
router.delete('/:id', auth_1.authMiddleware, mediaController_1.deleteMedia);
// Folder routes
router.get('/folders', auth_1.authMiddleware, mediaController_1.listFolders);
router.post('/folders', auth_1.authMiddleware, mediaController_1.createFolder);
router.put('/folders/:id', auth_1.authMiddleware, mediaController_1.renameFolder);
router.delete('/folders/:id', auth_1.authMiddleware, mediaController_1.deleteFolder);
exports.default = router;
//# sourceMappingURL=media.js.map