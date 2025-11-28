"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.renameMedia = exports.updateMedia = exports.listMedia = exports.uploadMediaFromUrl = exports.uploadMedia = exports.deleteFolder = exports.renameFolder = exports.createFolder = exports.listFolders = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const MediaFolder_1 = __importDefault(require("../models/MediaFolder"));
const Asset_1 = __importDefault(require("../models/Asset"));
const media_1 = require("../utils/media");
const sequelize_1 = require("sequelize");
const MAX_UPLOAD_FILE_SIZE_MB = 100;
const MAX_UPLOAD_FILE_SIZE = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;
const folderIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const allowedUrlExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const normalizeFolderId = (input) => {
    if (!input || typeof input !== 'string') {
        return null;
    }
    const trimmed = input.trim();
    return folderIdRegex.test(trimmed) ? trimmed : null;
};
const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
};
const buildAssetResponse = (asset, processed, fileId, originalName, fileSize) => {
    const json = asset.toJSON();
    return {
        ...json,
        file_name: originalName,
        file_size: fileSize,
        thumb_url: `/uploads/${fileId}/${processed.thumb}`,
        medium_url: `/uploads/${fileId}/${processed.medium}`,
        large_url: `/uploads/${fileId}/${processed.large}`,
    };
};
const cleanupTempFile = (filePath) => {
    try {
        if (filePath && fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log('[media] Temp file deleted:', filePath);
        }
    }
    catch (cleanupError) {
        console.error('[media] Failed to delete temp file:', cleanupError);
    }
};
const processTempUpload = async (tempFilePath, originalName, folderInput) => {
    const uploadDate = new Date().toISOString().split('T')[0];
    const uniqueId = (0, uuid_1.v4)();
    const relativeFileId = path_1.default.join(uploadDate, uniqueId);
    const specificDir = path_1.default.join(process.cwd(), 'storage', 'uploads', uploadDate, uniqueId);
    let processed;
    try {
        processed = await (0, media_1.processImage)(tempFilePath, specificDir, originalName);
    }
    finally {
        cleanupTempFile(tempFilePath);
    }
    const processedOriginalPath = path_1.default.join(specificDir, processed.original);
    const processedFileSize = (0, media_1.getFileSize)(processedOriginalPath);
    const validFolderId = normalizeFolderId(folderInput);
    const asset = await Asset_1.default.create({
        id: (0, uuid_1.v4)(),
        type: 'image',
        provider: 'local',
        url: `/uploads/${relativeFileId}/${processed.original}`,
        cdn_url: null,
        width: processed.width,
        height: processed.height,
        format: 'webp',
        sizes: processed.sizes,
        folder_id: validFolderId,
    });
    return buildAssetResponse(asset, processed, relativeFileId, originalName, processedFileSize);
};
const downloadStreamToFile = async (stream, destination) => {
    await new Promise((resolve, reject) => {
        let finished = false;
        let downloaded = 0;
        const writer = fs_1.default.createWriteStream(destination);
        const closeWithError = (error) => {
            if (finished)
                return;
            finished = true;
            try {
                stream.destroy(error);
            }
            catch {
                // ignore secondary destroy errors
            }
            writer.destroy(error);
            reject(error);
        };
        stream.on('data', (chunk) => {
            downloaded += chunk.length;
            if (downloaded > MAX_UPLOAD_FILE_SIZE) {
                closeWithError(new Error('REMOTE_FILE_TOO_LARGE'));
            }
        });
        stream.on('error', (error) => closeWithError(error));
        writer.on('error', (error) => closeWithError(error));
        writer.on('finish', () => {
            if (finished)
                return;
            finished = true;
            resolve();
        });
        stream.pipe(writer);
    });
};
// GET /api/media/folders - list all folders with hierarchy
const listFolders = async (_req, res) => {
    try {
        console.log('[listFolders] Fetching all folders...');
        const folders = await MediaFolder_1.default.findAll({
            order: [['parent_id', 'ASC'], ['name', 'ASC']],
        });
        console.log('[listFolders] Found', folders.length, 'folders');
        // Add file count for each folder
        const foldersWithCount = await Promise.all(folders.map(async (folder) => {
            const count = await Asset_1.default.count({
                where: { folder_id: folder.id }
            });
            return {
                ...folder.toJSON(),
                file_count: count
            };
        }));
        console.log('[listFolders] Returning folders with counts');
        res.json({ folders: foldersWithCount });
    }
    catch (error) {
        console.error('[listFolders] Error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.listFolders = listFolders;
// POST /api/media/folders - create new folder
const createFolder = async (req, res) => {
    try {
        const { name, parent_id } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Folder name is required' });
        }
        const folder = await MediaFolder_1.default.create({ name: name.trim(), parent_id: parent_id || null });
        res.status(201).json({ folder });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createFolder = createFolder;
// PUT /api/media/folders/:id - rename folder
const renameFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Folder name is required' });
        }
        const folder = await MediaFolder_1.default.findByPk(id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        await folder.update({ name: name.trim() });
        res.json({ folder });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.renameFolder = renameFolder;
// DELETE /api/media/folders/:id - delete folder (cascade children)
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await MediaFolder_1.default.findByPk(id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        await folder.destroy();
        res.json({ message: 'Folder deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteFolder = deleteFolder;
// POST /api/media/upload - upload media file
const uploadMedia = async (req, res) => {
    console.log('[uploadMedia] Starting upload...');
    console.log('[uploadMedia] Request file:', req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
    } : 'No file');
    try {
        if (!req.file) {
            console.log('[uploadMedia] No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = req.file;
        console.log('[uploadMedia] Processing file:', file.originalname, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        if (!fs_1.default.existsSync(file.path)) {
            console.error('[uploadMedia] Temp file does not exist:', file.path);
            return res.status(400).json({ error: 'File upload failed. Temp file not found.' });
        }
        const responsePayload = await processTempUpload(file.path, file.originalname, req.body.folder_id);
        res.status(201).json(responsePayload);
    }
    catch (error) {
        console.error('[uploadMedia] Error:', error);
        console.error('[uploadMedia] Error stack:', error.stack);
        // Clean up temp file on error
        try {
            if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
                console.log('[uploadMedia] Cleaned up temp file on error');
            }
        }
        catch (cleanupError) {
            console.error('[uploadMedia] Error cleaning up temp file:', cleanupError);
        }
        // Provide more specific error messages
        let errorMessage = error.message || 'Upload failed';
        let statusCode = 500;
        if (error.code === 'LIMIT_FILE_SIZE') {
            errorMessage = `File quá lớn. Giới hạn tối đa là ${MAX_UPLOAD_FILE_SIZE_MB}MB.`;
            statusCode = 413;
        }
        else if (error.message?.includes('Only image files')) {
            errorMessage = 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)';
            statusCode = 400;
        }
        else if (error.message?.includes('ENOENT') || error.message?.includes('no such file')) {
            errorMessage = 'Lỗi xử lý file. Vui lòng thử lại.';
            statusCode = 500;
        }
        else if (error.message?.includes('sharp')) {
            errorMessage = 'Lỗi xử lý ảnh. File có thể bị hỏng hoặc không đúng định dạng.';
            statusCode = 400;
        }
        res.status(statusCode).json({ error: errorMessage });
    }
};
exports.uploadMedia = uploadMedia;
const uploadMediaFromUrl = async (req, res) => {
    console.log('[uploadMediaFromUrl] Starting upload by URL');
    const { url, folder_id } = req.body || {};
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return res.status(400).json({ error: 'URL ảnh là bắt buộc.' });
    }
    const trimmedUrl = url.trim();
    let parsedUrl;
    try {
        parsedUrl = new URL(trimmedUrl);
    }
    catch {
        return res.status(400).json({ error: 'URL không hợp lệ.' });
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({ error: 'URL phải sử dụng giao thức http hoặc https.' });
    }
    const decodedPath = decodeURIComponent(parsedUrl.pathname || '');
    const lastSegment = decodedPath.split('/').filter(Boolean).pop() || 'remote-image';
    const rawExt = path_1.default.extname(lastSegment).toLowerCase();
    const extension = allowedUrlExtensions.includes(rawExt) ? rawExt : '.jpg';
    const baseName = sanitizeFileName(rawExt ? lastSegment.replace(rawExt, '') : lastSegment) || 'remote-image';
    const originalName = `${baseName}${extension}`;
    const tempDir = path_1.default.join(process.cwd(), 'storage', 'temp');
    (0, media_1.ensureUploadDir)(tempDir);
    const tempFilePath = path_1.default.join(tempDir, `remote-${Date.now()}-${(0, uuid_1.v4)()}${extension}`);
    try {
        const response = await axios_1.default.get(trimmedUrl, {
            responseType: 'stream',
            timeout: 60000,
            headers: { Accept: 'image/*' },
            maxContentLength: Infinity,
        });
        const contentType = response.headers['content-type'] || '';
        const stream = response.data;
        if (contentType && !contentType.startsWith('image/')) {
            stream.destroy();
            return res.status(400).json({ error: 'URL phải trỏ đến file ảnh hợp lệ.' });
        }
        const contentLength = Number(response.headers['content-length'] || 0);
        if (!Number.isNaN(contentLength) && contentLength > MAX_UPLOAD_FILE_SIZE) {
            stream.destroy();
            return res.status(413).json({
                error: `File quá lớn. Giới hạn tối đa là ${MAX_UPLOAD_FILE_SIZE_MB}MB.`,
            });
        }
        await downloadStreamToFile(stream, tempFilePath);
        const responsePayload = await processTempUpload(tempFilePath, originalName, folder_id);
        res.status(201).json(responsePayload);
    }
    catch (error) {
        cleanupTempFile(tempFilePath);
        console.error('[uploadMediaFromUrl] Error:', error);
        let statusCode = 500;
        let errorMessage = 'Không thể tải ảnh từ URL. Vui lòng thử lại.';
        if (error?.message === 'REMOTE_FILE_TOO_LARGE') {
            statusCode = 413;
            errorMessage = `File quá lớn. Giới hạn tối đa là ${MAX_UPLOAD_FILE_SIZE_MB}MB.`;
        }
        else if (axios_1.default.isAxiosError(error)) {
            const remoteStatus = error.response?.status;
            if (remoteStatus === 404) {
                statusCode = 404;
                errorMessage = 'Không tìm thấy file tại URL đã cung cấp.';
            }
            else if (remoteStatus === 401 || remoteStatus === 403) {
                statusCode = 400;
                errorMessage = 'Link yêu cầu đăng nhập hoặc không công khai. Hãy dùng URL ảnh trực tiếp (.jpg, .png, .webp) có thể truy cập công khai.';
            }
            else {
                statusCode = 400;
                errorMessage = `Tải ảnh thất bại (HTTP ${remoteStatus ?? 'không xác định'}). Vui lòng kiểm tra lại URL.`;
            }
        }
        else if (error?.code === 'ECONNABORTED') {
            statusCode = 504;
            errorMessage = 'Tải ảnh quá thời gian. Vui lòng thử lại.';
        }
        res.status(statusCode).json({ error: errorMessage });
    }
};
exports.uploadMediaFromUrl = uploadMediaFromUrl;
// GET /api/media - list all media with pagination and filters
const listMedia = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, search, type, folder_id } = req.query;
        const offset = (page - 1) * pageSize;
        const where = {};
        // Filter by search
        if (search) {
            where.url = { [sequelize_1.Op.iLike]: `%${search}%` };
        }
        // Filter by type
        if (type) {
            where.type = type;
        }
        // Filter by folder - validate UUID
        console.log('[listMedia] folder_id param:', folder_id);
        if (folder_id && folder_id !== '' && folder_id !== 'null' && folder_id !== 'undefined') {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(folder_id)) {
                where.folder_id = folder_id;
                console.log('[listMedia] Filtering by folder_id:', folder_id);
            }
            else {
                console.log('[listMedia] Invalid folder_id format:', folder_id);
            }
        }
        else if (folder_id === null || folder_id === 'null') {
            // Show only root level files (no folder)
            where.folder_id = null;
            console.log('[listMedia] Filtering for root-level files only');
        }
        else {
            console.log('[listMedia] No folder filter, showing all files');
        }
        // If folder_id is not provided, show all files
        const { count, rows } = await Asset_1.default.findAndCountAll({
            where,
            offset,
            limit: pageSize,
            order: [['created_at', 'DESC']],
        });
        // Add helper URLs for each asset
        const assetsWithUrls = rows.map((asset) => {
            const assetData = asset.toJSON();
            // URL format: /uploads/YYYY-MM-DD/uuid/filename.ext
            // Extract the directory part (everything except the filename)
            const urlParts = assetData.url.split('/');
            const directory = urlParts.slice(0, -1).join('/'); // /uploads/YYYY-MM-DD/uuid
            const fileName = urlParts[urlParts.length - 1]; // original_filename.ext
            // Try to get file size
            const filePath = path_1.default.join(process.cwd(), 'storage', assetData.url);
            const fileSize = (0, media_1.getFileSize)(filePath);
            // Extract thumbnail URL from sizes object
            // sizes can be: { thumb: { url: '/path/to/thumb.webp' } } or { thumb: 'thumb.webp' }
            let thumbUrl = null;
            let mediumUrl = null;
            let largeUrl = null;
            if (assetData.sizes) {
                // If sizes.thumb is an object with url property
                if (assetData.sizes.thumb?.url) {
                    thumbUrl = assetData.sizes.thumb.url;
                }
                // If sizes.thumb is a string (filename)
                else if (typeof assetData.sizes.thumb === 'string') {
                    thumbUrl = `${directory}/${assetData.sizes.thumb}`;
                }
                if (assetData.sizes.medium?.url) {
                    mediumUrl = assetData.sizes.medium.url;
                }
                else if (typeof assetData.sizes.medium === 'string') {
                    mediumUrl = `${directory}/${assetData.sizes.medium}`;
                }
                if (assetData.sizes.large?.url) {
                    largeUrl = assetData.sizes.large.url;
                }
                else if (typeof assetData.sizes.large === 'string') {
                    largeUrl = `${directory}/${assetData.sizes.large}`;
                }
            }
            return {
                ...assetData,
                file_name: fileName.replace('original_', ''),
                file_size: fileSize,
                thumb_url: thumbUrl || assetData.url,
                medium_url: mediumUrl || assetData.url,
                large_url: largeUrl || assetData.url,
                original_url: assetData.url,
            };
        });
        res.json({
            data: assetsWithUrls,
            total: count,
            page,
            pageSize,
            totalPages: Math.ceil(count / pageSize),
        });
    }
    catch (error) {
        console.error('[listMedia] Error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.listMedia = listMedia;
// PUT /api/media/:id - update media (move to folder)
const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { folder_id } = req.body;
        const asset = await Asset_1.default.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Media not found' });
        }
        // Update folder_id (null for root)
        await asset.update({
            folder_id: folder_id === undefined ? asset.folder_id : (folder_id || null)
        });
        res.json({ asset });
    }
    catch (error) {
        console.error('[updateMedia] Error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateMedia = updateMedia;
// POST /api/media/:id/rename - rename media file
const renameMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;
        if (!newName || newName.trim() === '') {
            return res.status(400).json({ error: 'New name is required' });
        }
        const asset = await Asset_1.default.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Media not found' });
        }
        const assetData = asset.toJSON();
        // Extract current file information
        const urlParts = assetData.url.split('/');
        const directory = urlParts.slice(0, -1).join('/'); // /uploads/YYYY-MM-DD/uuid
        const oldFileName = urlParts[urlParts.length - 1]; // original_oldname.ext
        const fileExt = path_1.default.extname(oldFileName);
        // Clean new name and create new filenames
        const cleanNewName = newName.trim().replace(/\s+/g, '_');
        const baseName = path_1.default.basename(cleanNewName, fileExt);
        // Physical directory path
        const physicalDir = path_1.default.join(process.cwd(), 'storage', ...urlParts.slice(1, -1));
        // Rename all file versions
        const sizes = typeof assetData.sizes === 'string'
            ? JSON.parse(assetData.sizes)
            : assetData.sizes;
        const newSizes = {};
        try {
            // Rename thumb
            if (sizes.thumb) {
                const oldThumbPath = path_1.default.join(physicalDir, sizes.thumb);
                const newThumbName = `${baseName}_thumb.webp`;
                const newThumbPath = path_1.default.join(physicalDir, newThumbName);
                if (fs_1.default.existsSync(oldThumbPath)) {
                    fs_1.default.renameSync(oldThumbPath, newThumbPath);
                    newSizes.thumb = newThumbName;
                }
            }
            // Rename medium
            if (sizes.medium) {
                const oldMediumPath = path_1.default.join(physicalDir, sizes.medium);
                const newMediumName = `${baseName}_medium.webp`;
                const newMediumPath = path_1.default.join(physicalDir, newMediumName);
                if (fs_1.default.existsSync(oldMediumPath)) {
                    fs_1.default.renameSync(oldMediumPath, newMediumPath);
                    newSizes.medium = newMediumName;
                }
            }
            // Rename large
            if (sizes.large) {
                const oldLargePath = path_1.default.join(physicalDir, sizes.large);
                const newLargeName = `${baseName}_large.webp`;
                const newLargePath = path_1.default.join(physicalDir, newLargeName);
                if (fs_1.default.existsSync(oldLargePath)) {
                    fs_1.default.renameSync(oldLargePath, newLargePath);
                    newSizes.large = newLargeName;
                }
            }
            // Rename original
            if (sizes.original) {
                const oldOriginalPath = path_1.default.join(physicalDir, sizes.original);
                const newOriginalName = `original_${baseName}${fileExt}`;
                const newOriginalPath = path_1.default.join(physicalDir, newOriginalName);
                if (fs_1.default.existsSync(oldOriginalPath)) {
                    fs_1.default.renameSync(oldOriginalPath, newOriginalPath);
                    newSizes.original = newOriginalName;
                }
            }
            // Update database
            const newUrl = `${directory}/${newSizes.original || newSizes.original}`;
            await asset.update({
                url: newUrl,
                sizes: newSizes
            });
            console.log(`[renameMedia] Renamed file from ${oldFileName} to ${newSizes.original}`);
            res.json({
                message: 'File renamed successfully',
                asset: {
                    ...assetData,
                    url: newUrl,
                    sizes: newSizes
                }
            });
        }
        catch (renameError) {
            console.error('[renameMedia] Error renaming files:', renameError);
            // Attempt to rollback any partial renames would go here
            throw new Error('Failed to rename file on disk');
        }
    }
    catch (error) {
        console.error('[renameMedia] Error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.renameMedia = renameMedia;
// DELETE /api/media/:id - delete media file
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset_1.default.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Media not found' });
        }
        // Delete physical files
        const assetData = asset.toJSON();
        if (assetData.sizes && assetData.url) {
            try {
                // Extract directory from URL: /uploads/YYYY-MM-DD/uuid/filename.ext
                const urlParts = assetData.url.split('/');
                // Remove empty first element and 'uploads', take date and uuid
                const pathParts = urlParts.filter(p => p).slice(1); // Remove 'uploads'
                const uploadDir = path_1.default.join(process.cwd(), 'storage', 'uploads', ...pathParts.slice(0, -1));
                // Parse sizes if it's a string (JSONB)
                const sizes = typeof assetData.sizes === 'string'
                    ? JSON.parse(assetData.sizes)
                    : assetData.sizes;
                (0, media_1.deleteImageFiles)(uploadDir, sizes);
            }
            catch (fileError) {
                console.error('[deleteMedia] Error deleting physical files:', fileError);
                // Continue with database deletion even if file deletion fails
            }
        }
        // Delete from database
        await asset.destroy();
        res.json({ message: 'Media deleted successfully' });
    }
    catch (error) {
        console.error('[deleteMedia] Error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMedia = deleteMedia;
//# sourceMappingURL=mediaController.js.map