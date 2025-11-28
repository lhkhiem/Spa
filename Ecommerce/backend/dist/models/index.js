"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSubscription = exports.PageMetadata = exports.AboutSection = exports.ConsultationSubmission = exports.ContactMessage = exports.Address = exports.ValueProp = exports.Testimonial = exports.EducationResource = exports.MenuItem = exports.MenuLocation = exports.MediaFolder = exports.AssetFolder = exports.Tag = exports.Topic = exports.User = exports.Asset = exports.Post = void 0;
// Initialize all models and their associations
const Post_1 = __importDefault(require("./Post"));
exports.Post = Post_1.default;
const database_1 = __importDefault(require("../config/database"));
const Asset_1 = __importDefault(require("./Asset"));
exports.Asset = Asset_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Topic_1 = __importDefault(require("./Topic"));
exports.Topic = Topic_1.default;
const Tag_1 = __importDefault(require("./Tag"));
exports.Tag = Tag_1.default;
const AssetFolder_1 = __importDefault(require("./AssetFolder"));
exports.AssetFolder = AssetFolder_1.default;
const MediaFolder_1 = __importDefault(require("./MediaFolder"));
exports.MediaFolder = MediaFolder_1.default;
const MenuLocation_1 = __importDefault(require("./MenuLocation"));
exports.MenuLocation = MenuLocation_1.default;
const MenuItem_1 = __importDefault(require("./MenuItem"));
exports.MenuItem = MenuItem_1.default;
const EducationResource_1 = __importDefault(require("./EducationResource"));
exports.EducationResource = EducationResource_1.default;
const Testimonial_1 = __importDefault(require("./Testimonial"));
exports.Testimonial = Testimonial_1.default;
const ValueProp_1 = __importDefault(require("./ValueProp"));
exports.ValueProp = ValueProp_1.default;
const Address_1 = __importDefault(require("./Address"));
exports.Address = Address_1.default;
const ContactMessage_1 = __importDefault(require("./ContactMessage"));
exports.ContactMessage = ContactMessage_1.default;
const ConsultationSubmission_1 = __importDefault(require("./ConsultationSubmission"));
exports.ConsultationSubmission = ConsultationSubmission_1.default;
const AboutSection_1 = __importDefault(require("./AboutSection"));
exports.AboutSection = AboutSection_1.default;
const PageMetadata_1 = __importDefault(require("./PageMetadata"));
exports.PageMetadata = PageMetadata_1.default;
const NewsletterSubscription_1 = __importDefault(require("./NewsletterSubscription"));
exports.NewsletterSubscription = NewsletterSubscription_1.default;
// Define all associations here
// Define explicit through models (no timestamps) for many-to-many junctions
const PostTopic = database_1.default.define('post_topics', {}, {
    tableName: 'post_topics',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});
const PostTag = database_1.default.define('post_tags', {}, {
    tableName: 'post_tags',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});
// Post associations
Post_1.default.belongsTo(Asset_1.default, {
    foreignKey: 'cover_asset_id',
    as: 'cover_asset',
});
Post_1.default.belongsTo(User_1.default, {
    foreignKey: 'author_id',
    as: 'author',
});
// Many-to-many for Post-Topic and Post-Tag
Post_1.default.belongsToMany(Topic_1.default, {
    through: PostTopic,
    foreignKey: 'post_id',
    otherKey: 'topic_id',
    as: 'topics',
});
Topic_1.default.belongsToMany(Post_1.default, {
    through: PostTopic,
    foreignKey: 'topic_id',
    otherKey: 'post_id',
    as: 'posts',
});
Post_1.default.belongsToMany(Tag_1.default, {
    through: PostTag,
    foreignKey: 'post_id',
    otherKey: 'tag_id',
    as: 'tags',
});
Tag_1.default.belongsToMany(Post_1.default, {
    through: PostTag,
    foreignKey: 'tag_id',
    otherKey: 'post_id',
    as: 'posts',
});
// Menu associations
MenuLocation_1.default.hasMany(MenuItem_1.default, {
    foreignKey: 'menu_location_id',
    as: 'items',
});
MenuItem_1.default.belongsTo(MenuLocation_1.default, {
    foreignKey: 'menu_location_id',
    as: 'location',
});
MenuItem_1.default.hasMany(MenuItem_1.default, {
    foreignKey: 'parent_id',
    as: 'children',
});
MenuItem_1.default.belongsTo(MenuItem_1.default, {
    foreignKey: 'parent_id',
    as: 'parent',
});
// Address associations
Address_1.default.belongsTo(User_1.default, {
    foreignKey: 'user_id',
    as: 'user',
});
User_1.default.hasMany(Address_1.default, {
    foreignKey: 'user_id',
    as: 'addresses',
});
// Contact Message associations
ContactMessage_1.default.belongsTo(User_1.default, {
    foreignKey: 'assigned_to',
    as: 'assignedUser',
});
ContactMessage_1.default.belongsTo(User_1.default, {
    foreignKey: 'replied_by',
    as: 'repliedByUser',
});
User_1.default.hasMany(ContactMessage_1.default, {
    foreignKey: 'assigned_to',
    as: 'assignedMessages',
});
User_1.default.hasMany(ContactMessage_1.default, {
    foreignKey: 'replied_by',
    as: 'repliedMessages',
});
// Consultation Submission associations
ConsultationSubmission_1.default.belongsTo(User_1.default, {
    foreignKey: 'assigned_to',
    as: 'assignedUser',
});
ConsultationSubmission_1.default.belongsTo(User_1.default, {
    foreignKey: 'replied_by',
    as: 'repliedByUser',
});
User_1.default.hasMany(ConsultationSubmission_1.default, {
    foreignKey: 'assigned_to',
    as: 'assignedConsultations',
});
User_1.default.hasMany(ConsultationSubmission_1.default, {
    foreignKey: 'replied_by',
    as: 'repliedConsultations',
});
//# sourceMappingURL=index.js.map