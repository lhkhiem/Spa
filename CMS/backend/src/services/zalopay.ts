import axios, { AxiosError } from 'axios';
import { hmacSHA256Hex } from '../utils/hmac';
import { vnYYMMDD } from '../utils/zalopayTime';

interface CreateOrderParams {
  orderId: string; // Internal order ID
  amount: number; // Amount in VND
  description: string;
  appUser: string; // User identifier (can be phone, email, or user ID)
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

interface ZaloPayCallbackData {
  app_id: number;
  app_trans_id: string;
  app_user: string;
  amount: number;
  app_time: number;
  embed_data: string;
  item: string;
  zp_trans_id: number;
  server_time: number;
  channel: number;
  merchant_user_id?: string;
}

/**
 * Create ZaloPay order
 * Returns order_url to redirect user for payment
 */
export async function createZaloPayOrder(params: CreateOrderParams): Promise<{
  body: any;
  response: ZaloPayCreateOrderResponse;
  app_trans_id: string;
}> {
  const app_id = Number(process.env.ZP_APP_ID);
  const key1 = process.env.ZP_KEY1;
  const callback_url = process.env.ZP_CALLBACK_URL;

  if (!app_id || !key1 || !callback_url) {
    const missing: string[] = [];
    if (!app_id) missing.push('ZP_APP_ID');
    if (!key1) missing.push('ZP_KEY1');
    if (!callback_url) missing.push('ZP_CALLBACK_URL');
    throw new Error(`ZaloPay configuration missing: ${missing.join(', ')}`);
  }
  
  // Validate app_id is a valid number
  if (isNaN(app_id) || app_id <= 0) {
    throw new Error(`Invalid ZP_APP_ID: ${process.env.ZP_APP_ID}. Must be a positive number.`);
  }

  const app_time = Date.now();
  const app_trans_id = `${vnYYMMDD()}_${params.orderId}`;

  // Embed data includes redirect URL for after payment
  const embed_data = JSON.stringify({
    redirecturl: process.env.ZP_REDIRECT_URL || `${process.env.WEBSITE_ORIGIN || 'http://localhost:3000'}/checkout/result`,
    ...(params.embedData || {}),
  });

  const item = JSON.stringify(params.items || []);

  // MAC calculation: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
  const macInput = [
    app_id,
    app_trans_id,
    params.appUser,
    params.amount,
    app_time,
    embed_data,
    item,
  ].join('|');

  const mac = hmacSHA256Hex(key1, macInput);

  const body = {
    app_id,
    app_user: params.appUser,
    app_trans_id,
    app_time,
    amount: params.amount,
    description: params.description,
    embed_data,
    item,
    callback_url,
    mac,
  };

  const base = (process.env.ZP_API_BASE || 'https://sb-openapi.zalopay.vn/v2').replace(/\/+$/, '');
  const path = process.env.ZP_ORDER_CREATE_PATH || '/create';

  try {
    const { data } = await axios.post<ZaloPayCreateOrderResponse>(
      `${base}${path}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    return { body, response: data, app_trans_id };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ZaloPayCreateOrderResponse>;
      console.error('[ZaloPay] Create order error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });
      throw new Error(`ZaloPay API error: ${axiosError.response?.data?.return_message || axiosError.message}`);
    }
    throw error;
  }
}

/**
 * Verify callback MAC from ZaloPay
 * Uses CALLBACK_KEY (key2) for IPN verification
 */
export function verifyCallbackMac(data: string, mac: string): boolean {
  const callbackKey = process.env.ZP_CALLBACK_KEY;
  if (!callbackKey) {
    console.error('[ZaloPay] CALLBACK_KEY not configured');
    return false;
  }
  const expected = hmacSHA256Hex(callbackKey, data);
  return expected === mac;
}

/**
 * Query ZaloPay order status
 * Useful for retry/backfill if callback was missed
 */
export async function queryZaloPayOrder(app_trans_id: string): Promise<any> {
  const app_id = Number(process.env.ZP_APP_ID);
  const key1 = process.env.ZP_KEY1;

  if (!app_id || !key1) {
    throw new Error('ZaloPay configuration missing: ZP_APP_ID or ZP_KEY1');
  }

  const time = Date.now();
  const mac = hmacSHA256Hex(key1, [app_id, app_trans_id, time].join('|'));

  const base = (process.env.ZP_API_BASE || 'https://sb-openapi.zalopay.vn/v2').replace(/\/+$/, '');
  const path = process.env.ZP_ORDER_QUERY_PATH || '/query';

  try {
    const { data } = await axios.post(
      `${base}${path}`,
      { app_id, app_trans_id, time, mac },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('[ZaloPay] Query order error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });
      throw new Error(`ZaloPay query error: ${axiosError.message}`);
    }
    throw error;
  }
}


