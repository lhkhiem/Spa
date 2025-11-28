/**
 * Generate a URL-friendly slug from a title
 * Converts "Hello World" to "hello-world"
 */
export declare function generateSlug(title: string): string;
/**
 * Generate a unique slug by appending a number if needed
 */
export declare function generateUniqueSlug(baseSlug: string, checkUnique: (slug: string) => Promise<boolean>, maxAttempts?: number): Promise<string>;
//# sourceMappingURL=slug.d.ts.map