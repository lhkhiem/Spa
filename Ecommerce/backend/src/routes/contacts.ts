import { Router } from 'express';
// Only public route for ecommerce backend - admin routes are in CMS backend
import {
  submitContact,
} from '../controllers/contactController';

const router = Router();

// Public route - submit contact form
router.post('/', submitContact);

// Note: Admin routes (GET, PUT, DELETE, stats) are handled by CMS backend
// Ecommerce backend only handles public form submissions

export default router;







