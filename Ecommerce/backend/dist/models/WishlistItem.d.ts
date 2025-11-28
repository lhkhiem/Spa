export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: Date;
    product?: any;
}
export interface CreateWishlistItemDTO {
    user_id: string;
    product_id: string;
}
//# sourceMappingURL=WishlistItem.d.ts.map