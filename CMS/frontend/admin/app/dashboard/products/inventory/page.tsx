'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PackageOpen, TrendingUp, AlertTriangle, Search, Plus, History } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { buildApiUrl } from '@/lib/api';

interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalStockValue: number;
}

interface InventoryProduct {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  cost_price: number | null;
  status: string;
  low_stock_threshold: number | null;
  reorder_point: number | null;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface StockMovement {
  id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  notes: string | null;
  created_at: string;
}

export default function InventoryPage() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'stock_asc' | 'stock_desc' | 'name' | 'sku'>('stock_asc');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [movementsDialogOpen, setMovementsDialogOpen] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get<{ success: boolean; data: InventoryStats }>(
        buildApiUrl('/api/inventory/stats'),
        { withCredentials: true }
      );
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory stats:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<{
        success: boolean;
        data: InventoryProduct[];
        pagination: { total: number; limit: number; offset: number; hasMore: boolean };
      }>(buildApiUrl('/api/inventory/products'), {
        params: {
          filter,
          search: search || undefined,
          sort,
          limit: 100,
          offset: 0,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, sort]);

  const fetchMovements = useCallback(async (productId: string) => {
    try {
      setLoadingMovements(true);
      const response = await axios.get<{ success: boolean; data: StockMovement[] }>(
        buildApiUrl(`/api/inventory/products/${productId}/movements`),
        {
          params: { limit: 50 },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMovements(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stock movements:', error);
      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, [fetchStats, fetchProducts]);

  const handleAdjustStock = async () => {
    if (!selectedProduct || !adjustQuantity) return;

    try {
      const quantity = parseInt(adjustQuantity);
      if (isNaN(quantity) || quantity === 0) {
        alert('Vui lòng nhập số lượng hợp lệ');
        return;
      }

      await axios.post(
        buildApiUrl('/api/inventory/adjust'),
        {
          productId: selectedProduct.id,
          quantity,
          notes: adjustNotes || 'Manual stock adjustment',
        },
        { withCredentials: true }
      );

      // Refresh data
      await fetchStats();
      await fetchProducts();
      setAdjustDialogOpen(false);
      setAdjustQuantity('');
      setAdjustNotes('');
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Failed to adjust stock:', error);
      alert(error.response?.data?.error || 'Failed to adjust stock');
    }
  };

  const handleViewMovements = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setMovementsDialogOpen(true);
    fetchMovements(product.id);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'text-red-600 dark:text-red-400';
      case 'low_stock':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'low_stock':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const formatMovementType = (type: string) => {
    const types: Record<string, string> = {
      sale: 'Bán hàng',
      purchase: 'Nhập hàng',
      adjustment: 'Điều chỉnh',
      return: 'Trả hàng',
      transfer: 'Chuyển kho',
      damage: 'Hư hỏng',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage product stock levels</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-card-foreground mt-2">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <PackageOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-card-foreground mt-2">{stats.lowStockItems}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-card-foreground mt-2">{stats.outOfStockItems}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <PackageOpen className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
                <p className="text-2xl font-bold text-card-foreground mt-2">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(stats.totalStockValue)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Products</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="stock_asc">Stock: Low to High</option>
          <option value="stock_desc">Stock: High to Low</option>
          <option value="name">Name A-Z</option>
          <option value="sku">SKU</option>
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No products found"
          description="No products match your current filters."
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={getStockStatusColor(product.stock_status)}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusBadge(
                        product.stock_status
                      )}`}
                    >
                      {product.stock_status === 'out_of_stock'
                        ? 'Out of Stock'
                        : product.stock_status === 'low_stock'
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setAdjustDialogOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-input bg-background text-foreground hover:bg-accent transition-colors text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Adjust
                      </button>
                      <button
                        onClick={() => handleViewMovements(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-input bg-background text-foreground hover:bg-accent transition-colors text-sm"
                      >
                        <History className="h-4 w-4" />
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Stock Dialog */}
      {adjustDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Adjust Stock</h2>
            {selectedProduct && (
              <p className="text-sm text-muted-foreground mb-4">
                Adjust stock for <strong>{selectedProduct.name}</strong>
                <br />
                Current stock: <strong>{selectedProduct.stock}</strong>
              </p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity Change</label>
                <input
                  type="number"
                  placeholder="e.g., +10 or -5"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use positive number to increase, negative to decrease
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  placeholder="Reason for adjustment..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                onClick={() => {
                  setAdjustDialogOpen(false);
                  setAdjustQuantity('');
                  setAdjustNotes('');
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Movements Dialog */}
      {movementsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Stock Movement History</h2>
            {selectedProduct && (
              <p className="text-sm text-muted-foreground mb-4">
                History for <strong>{selectedProduct.name}</strong>
              </p>
            )}
            <div className="flex-1 overflow-y-auto">
              {loadingMovements ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : movements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No movements found</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Change</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Previous</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">New</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm">
                          {new Date(movement.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-sm">{formatMovementType(movement.movement_type)}</td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {movement.quantity > 0 ? '+' : ''}
                          {movement.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm">{movement.previous_stock}</td>
                        <td className="px-4 py-3 text-sm">{movement.new_stock}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {movement.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setMovementsDialogOpen(false);
                  setSelectedProduct(null);
                  setMovements([]);
                }}
                className="px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
