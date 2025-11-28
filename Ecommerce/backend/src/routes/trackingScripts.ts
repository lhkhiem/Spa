import { Router } from 'express';
// Admin routes removed - Ecommerce Backend only provides public endpoint
// import { authMiddleware } from '../middleware/auth';
import {
  getActiveScripts,
  // Admin functions not available in Ecommerce Backend
  // getTrackingScripts,
  // getTrackingScriptById,
  // createTrackingScript,
  // updateTrackingScript,
  // deleteTrackingScript,
  // toggleTrackingScript,
} from '../controllers/trackingScriptController';

const router = Router();

// Public endpoint - Get active scripts for frontend
router.get('/active', getActiveScripts);

// Admin routes - COMMENTED (CMS Backend only)
// router.get('/', authMiddleware, getTrackingScripts);
// router.get('/:id', authMiddleware, getTrackingScriptById);
// router.post('/', authMiddleware, createTrackingScript);
// router.put('/:id', authMiddleware, updateTrackingScript);
// router.patch('/:id', authMiddleware, updateTrackingScript);
// router.delete('/:id', authMiddleware, deleteTrackingScript);
// router.patch('/:id/toggle', authMiddleware, toggleTrackingScript);

export default router;


