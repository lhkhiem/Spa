import apiClient from './client';
import { buildApiUrl } from '@/config/site';

export interface CreateZaloPayOrderPayload {
  orderId: string; // Internal order ID
  amount?: number; // Optional, will use order total if not provided
  description?: string;
  appUser: string; // User identifier (phone, email, or user ID)
  items?: Array<Record<string, any>>;
  embedData?: Record<string, any>;
}

export interface CreateZaloPayOrderResponse {
  success: boolean;
  data?: {
    app_trans_id: string;
    order_url: string;
    zp_trans_token?: string;
    return_code: number;
    return_message: string;
    order_id: string;
    order_number: string;
  };
  error?: string;
  message?: string;
}

export interface QueryZaloPayOrderResponse {
  success: boolean;
  data?: {
    return_code: number;
    return_message: string;
    sub_return_code?: number;
    sub_return_message?: string;
    zp_trans_id?: number;
    amount?: number;
  };
  error?: string;
}

/**
 * Create ZaloPay payment order
 * POST /api/payments/zalopay/create
 */
export const createZaloPayOrder = async (
  payload: CreateZaloPayOrderPayload
): Promise<CreateZaloPayOrderResponse> => {
  try {
    const response = await apiClient.post<CreateZaloPayOrderResponse>(
      buildApiUrl('payments/zalopay/create'),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error('[Payments API] Create ZaloPay order error:', error);
    throw error;
  }
};

/**
 * Query ZaloPay order status
 * GET /api/payments/zalopay/query/:appTransId
 */
export const queryZaloPayOrder = async (
  appTransId: string
): Promise<QueryZaloPayOrderResponse> => {
  try {
    const response = await apiClient.get<QueryZaloPayOrderResponse>(
      buildApiUrl(`payments/zalopay/query/${appTransId}`)
    );
    return response.data;
  } catch (error: any) {
    console.error('[Payments API] Query ZaloPay order error:', error);
    throw error;
  }
};





