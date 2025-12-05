import express from 'express';
import { getAboutSections } from '../controllers/public/aboutSectionController';

const router = express.Router();

// GET /api/public/about-sections
router.get('/', getAboutSections);

export default router;


