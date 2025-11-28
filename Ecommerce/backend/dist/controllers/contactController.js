"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactStats = exports.deleteContact = exports.updateContact = exports.getContactById = exports.getContacts = exports.submitContact = void 0;
const ContactMessage_1 = __importDefault(require("../models/ContactMessage"));
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const email_1 = require("../services/email");
const activityLogController_1 = require("./activityLogController");
const emailTemplates_1 = require("../utils/emailTemplates");
// POST /api/contacts - Submit contact form (public)
const submitContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message, } = req.body;
        // Validation
        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['firstName', 'lastName', 'email', 'subject', 'message'],
            });
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        // Get client IP and user agent
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        // Create contact message
        const contactMessage = await ContactMessage_1.default.create({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            subject: subject.trim(),
            message: message.trim(),
            status: 'new',
            ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
            user_agent: userAgent,
        });
        // Send emails (non-blocking - don't fail if email fails)
        try {
            // Get admin email from settings
            const settingsResult = await database_1.default.query("SELECT value FROM settings WHERE namespace = 'general'", { type: 'SELECT' });
            const generalSettings = settingsResult?.[0]?.value || {};
            const adminEmail = generalSettings.adminEmail || 'admin@pressup.com';
            const contactData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone ? phone.trim() : undefined,
                subject: subject.trim(),
                message: message.trim(),
                createdAt: contactMessage.created_at,
            };
            // Send notification to admin
            if (email_1.emailService.isEnabled() && adminEmail) {
                const adminEmailHtml = (0, emailTemplates_1.getContactNotificationTemplate)(contactData);
                email_1.emailService.sendEmail({
                    to: adminEmail,
                    subject: `New Contact Form Submission: ${subject.trim()}`,
                    html: adminEmailHtml,
                    replyTo: email.trim().toLowerCase(),
                }).catch((error) => {
                    console.error('[submitContact] Failed to send admin notification:', error);
                });
            }
            // Send confirmation to customer
            if (email_1.emailService.isEnabled()) {
                const customerEmailHtml = (0, emailTemplates_1.getContactConfirmationTemplate)(contactData);
                email_1.emailService.sendEmail({
                    to: email.trim().toLowerCase(),
                    subject: 'Thank You for Contacting Us',
                    html: customerEmailHtml,
                }).catch((error) => {
                    console.error('[submitContact] Failed to send customer confirmation:', error);
                });
            }
        }
        catch (emailError) {
            // Log but don't fail the request if email fails
            console.error('[submitContact] Email error:', emailError);
        }
        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            id: contactMessage.id,
        });
    }
    catch (error) {
        console.error('[submitContact] Error:', error);
        res.status(500).json({
            error: 'Failed to submit contact form',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.submitContact = submitContact;
// GET /api/contacts - List contact messages (admin)
const getContacts = async (req, res) => {
    try {
        const { status, subject, search, page = '1', limit = '20', sortBy = 'created_at', sortOrder = 'DESC', } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;
        // Build WHERE clause
        const whereConditions = [];
        const replacements = {};
        if (status) {
            whereConditions.push('cm.status = :status');
            replacements.status = status;
        }
        if (subject) {
            whereConditions.push('cm.subject = :subject');
            replacements.subject = subject;
        }
        if (search) {
            whereConditions.push('(cm.first_name ILIKE :search OR cm.last_name ILIKE :search OR cm.email ILIKE :search OR cm.message ILIKE :search)');
            replacements.search = `%${search}%`;
        }
        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';
        // Validate sortBy and sortOrder
        const allowedSortBy = ['created_at', 'updated_at', 'status', 'subject', 'email'];
        const validSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at';
        const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        // Get total count
        const countQuery = `
      SELECT COUNT(*) as total
      FROM contact_messages cm
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countQuery, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        const total = parseInt(countResult[0].total, 10);
        // Get messages with user info
        const query = `
      SELECT 
        cm.*,
        assigned.name as assigned_to_name,
        replied.name as replied_by_name
      FROM contact_messages cm
      LEFT JOIN users assigned ON cm.assigned_to = assigned.id
      LEFT JOIN users replied ON cm.replied_by = replied.id
      ${whereClause}
      ORDER BY cm.${validSortBy} ${validSortOrder}
      LIMIT :limit OFFSET :offset
    `;
        replacements.limit = limitNum;
        replacements.offset = offset;
        const messages = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            success: true,
            data: messages,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('[getContacts] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch contact messages',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.getContacts = getContacts;
// GET /api/contacts/:id - Get contact message detail (admin)
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage_1.default.findByPk(id, {
            include: [
                {
                    model: User_1.default,
                    as: 'assignedUser',
                    attributes: ['id', 'name', 'email'],
                    required: false,
                },
                {
                    model: User_1.default,
                    as: 'repliedByUser',
                    attributes: ['id', 'name', 'email'],
                    required: false,
                },
            ],
        });
        if (!message) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        res.json({ success: true, data: message });
    }
    catch (error) {
        console.error('[getContactById] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch contact message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.getContactById = getContactById;
// PUT /api/contacts/:id - Update contact message (admin)
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_to, reply_message, } = req.body;
        const message = await ContactMessage_1.default.findByPk(id);
        if (!message) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        // Update status
        if (status) {
            message.status = status;
        }
        // Update assigned_to
        if (assigned_to !== undefined) {
            message.assigned_to = assigned_to || null;
        }
        // Add reply
        if (reply_message) {
            message.reply_message = reply_message;
            message.replied_at = new Date();
            message.replied_by = req.user.id;
            message.status = 'replied';
        }
        await message.save();
        // Log activity
        const contactName = `${message.first_name} ${message.last_name}`;
        const action = reply_message ? 'reply' : 'update';
        const description = reply_message
            ? `Replied to contact message from "${contactName}"`
            : `Updated contact message from "${contactName}"`;
        await (0, activityLogController_1.logActivity)(req, action, 'contact', id, contactName, description);
        // Send reply email to customer (non-blocking)
        if (reply_message && email_1.emailService.isEnabled()) {
            try {
                // Get admin user info
                const adminUser = await User_1.default.findByPk(req.user.id, {
                    attributes: ['id', 'name', 'email'],
                });
                const subjectLabels = {
                    product: 'Product Inquiry',
                    order: 'Order Status',
                    support: 'Technical Support',
                    'spa-development': 'Spa Development Services',
                    partnership: 'Partnership Opportunities',
                    other: 'Other',
                };
                const replyData = {
                    customerName: `${message.first_name} ${message.last_name}`,
                    customerEmail: message.email,
                    originalSubject: message.subject,
                    originalMessage: message.message,
                    replyMessage: reply_message,
                    adminName: adminUser?.name || 'Customer Service Team',
                    adminEmail: adminUser?.email || undefined,
                    repliedAt: message.replied_at || new Date(),
                };
                const replyEmailHtml = (0, emailTemplates_1.getContactReplyTemplate)(replyData);
                const subjectLabel = subjectLabels[message.subject] || message.subject;
                email_1.emailService.sendEmail({
                    to: message.email,
                    subject: `Re: ${subjectLabel}`,
                    html: replyEmailHtml,
                    replyTo: adminUser?.email || undefined,
                }).catch((error) => {
                    console.error('[updateContact] Failed to send reply email:', error);
                });
            }
            catch (emailError) {
                // Log but don't fail the request if email fails
                console.error('[updateContact] Email error:', emailError);
            }
        }
        res.json({
            success: true,
            message: 'Contact message updated successfully',
            data: message,
        });
    }
    catch (error) {
        console.error('[updateContact] Error:', error);
        res.status(500).json({
            error: 'Failed to update contact message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.updateContact = updateContact;
// DELETE /api/contacts/:id - Delete contact message (admin)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage_1.default.findByPk(id);
        if (!message) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        const contactName = `${message.first_name} ${message.last_name}`;
        await message.destroy();
        // Log activity
        await (0, activityLogController_1.logActivity)(req, 'delete', 'contact', id, contactName, `Deleted contact message from "${contactName}"`);
        res.json({
            success: true,
            message: 'Contact message deleted successfully',
        });
    }
    catch (error) {
        console.error('[deleteContact] Error:', error);
        res.status(500).json({
            error: 'Failed to delete contact message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.deleteContact = deleteContact;
// GET /api/contacts/stats - Get statistics (admin)
const getContactStats = async (req, res) => {
    try {
        const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'read') as read_count,
        COUNT(*) FILTER (WHERE status = 'replied') as replied_count,
        COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as last_7_days,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as last_30_days
      FROM contact_messages
    `;
        const stats = await database_1.default.query(statsQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        const subjectStatsQuery = `
      SELECT 
        subject,
        COUNT(*) as count
      FROM contact_messages
      GROUP BY subject
      ORDER BY count DESC
    `;
        const subjectStats = await database_1.default.query(subjectStatsQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            success: true,
            data: {
                ...stats[0],
                bySubject: subjectStats,
            },
        });
    }
    catch (error) {
        console.error('[getContactStats] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch contact statistics',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
exports.getContactStats = getContactStats;
//# sourceMappingURL=contactController.js.map