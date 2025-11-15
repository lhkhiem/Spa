import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import { 
  listFolders, 
  createFolder,
  renameFolder,
  deleteFolder,
  uploadMedia,
  listMedia,
  updateMedia,
  renameMedia,
  deleteMedia
} from '../controllers/mediaController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'storage', 'temp'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Media routes
router.get('/', authMiddleware, listMedia);
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);
router.put('/:id', authMiddleware, updateMedia);
router.post('/:id/rename', authMiddleware, renameMedia);
router.delete('/:id', authMiddleware, deleteMedia);

// Folder routes
router.get('/folders', authMiddleware, listFolders);
router.post('/folders', authMiddleware, createFolder);
router.put('/folders/:id', authMiddleware, renameFolder);
router.delete('/folders/:id', authMiddleware, deleteFolder);

export default router;
