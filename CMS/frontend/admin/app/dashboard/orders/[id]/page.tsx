'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api';
import { Order, OrderItem } from '@/types';
import { useAuthStore } from '@/store/authStore';

const toCurrency = (value: number | string | null | undefined) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return '$0.00';
  return numeric.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeAddress = (
  address: any
): Record<string, string | number> | null => {
  if (!address) return null;
  if (typeof address === 'string') {
    try {
      return JSON.parse(address);
    } catch (error) {
      return { raw: address };
    }
  }
  if (typeof address === 'object') {
    return address as Record<string, string | number>;
  }
  return null;
};

const normalizeOrder = (raw: any): Order => {
  const items: OrderItem[] = Array.isArray(raw?.items)
    ? raw.items.map((item: any) => ({
        ...item,
        quantity: Number(item?.quantity ?? 0),
        unit_price: Number(item?.unit_price ?? 0),
        total_price: Number(
          item?.total_price ?? item?.subtotal ?? item?.unit_price ?? 0
        ),
      }))
    : [];

  return {
    ...raw,
    subtotal: Number(raw?.subtotal ?? 0),
    tax_amount: Number(raw?.tax_amount ?? 0),
    shipping_cost: Number(raw?.shipping_cost ?? 0),
    discount_amount: Number(raw?.discount_amount ?? 0),
    total: Number(raw?.total ?? 0),
    items,
    shipping_address: normalizeAddress(raw?.shipping_address) ?? {},
    billing_address: normalizeAddress(raw?.billing_address) ?? {},
  };
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const { user, hydrate } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ensureAuthAndFetch = async () => {
      try {
        if (!user) {
          await hydrate();
          if (!useAuthStore.getState().user) {
            window.location.href = '/login';
            return;
          }
        }
        if (!orderId) {
          setError('Order ID is missing');
          return;
        }
        await fetchOrder(orderId);
      } catch (err) {
        console.error('[OrderDetail] failed to load', err);
        setError('Failed to load order');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    ensureAuthAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(buildApiUrl(`/api/orders/${id}`), {
        withCredentials: true,
      });
      setOrder(normalizeOrder(response.data));
    } catch (err: any) {
      console.error('Failed to fetch order detail:', err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to load order';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const shippingAddress = useMemo(
    () => normalizeAddress(order?.shipping_address) ?? {},
    [order?.shipping_address]
  );
  const billingAddress = useMemo(
    () => normalizeAddress(order?.billing_address) ?? {},
    [order?.billing_address]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order detail</h1>
            <p className="text-sm text-muted-foreground">
              {error || 'Order not found'}
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-destructive">
            {error || 'We could not find this order. It may have been removed.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order {order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDateTime(order.created_at)}
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Order items
            </h2>
            {order.items && order.items.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                        Variant
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.product_name}
                              </div>
                              {item.product_id && (
                                <div className="text-xs text-muted-foreground">
                                  ID: {item.product_id}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.product_sku || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.variant_name || '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-foreground">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-foreground">
                          {toCurrency(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                          {toCurrency(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No items found for this order.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Order summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{toCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{toCurrency(order.shipping_cost)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{toCurrency(order.tax_amount)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-{toCurrency(order.discount_amount)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-base font-semibold text-card-foreground">
                <span>Total</span>
                <span>{toCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Customer
            </h2>
            <div className="space-y-1 text-sm">
              <div className="font-medium text-card-foreground">
                {order.customer_name}
              </div>
              <div className="text-muted-foreground">
                {order.customer_email}
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Status: {order.status}</div>
              <div>Payment: {order.payment_status}</div>
              {order.payment_method && (
                <div>Payment method: {order.payment_method}</div>
              )}
              {order.tracking_number && (
                <div>Tracking number: {order.tracking_number}</div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Shipping address
            </h2>
            <AddressBlock address={shippingAddress} />
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Billing address
            </h2>
            <AddressBlock address={billingAddress} />
          </div>
        </div>
      </div>
    </div>
  );
}

const AddressBlock = ({ address }: { address: Record<string, any> }) => {
  if (!address || Object.keys(address).length === 0) {
    return <p className="text-sm text-muted-foreground">No address provided.</p>;
  }

  const prioritizedFields = [
    'name',
    'company',
    'line1',
    'line2',
    'city',
    'state',
    'province',
    'postal_code',
    'zip',
    'country',
    'phone',
  ];

  const orderedEntries = [
    ...prioritizedFields
      .map((field) =>
        field in address ? [field, address[field] as string | number] : null
      )
      .filter(Boolean),
    ...Object.entries(address).filter(
      ([key]) => !prioritizedFields.includes(key)
    ),
  ] as Array<[string, string | number]>;

  return (
    <div className="space-y-1 text-sm text-card-foreground">
      {orderedEntries.map(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return null;
        }
        return (
          <div key={key} className="flex items-start gap-2 text-sm">
            <span className="w-24 text-xs uppercase text-muted-foreground">
              {key.replace(/_/g, ' ')}
            </span>
            <span className="flex-1">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
};



