/**
 * Helper functions for metadata processing
 */
/**
 * Strip HTML tags and decode HTML entities from text
 * Used for cleaning description text for metadata
 */
export declare function stripHtmlAndDecode(text: string): string;
/**
 * Normalize slug to match frontend normalization
 * This ensures the path matches what the frontend generates when querying metadata
 */
export declare function normalizeSlug(slug: string): string;
//# sourceMappingURL=metadataHelpers.d.ts.map