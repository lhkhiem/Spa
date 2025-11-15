import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types/order';
import { Address } from '@/lib/types/user';

export interface OrderAddressPayload {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface CreateOrderItemPayload {
  product_id: string;
  quantity: number;
  variant_info?: Record<string, unknown> | null;
}

export interface CreateOrderPayload {
  customer_id?: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string; // Required for phone-based order lookup
  shipping_address: OrderAddressPayload;
  billing_address: OrderAddressPayload;
  shipping_method: 'standard' | 'express' | string;
  payment_method: string;
  items: CreateOrderItemPayload[];
  notes?: string;
}

export interface OrderDTO {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  shipping_address: OrderAddressPayload;
  billing_address: OrderAddressPayload;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_method: string | null;
  payment_method: string | null;
  payment_status: string | null;
  status: string | null;
  notes: string | null;
  tracking_number?: string | null;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    product_sku: string | null;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant_info: Record<string, unknown> | null;
  }>;
}

export interface OrdersResponse {
  data: OrderDTO[];
}

export interface OrderResponse {
  data: OrderDTO;
}

/**
 * Map OrderDTO to Order type
 */
const mapOrderDTOToOrder = (dto: OrderDTO): Order => {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    userId: dto.customer_id || '',
    items: dto.items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200',
      variantId: item.variant_info ? String(item.variant_info.id || '') : undefined,
      variantName: item.variant_info ? String(item.variant_info.name || '') : undefined,
      sku: item.product_sku || '',
      quantity: item.quantity,
      price: item.unit_price,
      total: item.total_price,
    })),
    status: (dto.status as OrderStatus) || 'pending',
    paymentStatus: (dto.payment_status as PaymentStatus) || 'pending',
    shippingAddress: {
      id: dto.shipping_address.addressLine1 || '',
      userId: dto.customer_id || '',
      firstName: dto.shipping_address.firstName,
      lastName: dto.shipping_address.lastName,
      company: dto.shipping_address.company,
      addressLine1: dto.shipping_address.addressLine1,
      addressLine2: dto.shipping_address.addressLine2,
      city: dto.shipping_address.city,
      state: dto.shipping_address.state,
      postalCode: dto.shipping_address.postalCode,
      country: dto.shipping_address.country,
      phone: dto.shipping_address.phone,
      isDefault: false,
      type: 'shipping',
    },
    billingAddress: {
      id: dto.billing_address.addressLine1 || '',
      userId: dto.customer_id || '',
      firstName: dto.billing_address.firstName,
      lastName: dto.billing_address.lastName,
      company: dto.billing_address.company,
      addressLine1: dto.billing_address.addressLine1,
      addressLine2: dto.billing_address.addressLine2,
      city: dto.billing_address.city,
      state: dto.billing_address.state,
      postalCode: dto.billing_address.postalCode,
      country: dto.billing_address.country,
      phone: dto.billing_address.phone,
      isDefault: false,
      type: 'billing',
    },
    shippingMethod: dto.shipping_method || '',
    paymentMethod: dto.payment_method || '',
    subtotal: dto.subtotal,
    shipping: dto.shipping_cost,
    tax: dto.tax_amount,
    discount: dto.discount_amount,
    total: dto.total,
    trackingNumber: dto.tracking_number || undefined,
    notes: dto.notes || undefined,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};

/**
 * Get all orders for the current user
 */
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<OrdersResponse>(API_ENDPOINTS.ORDERS.LIST);
  return response.data.data.map(mapOrderDTOToOrder);
};

/**
 * Get a single order by ID
 */
export const fetchOrder = async (orderId: string): Promise<Order> => {
  const response = await apiClient.get<OrderResponse>(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  return mapOrderDTOToOrder(response.data.data);
};

/**
 * Create a new order
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await apiClient.post<OrderDTO | OrderResponse>(API_ENDPOINTS.ORDERS.CREATE, payload);
  
  // Backend returns OrderDTO directly (not wrapped in { data: ... })
  // Handle both cases: direct OrderDTO or wrapped OrderResponse
  const orderDTO: OrderDTO = 'data' in response.data ? response.data.data : response.data as OrderDTO;
  
  return mapOrderDTOToOrder(orderDTO);
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await apiClient.post<OrderResponse>(API_ENDPOINTS.ORDERS.CANCEL(orderId));
  return response.data.data;
};

