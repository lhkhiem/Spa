/**
 * Sync post metadata to page_metadata table
 * This function is called automatically when a post is created or updated.
 * It will only update if the metadata is auto-generated (not custom).
 */
export declare function syncPostMetadataToCMS(post: any): Promise<void>;
//# sourceMappingURL=postMetadataSync.d.ts.map