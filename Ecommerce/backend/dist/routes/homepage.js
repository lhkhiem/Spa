"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const testimonialsController = __importStar(require("../controllers/testimonialsController"));
const valuePropsController = __importStar(require("../controllers/valuePropsController"));
const educationResourcesController = __importStar(require("../controllers/educationResourcesController"));
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
// Testimonial routes
router.get('/testimonials', testimonialsController.getTestimonials);
router.post('/testimonials', testimonialsController.createTestimonial);
router.put('/testimonials/:id', testimonialsController.updateTestimonial);
router.delete('/testimonials/:id', testimonialsController.deleteTestimonial);
// Education Resource routes
// IMPORTANT: Specific routes (with :id) must come before general routes
router.get('/education-resources/:id', educationResourcesController.getEducationResourceById);
router.get('/education-resources', educationResourcesController.getEducationResources);
router.post('/education-resources', educationResourcesController.createEducationResource);
router.put('/education-resources/:id', educationResourcesController.updateEducationResource);
router.delete('/education-resources/:id', educationResourcesController.deleteEducationResource);
// Value Props routes
router.get('/value-props', valuePropsController.getValueProps);
router.post('/value-props', valuePropsController.createValueProp);
router.put('/value-props/:id', valuePropsController.updateValueProp);
router.delete('/value-props/:id', valuePropsController.deleteValueProp);
exports.default = router;
//# sourceMappingURL=homepage.js.map