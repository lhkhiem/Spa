"use strict";
// Controller xác thực (Auth)
// - Chứa các hàm đăng ký và đăng nhập cơ bản
// - Lưu ý: hiện lưu password đã hash vào trường `password_hash` trong bảng users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verify = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Đăng ký user mới
// Body: { email, password, name }
// Trả về: id, email, name (không trả password)
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            email,
            password_hash: hashedPassword,
            name,
        });
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        console.error('Registration failed:', error);
        console.error('Error details:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        res.status(500).json({
            error: 'Registration failed',
            message: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
};
exports.register = register;
// Đăng nhập và phát JWT
// Body: { email, password }
// Trả về: { token, user }
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check if user has a password hash
        if (!user.password_hash) {
            console.error('User found but password_hash is missing:', { userId: user.id, email: user.email });
            return res.status(500).json({ error: 'User account configuration error' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        // Set HTTP-only cookie for session
        const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        // Set domain for cross-subdomain cookie sharing
        // Allow cookie to be shared between api.banyco.vn and admin.banyco.vn
        const cookieOptions = {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAgeMs,
            path: '/',
        };
        // Set domain for cross-subdomain cookie sharing (always in production-like environment)
        const apiDomain = process.env.API_DOMAIN || 'api.banyco.vn';
        if (apiDomain && !apiDomain.includes('localhost')) {
            // Extract root domain (e.g., 'banyco.vn' from 'api.banyco.vn')
            const rootDomain = apiDomain.split('.').slice(-2).join('.');
            if (rootDomain && rootDomain !== 'localhost' && !rootDomain.includes('127.0.0.1')) {
                cookieOptions.domain = `.${rootDomain}`;
            }
        }
        res.cookie('token', token, cookieOptions);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login failed:', error);
        console.error('Error details:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        res.status(500).json({
            error: 'Login failed',
            message: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
};
exports.login = login;
// Xác thực session hiện tại từ cookie và trả về user
const verify = async (req, res) => {
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
        if (!token)
            return res.status(401).json({ error: 'No session' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User_1.default.findByPk(decoded.id);
        if (!user)
            return res.status(401).json({ error: 'Invalid session' });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (e) {
        return res.status(401).json({ error: 'Invalid session' });
    }
};
exports.verify = verify;
// Đăng xuất: xóa cookie token
const logout = async (_req, res) => {
    const logoutCookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
    };
    const apiDomain = process.env.API_DOMAIN || 'api.banyco.vn';
    if (apiDomain && !apiDomain.includes('localhost')) {
        const rootDomain = apiDomain.split('.').slice(-2).join('.');
        if (rootDomain && rootDomain !== 'localhost' && !rootDomain.includes('127.0.0.1')) {
            logoutCookieOptions.domain = `.${rootDomain}`;
        }
    }
    res.cookie('token', '', logoutCookieOptions);
    res.json({ ok: true });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map