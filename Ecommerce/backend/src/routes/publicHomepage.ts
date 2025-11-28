import express from 'express';

import {
  getHeroSliders,
  getBestSellerProducts,
  getFeaturedCategories,
  getFeaturedBrands,
  getValueProps,
  getTestimonials,
  getEducationResources,
  getHomepageStats,
  getLearningLibraryPosts,
} from '../controllers/public/homepageController';
// Note: getEducationResourceBySlug not available in Ecommerce Backend
// Education resources controller not available in Ecommerce Backend
// import { getEducationResourceBySlug } from '../controllers/educationResourcesController';

const router = express.Router();

router.get('/hero-sliders', getHeroSliders);
router.get('/best-sellers', getBestSellerProducts);
router.get('/featured-categories', getFeaturedCategories);
router.get('/featured-brands', getFeaturedBrands);
router.get('/value-props', getValueProps);
router.get('/testimonials', getTestimonials);
// Education resources - commented out (not needed in Ecommerce Backend)
// router.get('/education-resources/:slug', getEducationResourceBySlug);
router.get('/education-resources', getEducationResources);
router.get('/stats', getHomepageStats);
router.get('/learning-posts', getLearningLibraryPosts);

export default router;


