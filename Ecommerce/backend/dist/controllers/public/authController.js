"use strict";
// Public Auth Controller
// Customer authentication with refresh token support
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
// Register customer
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            email,
            password_hash: hashedPassword,
            name: name || `${firstName || ''} ${lastName || ''}`.trim() || email,
            role: 'customer',
            status: 'active',
        });
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
        res.status(201).json({
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
// Login customer
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
        // Set HTTP-only cookie for session (optional, for cookie-based auth)
        const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        res.cookie('token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAgeMs,
            path: '/',
        });
        res.json({
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
// Refresh access token
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
        const user = await User_1.default.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
        res.json({
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        console.error('Token refresh failed:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};
exports.refresh = refresh;
// Get current user (me)
const me = async (req, res) => {
    try {
        const header = req.headers.cookie || '';
        const cookies = header.split(';').reduce((acc, p) => {
            const [k, ...v] = p.trim().split('=');
            if (k)
                acc[k] = decodeURIComponent(v.join('='));
            return acc;
        }, {});
        const bearer = req.headers.authorization?.split(' ')[1];
        const token = bearer || cookies['token'];
        if (!token) {
            return res.status(401).json({ error: 'No session' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User_1.default.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        res.json({
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error('Get me failed:', error);
        return res.status(401).json({ error: 'Invalid session' });
    }
};
exports.me = me;
// Logout
const logout = async (_req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
    });
    res.json({ data: { ok: true } });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map