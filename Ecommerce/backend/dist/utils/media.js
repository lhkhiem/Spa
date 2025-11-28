"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUploadDir = ensureUploadDir;
exports.processImage = processImage;
exports.deleteImageFiles = deleteImageFiles;
exports.getFileSize = getFileSize;
exports.formatFileSize = formatFileSize;
exports.toWebpUnder100KB = toWebpUnder100KB;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
/**
 * Ensure upload directory exists
 */
function ensureUploadDir(uploadPath) {
    if (!fs_1.default.existsSync(uploadPath)) {
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
    }
}
/**
 * Process uploaded image: create thumbnails and resize versions
 */
const TARGET_FILE_SIZE_BYTES = 100 * 1024; // 100KB
const QUALITY_STEPS = [85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15];
async function saveVariantUnderTarget(filePath, outputPath, options) {
    const targetBytes = options.targetBytes ?? TARGET_FILE_SIZE_BYTES;
    const allowScaleDown = options.allowScaleDown ?? true;
    const minScale = allowScaleDown ? options.minScale ?? 0.4 : 1;
    const scaleStep = options.scaleStep ?? 0.85;
    const label = options.logLabel || 'variant';
    let currentScale = 1;
    let lastResult = null;
    while (currentScale >= minScale) {
        for (const quality of QUALITY_STEPS) {
            let pipeline = (0, sharp_1.default)(filePath);
            if (options.resize) {
                const resizeOptions = { ...options.resize };
                if (allowScaleDown && (resizeOptions.width || resizeOptions.height)) {
                    if (resizeOptions.width) {
                        resizeOptions.width = Math.max(1, Math.floor(resizeOptions.width * currentScale));
                    }
                    if (resizeOptions.height) {
                        resizeOptions.height = Math.max(1, Math.floor(resizeOptions.height * currentScale));
                    }
                }
                pipeline = pipeline.resize(resizeOptions);
            }
            const result = await pipeline
                .webp({ quality, effort: 6 })
                .toBuffer({ resolveWithObject: true });
            lastResult = { data: result.data, info: result.info, quality, scale: currentScale };
            if (result.data.length <= targetBytes) {
                await fs_1.default.promises.writeFile(outputPath, result.data);
                console.log(`[processImage] ${label} saved ${(result.data.length / 1024).toFixed(1)}KB @q${quality} scale ${currentScale.toFixed(2)}`);
                return {
                    width: result.info.width,
                    height: result.info.height,
                    bytes: result.data.length,
                    quality,
                };
            }
        }
        if (!allowScaleDown) {
            break;
        }
        currentScale *= scaleStep;
    }
    if (lastResult) {
        await fs_1.default.promises.writeFile(outputPath, lastResult.data);
        console.warn(`[processImage] ${label} fallback ${(lastResult.data.length / 1024).toFixed(1)}KB @q${lastResult.quality} scale ${lastResult.scale.toFixed(2)}`);
        return {
            width: lastResult.info.width,
            height: lastResult.info.height,
            bytes: lastResult.data.length,
            quality: lastResult.quality,
        };
    }
    throw new Error(`Failed to generate ${label} variant`);
}
async function processImage(filePath, outputDir, fileName) {
    console.log('[processImage] Starting process:', { filePath, outputDir, fileName });
    try {
        ensureUploadDir(outputDir);
        console.log('[processImage] Output directory ensured');
        const fileExt = path_1.default.extname(fileName);
        const baseName = path_1.default.basename(fileName, fileExt);
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`Input file does not exist: ${filePath}`);
        }
        console.log('[processImage] Reading image metadata...');
        let metadata;
        try {
            metadata = await (0, sharp_1.default)(filePath).metadata();
            console.log('[processImage] Image metadata:', { width: metadata.width, height: metadata.height, format: metadata.format });
        }
        catch (sharpError) {
            console.error('[processImage] Error reading metadata:', sharpError);
            throw new Error(`Invalid image file or corrupted: ${sharpError.message || 'Unknown error'}`);
        }
        const width = metadata.width || 0;
        const height = metadata.height || 0;
        const sizes = {};
        console.log('[processImage] Creating thumbnail (<=100KB)...');
        const thumbPath = path_1.default.join(outputDir, `${baseName}_thumb.webp`);
        try {
            await saveVariantUnderTarget(filePath, thumbPath, {
                resize: { width: 150, height: 150, fit: 'cover', position: 'center' },
                allowScaleDown: false,
                logLabel: 'thumbnail',
            });
            sizes.thumb = path_1.default.basename(thumbPath);
        }
        catch (thumbError) {
            console.error('[processImage] Error creating thumbnail:', thumbError);
            throw new Error(`Failed to create thumbnail: ${thumbError.message}`);
        }
        console.log('[processImage] Creating medium size (<=100KB)...');
        const mediumPath = path_1.default.join(outputDir, `${baseName}_medium.webp`);
        try {
            await saveVariantUnderTarget(filePath, mediumPath, {
                resize: { width: 800, height: 800, fit: 'inside', withoutEnlargement: true },
                allowScaleDown: true,
                minScale: 0.4,
                logLabel: 'medium',
            });
            sizes.medium = path_1.default.basename(mediumPath);
        }
        catch (mediumError) {
            console.error('[processImage] Error creating medium size:', mediumError);
            throw new Error(`Failed to create medium size: ${mediumError.message}`);
        }
        console.log('[processImage] Creating large size (<=100KB)...');
        const largePath = path_1.default.join(outputDir, `${baseName}_large.webp`);
        try {
            await saveVariantUnderTarget(filePath, largePath, {
                resize: { width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true },
                allowScaleDown: true,
                minScale: 0.4,
                logLabel: 'large',
            });
            sizes.large = path_1.default.basename(largePath);
        }
        catch (largeError) {
            console.error('[processImage] Error creating large size:', largeError);
            throw new Error(`Failed to create large size: ${largeError.message}`);
        }
        console.log('[processImage] Creating original size (<=100KB)...');
        const originalPath = path_1.default.join(outputDir, `original_${baseName}.webp`);
        const originalMaxDimension = 2048;
        const originalResult = await saveVariantUnderTarget(filePath, originalPath, {
            resize: {
                width: Math.min(width || originalMaxDimension, originalMaxDimension),
                height: Math.min(height || originalMaxDimension, originalMaxDimension),
                fit: 'inside',
                withoutEnlargement: true,
            },
            allowScaleDown: true,
            minScale: 0.3,
            logLabel: 'original',
        }).catch((originalError) => {
            console.error('[processImage] Error creating original WebP:', originalError);
            throw new Error(`Failed to create original WebP: ${originalError.message}`);
        });
        sizes.original = path_1.default.basename(originalPath);
        console.log('[processImage] All sizes processed successfully');
        return {
            original: sizes.original,
            thumb: sizes.thumb,
            medium: sizes.medium,
            large: sizes.large,
            width: originalResult.width,
            height: originalResult.height,
            sizes,
        };
    }
    catch (error) {
        console.error('[processImage] Unexpected error:', error);
        throw error;
    }
}
/**
 * Delete image and all its versions
 */
