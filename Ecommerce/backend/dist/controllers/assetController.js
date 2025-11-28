"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.getAssetById = exports.listAssets = exports.listFolders = exports.createFolder = exports.fetchRemote = exports.uploadFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const Asset_1 = __importDefault(require("../models/Asset"));
const MediaFolder_1 = __importDefault(require("../models/MediaFolder"));
const stream_1 = require("stream");
const util_1 = require("util");
const https_1 = __importDefault(require("https"));
const media_1 = require("../utils/media");
const pump = (0, util_1.promisify)(stream_1.pipeline);
// Store under storage/uploads (publicly served at /uploads)
const UPLOAD_ROOT = path_1.default.resolve(__dirname, '../../storage/uploads');
function ensureDir(p) {
    if (!fs_1.default.existsSync(p))
        fs_1.default.mkdirSync(p, { recursive: true });
}
// moved to utils/media
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { folder_id } = req.body;
        if (!file)
            return res.status(400).json({ error: 'No file uploaded' });
        ensureDir(UPLOAD_ROOT);
        const id = (0, uuid_1.v4)();
        const dateDir = new Date().toISOString().slice(0, 10);
        const dir = path_1.default.join(UPLOAD_ROOT, dateDir, id);
        ensureDir(dir);
        const originalPath = path_1.default.join(dir, `original_${file.originalname}`);
        fs_1.default.writeFileSync(originalPath, file.buffer);
        // Create variants
        const input = file.buffer;
        const variants = [
            { key: 'thumb', width: 320 },
            { key: 'medium', width: 800 },
            { key: 'large', width: 1200 },
        ];
        const sizes = {};
        for (const v of variants) {
            const out = await (0, media_1.toWebpUnder100KB)(input, v.width);
            const outPath = path_1.default.join(dir, `${v.key}.webp`);
            fs_1.default.writeFileSync(outPath, out.buffer);
            sizes[v.key] = {
                url: `/uploads/${dateDir}/${id}/${v.key}.webp`,
                width: out.info.width,
                height: out.info.height,
                size: out.buffer.byteLength,
                format: 'webp',
            };
        }
        const saved = await Asset_1.default.create({
            type: 'image',
            provider: 'local',
            url: `/uploads/${dateDir}/${id}/original_${file.originalname}`,
            width: sizes.large?.width || sizes.medium?.width,
            height: sizes.large?.height || sizes.medium?.height,
            format: path_1.default.extname(file.originalname).replace('.', ''),
            sizes,
            folder_id: folder_id || null,
        });
        return res.status(201).json({ data: saved });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Upload failed' });
    }
};
exports.uploadFile = uploadFile;
const fetchRemote = async (req, res) => {
    try {
        const { url, folder_id } = req.body;
        if (!url)
            return res.status(400).json({ error: 'url is required' });
        const id = (0, uuid_1.v4)();
        const dateDir = new Date().toISOString().slice(0, 10);
        const dir = path_1.default.join(UPLOAD_ROOT, dateDir, id);
        ensureDir(dir);
        // download
        const originalPath = path_1.default.join(dir, `original`);
        await new Promise((resolve, reject) => {
            const file = fs_1.default.createWriteStream(originalPath);
            https_1.default.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => file.close(() => resolve()));
            }).on('error', (err) => reject(err));
        });
        const input = fs_1.default.readFileSync(originalPath);
        const variants = [
            { key: 'thumb', width: 320 },
            { key: 'medium', width: 800 },
            { key: 'large', width: 1200 },
        ];
        const sizes = {};
        for (const v of variants) {
            const out = await (0, media_1.toWebpUnder100KB)(input, v.width);
            const outPath = path_1.default.join(dir, `${v.key}.webp`);
            fs_1.default.writeFileSync(outPath, out.buffer);
            sizes[v.key] = {
                url: `/uploads/${dateDir}/${id}/${v.key}.webp`,
                width: out.info.width,
                height: out.info.height,
                size: out.buffer.byteLength,
                format: 'webp',
            };
        }
        const saved = await Asset_1.default.create({
            type: 'image',
            provider: 'local',
            url: `/uploads/${dateDir}/${id}/original`,
            width: sizes.large?.width || sizes.medium?.width,
            height: sizes.large?.height || sizes.medium?.height,
            format: 'unknown',
            sizes,
            folder_id: folder_id || null,
        });
        return res.status(201).json({ data: saved });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Fetch failed' });
    }
};
exports.fetchRemote = fetchRemote;
const createFolder = async (req, res) => {
    const { name, parent_id } = req.body;
    if (!name)
        return res.status(400).json({ error: 'name is required' });
    const folder = await MediaFolder_1.default.create({ name, parent_id: parent_id || null });
    res.status(201).json({ data: folder });
};
exports.createFolder = createFolder;
const listFolders = async (_req, res) => {
    const folders = await MediaFolder_1.default.findAll({ order: [['name', 'ASC']] });
    res.json({ data: folders });
};
exports.listFolders = listFolders;
const listAssets = async (req, res) => {
    const { folder_id } = req.query;
    const where = {};
    if (folder_id)
        where.folder_id = folder_id;
    const assets = await Asset_1.default.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ data: assets });
};
exports.listAssets = listAssets;
const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset_1.default.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json(asset);
    }
    catch (error) {
        console.error('Failed to fetch asset:', error);
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
};
exports.getAssetById = getAssetById;
const deleteAsset = async (req, res) => {
    const { id } = req.params;
    const asset = await Asset_1.default.findByPk(id);
    if (!asset)
        return res.status(404).json({ error: 'Asset not found' });
    // best-effort delete files
    try {
        const url = asset.url;
        if (url?.startsWith('/uploads/')) {
            const rel = url.replace('/uploads/', '');
            const dir = path_1.default.join(UPLOAD_ROOT, rel.split('/')[0], rel.split('/')[1]);
            if (fs_1.default.existsSync(path_1.default.join(UPLOAD_ROOT, dir))) {
                fs_1.default.rmSync(dir, { recursive: true, force: true });
            }
        }
    }
    catch { }
    await asset.destroy();
    res.json({ message: 'deleted' });
};
exports.deleteAsset = deleteAsset;
//# sourceMappingURL=assetController.js.map