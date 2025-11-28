// Ecommerce Backend - Public read only
import { Router } from 'express';
import {
  getBrands,
  getBrandBySlug,
} from '../controllers/brandController';

const router = Router();

// Public GET routes only
router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);

// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.get('/:id', getBrandById);
// router.post('/', authMiddleware, createBrand);
// router.put('/:id', authMiddleware, updateBrand);
// router.delete('/:id', authMiddleware, deleteBrand);

export default router;
