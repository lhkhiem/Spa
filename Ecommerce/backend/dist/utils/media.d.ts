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
export declare function ensureUploadDir(uploadPath: string): void;
export declare function processImage(filePath: string, outputDir: string, fileName: string): Promise<ProcessedImage>;
/**
 * Delete image and all its versions
 */
export declare function deleteImageFiles(uploadDir: string, sizes: ImageSizes): void;
/**
 * Get file size in bytes
 */
export declare function getFileSize(filePath: string): number;
/**
 * Format file size for display
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Convert image to WebP and try to keep it under 100KB
 * Used by assetController for legacy compatibility
 */
export declare function toWebpUnder100KB(input: Buffer, maxWidth: number): Promise<{
    buffer: Buffer;
    info: {
        width: number;
        height: number;
    };
}>;
//# sourceMappingURL=media.d.ts.map