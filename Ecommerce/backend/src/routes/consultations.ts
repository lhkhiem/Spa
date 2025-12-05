import { Router } from 'express';
// Only public route for ecommerce backend - admin routes are in CMS backend
import {
  submitConsultation,
} from '../controllers/consultationController';
import { antiSpamMiddleware } from '../middleware/antiSpam';

const router = Router();

// Public route - submit consultation form with anti-spam protection
router.post('/', antiSpamMiddleware({
  minFormTime: 3, // Minimum 3 seconds to fill form
  maxSubmissionsPerHour: 5, // Max 5 submissions per hour per IP
  honeypotFieldName: 'website',
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  recaptchaMinScore: 0.5, // Minimum score (0.0-1.0)
  requireRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY, // Require if secret key is set
}), submitConsultation);

// Note: Admin routes (GET, PUT, DELETE) are handled by CMS backend
// Ecommerce backend only handles public form submissions

export default router;

