/**
 * Sync product metadata to page_metadata table
 * This function is called automatically when a product is created or updated.
 * It will only update if the metadata is auto-generated (not custom).
 */
export declare function syncProductMetadataToCMS(product: any): Promise<void>;
//# sourceMappingURL=productMetadataSync.d.ts.map