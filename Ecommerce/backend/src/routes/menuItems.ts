import { Router } from 'express';
// Admin routes removed - Ecommerce Backend only provides public GET endpoints
// import { authMiddleware } from '../middleware/auth';
import {
  getMenuItems,
  getMenuItemById,
  // Admin functions not available in Ecommerce Backend
  // createMenuItem,
  // updateMenuItem,
  // deleteMenuItem,
  // updateMenuItemsOrder
} from '../controllers/menuItemController';

const router = Router();

// Public GET routes only
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.post('/', authMiddleware, createMenuItem);
// router.put('/:id', authMiddleware, updateMenuItem);
// router.patch('/:id', authMiddleware, updateMenuItem);
// router.delete('/:id', authMiddleware, deleteMenuItem);
// router.post('/bulk/update-order', authMiddleware, updateMenuItemsOrder);

export default router;
