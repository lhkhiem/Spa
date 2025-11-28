/**
 * Script to find and fix stuck ZaloPay orders
 *
 * Stuck orders are orders where:
 * - Payment was successful (has zp_trans_id) but payment_status is not 'paid'
 * - This can happen if callback succeeded but database update failed
 *
 * Usage:
 *   npx ts-node src/scripts/fixStuckZaloPayOrders.ts [--dry-run] [--refund]
 */
export {};
//# sourceMappingURL=fixStuckZaloPayOrders.d.ts.map