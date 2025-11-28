"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json({ status: 'ok' });
});
router.get('/db', async (_req, res) => {
    try {
        await database_1.default.authenticate();
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ ok: false, error: 'DB unavailable' });
    }
});
router.get('/storage', async (_req, res) => {
    try {
        const dir = process.env.UPLOAD_PATH || path_1.default.resolve(__dirname, '../../storage/uploads');
        await promises_1.default.mkdir(dir, { recursive: true });
        await promises_1.default.access(dir);
        res.json({ ok: true, dir });
    }
    catch (e) {
        res.status(500).json({ ok: false, error: 'Storage not writable' });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map