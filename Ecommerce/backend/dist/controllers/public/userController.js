"use strict";
// Public User Controller
// Customer account management: profile, addresses, wishlist
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.getAddresses = exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Address_1 = __importDefault(require("../../models/Address"));
const database_1 = __importDefault(require("../../config/database"));
const sequelize_1 = require("sequelize");
// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Failed to get profile:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { firstName, lastName, name, phone, avatar } = req.body;
        const updateFields = {};
        if (firstName !== undefined)
            updateFields.first_name = firstName;
        if (lastName !== undefined)
            updateFields.last_name = lastName;
        if (name !== undefined)
            updateFields.name = name;
        if (phone !== undefined)
            updateFields.phone = phone || null;
        if (avatar !== undefined)
            updateFields.avatar = avatar;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        updateFields.updated_at = new Date();
        await User_1.default.update(updateFields, { where: { id: userId } });
        const updatedUser = await User_1.default.findByPk(userId);
        res.json({
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                phone: updatedUser.phone || null,
                avatar: updatedUser.avatar,
            },
        });
    }
    catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
// Get user addresses
const getAddresses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const addresses = await Address_1.default.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        });
        res.json({ data: addresses });
    }
    catch (error) {
        console.error('Failed to get addresses:', error);
        res.status(500).json({ error: 'Failed to get addresses' });
    }
};
exports.getAddresses = getAddresses;
// Add address
const addAddress = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { first_name, last_name, company, address_line1, address_line2, city, state, postal_code, country, phone, is_default, type, } = req.body;
        // If this is set as default, unset other defaults of the same type
        if (is_default) {
            await Address_1.default.update({ is_default: false }, {
                where: {
                    user_id: userId,
                    type: type || 'both',
                },
            });
        }
        const address = await Address_1.default.create({
            user_id: userId,
            first_name,
            last_name,
            company,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country: country || 'United States',
            phone,
            is_default: is_default || false,
            type: type || 'both',
        });
        res.status(201).json({ data: address });
    }
    catch (error) {
        console.error('Failed to add address:', error);
        res.status(500).json({ error: 'Failed to add address' });
    }
};
exports.addAddress = addAddress;
// Update address
const updateAddress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const address = await Address_1.default.findOne({ where: { id, user_id: userId } });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        const { first_name, last_name, company, address_line1, address_line2, city, state, postal_code, country, phone, is_default, type, } = req.body;
        // If this is set as default, unset other defaults of the same type
        if (is_default && !address.is_default) {
            await Address_1.default.update({ is_default: false }, {
                where: {
                    user_id: userId,
                    id: { [sequelize_1.Op.ne]: id },
                    type: type || address.type,
                },
            });
        }
        const updateFields = {};
        if (first_name !== undefined)
            updateFields.first_name = first_name;
        if (last_name !== undefined)
            updateFields.last_name = last_name;
        if (company !== undefined)
            updateFields.company = company;
        if (address_line1 !== undefined)
            updateFields.address_line1 = address_line1;
        if (address_line2 !== undefined)
            updateFields.address_line2 = address_line2;
        if (city !== undefined)
            updateFields.city = city;
        if (state !== undefined)
            updateFields.state = state;
        if (postal_code !== undefined)
            updateFields.postal_code = postal_code;
        if (country !== undefined)
            updateFields.country = country;
        if (phone !== undefined)
            updateFields.phone = phone;
        if (is_default !== undefined)
            updateFields.is_default = is_default;
        if (type !== undefined)
            updateFields.type = type;
        updateFields.updated_at = new Date();
        await Address_1.default.update(updateFields, { where: { id, user_id: userId } });
        const updatedAddress = await Address_1.default.findByPk(id);
        res.json({ data: updatedAddress });
    }
    catch (error) {
        console.error('Failed to update address:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
};
exports.updateAddress = updateAddress;
// Delete address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const address = await Address_1.default.findOne({ where: { id, user_id: userId } });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        await Address_1.default.destroy({ where: { id, user_id: userId } });
        res.json({ data: { id } });
    }
    catch (error) {
        console.error('Failed to delete address:', error);
        res.status(500).json({ error: 'Failed to delete address' });
    }
};
exports.deleteAddress = deleteAddress;
// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const query = `
      SELECT 
        w.id,
        w.product_id,
        w.created_at,
        p.name as product_name,
        p.slug as product_slug,
        p.price,
        p.compare_price,
        p.thumbnail_url,
        p.status
      FROM wishlist_items w
      INNER JOIN products p ON w.product_id = p.id
      WHERE w.user_id = :userId
      ORDER BY w.created_at DESC
    `;
        const items = await database_1.default.query(query, {
            replacements: { userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ data: items });
    }
    catch (error) {
        console.error('Failed to get wishlist:', error);
        res.status(500).json({ error: 'Failed to get wishlist' });
    }
};
exports.getWishlist = getWishlist;
// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { product_id } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!product_id) {
            return res.status(400).json({ error: 'product_id is required' });
        }
        // Check if already in wishlist
        const existing = await database_1.default.query('SELECT id FROM wishlist_items WHERE user_id = :userId AND product_id = :productId', {
            replacements: { userId, productId: product_id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }
        const query = `
      INSERT INTO wishlist_items (id, user_id, product_id, created_at)
      VALUES (gen_random_uuid(), :userId, :productId, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const [result] = await database_1.default.query(query, {
            replacements: { userId, productId: product_id },
            type: sequelize_1.QueryTypes.INSERT,
        });
        res.status(201).json({ data: result });
    }
    catch (error) {
        console.error('Failed to add to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};
exports.addToWishlist = addToWishlist;
// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const query = `
      DELETE FROM wishlist_items
      WHERE id = :id AND user_id = :userId
      RETURNING id
    `;
        const result = await database_1.default.query(query, {
            replacements: { id, userId },
            type: sequelize_1.QueryTypes.DELETE,
        });
        if (result[0].length === 0) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }
        res.json({ data: { id } });
    }
    catch (error) {
        console.error('Failed to remove from wishlist:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=userController.js.map