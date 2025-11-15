import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface ImageSizes {
  thumb?: string;
  medium?: string;
  large?: string;
  original?: string;
}

export interface ProcessedImage {
  original: string;
  thumb: string;
  medium: string;
  large: string;
  width: number;
  height: number;
  sizes: ImageSizes;
}

/**
 * Ensure upload directory exists
 */
export function ensureUploadDir(uploadPath: string): void {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

/**
 * Process uploaded image: create thumbnails and resize versions
 */
export async function processImage(
  filePath: string,
  outputDir: string,
  fileName: string
): Promise<ProcessedImage> {
  ensureUploadDir(outputDir);

  const fileExt = path.extname(fileName);
  const baseName = path.basename(fileName, fileExt);

  // Get original dimensions
  const metadata = await sharp(filePath).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Process different sizes
  const sizes: ImageSizes = {};

  // Thumbnail (150x150)
  const thumbPath = path.join(outputDir, `${baseName}_thumb.webp`);
  await sharp(filePath)
    .resize(150, 150, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(thumbPath);
  sizes.thumb = path.basename(thumbPath);

  // Medium (800x800 max, maintain aspect ratio)
  const mediumPath = path.join(outputDir, `${baseName}_medium.webp`);
  await sharp(filePath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(mediumPath);
  sizes.medium = path.basename(mediumPath);

  // Large (1600x1600 max, maintain aspect ratio)
  const largePath = path.join(outputDir, `${baseName}_large.webp`);
  await sharp(filePath)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(largePath);
  sizes.large = path.basename(largePath);

  // Keep original
  const originalPath = path.join(outputDir, `original_${baseName}${fileExt}`);
  await sharp(filePath)
    .toFile(originalPath);
  sizes.original = path.basename(originalPath);

  return {
    original: sizes.original,
    thumb: sizes.thumb,
    medium: sizes.medium,
    large: sizes.large,
    width,
    height,
    sizes,
  };
}

/**
 * Delete image and all its versions
 */
export function deleteImageFiles(uploadDir: string, sizes: ImageSizes): void {
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
    
    const filePath = path.join(uploadDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('[deleteImageFiles] Deleted:', filePath);
    }
  });

  // Try to delete the directory if it's empty
  try {
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      if (files.length === 0) {
        fs.rmdirSync(uploadDir);
        console.log('[deleteImageFiles] Deleted empty directory:', uploadDir);
      }
    }
  } catch (err) {
    // Ignore errors when deleting directory
  }
}

/**
 * Get file size in bytes
 */
export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convert image to WebP and try to keep it under 100KB
 * Used by assetController for legacy compatibility
 */
export async function toWebpUnder100KB(
  input: Buffer,
  maxWidth: number
): Promise<{ buffer: Buffer; info: { width: number; height: number } }> {
  let quality = 85;
  let buffer: Buffer;
  let info: sharp.OutputInfo;

  // Start with default quality and reduce if needed
  while (quality >= 40) {
    const result = await sharp(input)
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
  const result = await sharp(input)
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
