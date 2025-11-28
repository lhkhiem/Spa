export interface StockMovement {
    id: string;
    product_id: string;
    variant_id?: string | null;
    movement_type: string;
    quantity: number;
    previous_stock: number;
    new_stock: number;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_by?: string | null;
    created_at: Date;
}
export interface StockSettings {
    id: string;
    product_id: string;
    variant_id?: string | null;
    low_stock_threshold: number;
    reorder_point: number;
    reorder_quantity: number;
    track_inventory: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class StockService {
    /**
     * Get current stock for a product or variant
     */
    static getStock(productId: string, variantId?: string | null): Promise<number>;
    /**
     * Update stock with movement tracking
     * @param quantity - positive for increase, negative for decrease
     */
    static updateStock(productId: string, variantId: string | null, quantity: number, movementType: 'sale' | 'purchase' | 'adjustment' | 'return' | 'transfer' | 'damage', referenceType?: string, referenceId?: string, notes?: string, userId?: string): Promise<StockMovement>;
    /**
     * Get stock movements history
     */
    static getStockMovements(productId?: string, variantId?: string | null, movementType?: string, limit?: number, offset?: number): Promise<StockMovement[]>;
    /**
     * Check if stock is low based on settings
     */
    static checkLowStock(productId: string, variantId?: string | null): Promise<boolean>;
    /**
     * Get stock settings for a product/variant
     */
    static getStockSettings(productId: string, variantId?: string | null): Promise<StockSettings | null>;
    /**
     * Update or create stock settings
     */
    static updateStockSettings(productId: string, variantId: string | null, settings: {
        low_stock_threshold?: number;
        reorder_point?: number;
        reorder_quantity?: number;
        track_inventory?: boolean;
    }): Promise<StockSettings>;
}
//# sourceMappingURL=stockService.d.ts.map