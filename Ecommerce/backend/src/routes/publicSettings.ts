import { Router } from 'express';
import { getAppearanceSettings } from '../controllers/public/settingsController';

const router = Router();

// GET /api/public/settings/appearance
// Read-only settings for Ecommerce storefront (logo, favicon, etc.)
router.get('/appearance', getAppearanceSettings);

export default router;





