import { Router } from 'express';
import { getFAQs } from '../controllers/public/faqController';

const router = Router();

// GET /api/public/faqs
router.get('/', getFAQs);

export default router;




