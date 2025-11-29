import { Router } from 'express';
// Only public route for ecommerce backend - admin routes are in CMS backend
import {
  trackPageview,
} from '../controllers/analyticsController';

const router = Router();

// Public endpoint - Track pageview
router.post('/track', trackPageview);

// Note: Admin routes (GET /stats, GET /realtime) are handled by CMS backend
// Ecommerce backend only handles public tracking

export default router;

