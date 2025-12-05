import { Router } from 'express';
import * as newsletterController from '../controllers/newsletterController';
import { authMiddleware } from '../middleware/auth';
import { antiSpamMiddleware } from '../middleware/antiSpam';

const router = Router();

// Public routes with anti-spam protection
router.post('/subscribe', antiSpamMiddleware({
  minFormTime: 2, // Minimum 2 seconds for newsletter (shorter form)
  maxSubmissionsPerHour: 10, // Max 10 subscriptions per hour per IP
  honeypotFieldName: 'website',
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  recaptchaMinScore: 0.5, // Minimum score (0.0-1.0)
  requireRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY, // Require if secret key is set
}), newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Admin routes (require authentication)
router.get('/subscribers', authMiddleware, newsletterController.getSubscribers);
router.get('/statistics', authMiddleware, newsletterController.getStatistics);
router.delete('/subscribers/:id', authMiddleware, newsletterController.deleteSubscriber);

export default router;