function deleteImageFiles(uploadDir, sizes) {
    // Validate inputs
    if (!uploadDir || typeof uploadDir !== 'string') {
        console.error('[deleteImageFiles] Invalid uploadDir:', uploadDir);
        return;
    }
    if (!sizes || typeof sizes !== 'object') {
        console.error('[deleteImageFiles] Invalid sizes:', sizes);
        return;
    }
    const filesToDelete = [
        sizes.thumb,
        sizes.medium,
        sizes.large,
        sizes.original,
    ].filter(Boolean);
    filesToDelete.forEach((file) => {
        if (typeof file !== 'string') {
            console.error('[deleteImageFiles] Invalid file name:', file);
            return;
        }
        const filePath = path_1.default.join(uploadDir, file);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log('[deleteImageFiles] Deleted:', filePath);
        }
    });
    // Try to delete the directory if it's empty
    try {
        if (fs_1.default.existsSync(uploadDir)) {
            const files = fs_1.default.readdirSync(uploadDir);
            if (files.length === 0) {
                fs_1.default.rmdirSync(uploadDir);
                console.log('[deleteImageFiles] Deleted empty directory:', uploadDir);
            }
        }
    }
    catch (err) {
        // Ignore errors when deleting directory
    }
}
/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
    try {
        const stats = fs_1.default.statSync(filePath);
        return stats.size;
    }
    catch {
        return 0;
    }
}
/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Convert image to WebP and try to keep it under 100KB
 * Used by assetController for legacy compatibility
 */
async function toWebpUnder100KB(input, maxWidth) {
    let quality = 85;
    let buffer;
    let info;
    // Start with default quality and reduce if needed
    while (quality >= 40) {
        const result = await (0, sharp_1.default)(input)
            .resize(maxWidth, undefined, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality })
            .toBuffer({ resolveWithObject: true });
        buffer = result.data;
        info = result.info;
        // If under 100KB or quality is already low, return
        if (buffer.byteLength <= 100 * 1024 || quality <= 40) {
            return {
                buffer,
                info: {
                    width: info.width,
                    height: info.height,
                },
            };
        }
        // Reduce quality and try again
        quality -= 10;
    }
    // Fallback (should not reach here)
    const result = await (0, sharp_1.default)(input)
        .resize(maxWidth, undefined, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 40 })
        .toBuffer({ resolveWithObject: true });
    return {
        buffer: result.data,
        info: {
            width: result.info.width,
            height: result.info.height,
        },
    };
}
//# sourceMappingURL=media.js.map