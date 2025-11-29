import { Router } from 'express';
import { getPageMetadata } from '../controllers/public/pageMetadataController';

const router = Router();

// Public route - no auth required
router.get('/:path(*)', getPageMetadata);

export default router;





