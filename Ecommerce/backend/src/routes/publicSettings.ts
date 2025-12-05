import { Router } from 'express';
import { getAppearanceSettings, getGeneralSettings } from '../controllers/public/settingsController';

const router = Router();

// GET /api/public/settings/appearance
// Read-only settings for Ecommerce storefront (logo, favicon, etc.)
router.get('/appearance', getAppearanceSettings);

// GET /api/public/settings/general
// Read-only general settings for Ecommerce storefront (business info, working hours, etc.)
router.get('/general', getGeneralSettings);

export default router;








