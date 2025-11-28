import { Router } from 'express';
// Admin routes removed - Ecommerce Backend only provides public GET endpoints
// import { authMiddleware } from '../middleware/auth';
import {
  getMenuLocations,
  getMenuLocationById,
  // Admin functions not available in Ecommerce Backend
  // createMenuLocation,
  // updateMenuLocation,
  // deleteMenuLocation
} from '../controllers/menuLocationController';

const router = Router();

// Public GET routes only
router.get('/', getMenuLocations);
router.get('/:id', getMenuLocationById);

// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.post('/', authMiddleware, createMenuLocation);
// router.put('/:id', authMiddleware, updateMenuLocation);
// router.patch('/:id', authMiddleware, updateMenuLocation);
// router.delete('/:id', authMiddleware, deleteMenuLocation);

export default router;






































