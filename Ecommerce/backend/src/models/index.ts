// Ecommerce Backend Models
// Only models needed for Ecommerce operations (public APIs)

import sequelize from '../config/database';

// Ecommerce models - Shared tables (read/write)
import { Product } from './Product';
import { ProductCategory } from './ProductCategory';
import { Brand } from './Brand';
import { Order } from './Order';
import { OrderItem } from './OrderItem';
import User from './User';
import Address from './Address';
import NewsletterSubscription from './NewsletterSubscription';

// Product-related models
import { ProductOption } from './ProductOption';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';
import { ProductAttribute } from './ProductAttribute';

// CMS-only models - COMMENTED (not used in Ecommerce Backend)
// import Post from './Post';
// import Topic from './Topic';
// import Tag from './Tag';
// import Asset from './Asset';
// import AssetFolder from './AssetFolder';
// import MediaFolder from './MediaFolder';
// import MenuLocation from './MenuLocation';
// import MenuItem from './MenuItem';
// import EducationResource from './EducationResource';
// import Testimonial from './Testimonial';
// import ValueProp from './ValueProp';
import ContactMessage from './ContactMessage';
import ConsultationSubmission from './ConsultationSubmission';
import PageMetadata from './PageMetadata';
// import AboutSection from './AboutSection';
// import PageMetadata from './PageMetadata';
// import Slider from './Slider';
// import TrackingScript from './TrackingScript';
// import Analytics from './Analytics';
// import ActivityLog from './ActivityLog';
// import CartItem from './CartItem';
// import WishlistItem from './WishlistItem';
// import ProductReview from './ProductReview';

// Define associations (only for Ecommerce models)
// Note: Order and OrderItem are interfaces, not Sequelize models
// Associations are not needed as we use raw SQL queries
// Order.hasMany(OrderItem, {
//   foreignKey: 'order_id',
//   as: 'items',
// });
// OrderItem.belongsTo(Order, {
//   foreignKey: 'order_id',
//   as: 'order',
// });

Address.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Address, {
  foreignKey: 'user_id',
  as: 'addresses',
});

// Export only Ecommerce models
export {
  // Product models
  Product,
  ProductCategory,
  Brand,
  ProductOption,
  ProductVariant,
  ProductImage,
  ProductAttribute,
  // Order models (interfaces, not Sequelize models)
  Order,
  OrderItem,
  // User models
  User,
  Address,
  // Newsletter
  NewsletterSubscription,
  // Consultation
  ConsultationSubmission,
  // Contact
  ContactMessage,
  // SEO Page metadata
  PageMetadata,
};
