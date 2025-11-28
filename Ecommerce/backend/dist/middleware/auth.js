"use strict";
// Middleware xác thực JWT
// - Kiểm tra token trong Authorization header
// - Verify token và lưu thông tin user vào request
// - Trả về lỗi 401 nếu token không hợp lệ
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
function parseCookie(header) {
    if (!header)
        return {};
    return header.split(';').reduce((acc, part) => {
        const [k, ...v] = part.trim().split('=');
        acc[k] = decodeURIComponent(v.join('='));
        return acc;
    }, {});
}
const authMiddleware = async (req, res, next) => {
    const bearer = req.headers.authorization?.split(' ')[1];
    const cookies = parseCookie(req.headers.cookie);
    const token = bearer || cookies['token'];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // Enrich with current role from DB in case role changed after token issuance
        let role = decoded.role;
        if (!role && decoded.id) {
            const u = await User_1.default.findByPk(decoded.id, { attributes: ['role'] });
            role = u?.role;
        }
        req.user = { id: decoded.id, email: decoded.email, role };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map