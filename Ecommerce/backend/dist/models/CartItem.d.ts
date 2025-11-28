export interface CartItem {
    id: string;
    user_id?: string | null;
    session_id?: string | null;
    product_id: string;
    quantity: number;
    snapshot_price?: number;
    created_at: Date;
    updated_at: Date;
    product?: any;
}
export interface CreateCartItemDTO {
    user_id?: string | null;
    session_id?: string | null;
    product_id: string;
    quantity?: number;
    snapshot_price?: number;
}
export interface UpdateCartItemDTO {
    quantity?: number;
}
//# sourceMappingURL=CartItem.d.ts.map