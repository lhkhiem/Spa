"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homepageController_1 = require("../controllers/public/homepageController");
const educationResourcesController_1 = require("../controllers/educationResourcesController");
const router = express_1.default.Router();
router.get('/hero-sliders', homepageController_1.getHeroSliders);
router.get('/best-sellers', homepageController_1.getBestSellerProducts);
router.get('/featured-categories', homepageController_1.getFeaturedCategories);
router.get('/featured-brands', homepageController_1.getFeaturedBrands);
router.get('/value-props', homepageController_1.getValueProps);
router.get('/testimonials', homepageController_1.getTestimonials);
// IMPORTANT: Specific routes (with :slug) must come before general routes
router.get('/education-resources/:slug', educationResourcesController_1.getEducationResourceBySlug);
router.get('/education-resources', homepageController_1.getEducationResources);
router.get('/stats', homepageController_1.getHomepageStats);
router.get('/learning-posts', homepageController_1.getLearningLibraryPosts);
exports.default = router;
//# sourceMappingURL=publicHomepage.js.map