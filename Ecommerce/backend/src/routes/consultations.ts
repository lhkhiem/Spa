import { Router } from 'express';
// Only public route for ecommerce backend - admin routes are in CMS backend
import {
  submitConsultation,
} from '../controllers/consultationController';

const router = Router();

// Public route - submit consultation form
router.post('/', submitConsultation);

// Note: Admin routes (GET, PUT, DELETE) are handled by CMS backend
// Ecommerce backend only handles public form submissions

export default router;

