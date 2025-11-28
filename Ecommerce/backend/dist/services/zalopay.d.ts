interface CreateOrderParams {
    orderId: string;
    amount: number;
    description: string;
    appUser: string;
    embedData?: Record<string, any>;
    items?: Array<Record<string, any>>;
}
interface ZaloPayCreateOrderResponse {
    return_code: number;
    return_message: string;
    sub_return_code?: number;
    sub_return_message?: string;
    order_url?: string;
    zp_trans_token?: string;
    order_token?: string;
}
/**
 * Create ZaloPay order
 * Returns order_url to redirect user for payment
 */
export declare function createZaloPayOrder(params: CreateOrderParams): Promise<{
    body: any;
    response: ZaloPayCreateOrderResponse;
    app_trans_id: string;
}>;
/**
 * Verify callback MAC from ZaloPay
 * Uses CALLBACK_KEY (key2) for IPN verification
 */
export declare function verifyCallbackMac(data: string, mac: string): boolean;
/**
 * Query ZaloPay order status
 * Useful for retry/backfill if callback was missed
 */
export declare function queryZaloPayOrder(app_trans_id: string): Promise<any>;
/**
 * Refund ZaloPay transaction
 * @param zp_trans_id ZaloPay transaction ID (from callback)
 * @param amount Refund amount in VND (must be <= original amount)
 * @param description Refund description
 * @returns Refund result with m_refund_id
 */
export declare function refundZaloPayTransaction(zp_trans_id: number | string, amount: number, description?: string): Promise<any>;
/**
 * Query ZaloPay refund status
 * @param m_refund_id Refund ID from refund response
 * @returns Refund status
 */
export declare function queryZaloPayRefund(m_refund_id: string): Promise<any>;
export {};
//# sourceMappingURL=zalopay.d.ts.map