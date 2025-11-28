// Ecommerce Backend - Public read only
import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
} from '../controllers/productCategoryController';

const router = Router();

// Public GET routes only
router.get('/slug/:slug', getCategoryBySlug);
router.get('/', getCategories);

// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.get('/:id/relationships', authMiddleware, checkCategoryRelationships);
// router.get('/:id', getCategoryById);
// router.post('/', authMiddleware, createCategory);
// router.put('/:id', authMiddleware, updateCategory);
// router.delete('/:id', authMiddleware, deleteCategory);

export default router;
