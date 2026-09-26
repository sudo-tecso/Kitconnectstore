import React from 'react';
import Link from 'next/link';
import { OrderRepository } from '@/lib/repositories/orders';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default async function AdminOrdersPage() {
  const orders = await OrderRepository.getAllOrders();

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-graphite-1 border border-border-line p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card">
        <div>
          <Link href="/admin" className="font-mono text-xs text-slate hover:text-primary flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> ORDER MANAGEMENT SYSTEM
          </span>
          <h1 className="font-sans font-bold text-2xl text-on-surface">Customer Orders</h1>
        </div>
      </div>

      <div className="bg-graphite-2 rounded-2xl border border-border-line p-6 flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border-line text-slate">
                <th className="py-3 px-3">REF</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">CUSTOMER</th>
                <th className="py-3 px-3">PHONE</th>
                <th className="py-3 px-3">METHOD</th>
                <th className="py-3 px-3">ORDER STATUS</th>
                <th className="py-3 px-3">PAYMENT</th>
                <th className="py-3 px-3">TOTAL</th>
                <th className="py-3 px-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border-line/40 hover:bg-surface-container/30">
                  <td className="py-3 px-3 font-bold text-primary">{o.order_reference}</td>
                  <td className="py-3 px-3 text-slate">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-on-surface font-bold">{o.customer_name}</td>
                  <td className="py-3 px-3 text-slate">{o.customer_phone}</td>
                  <td className="py-3 px-3 text-slate">{o.payment_method}</td>
                  <td className="py-3 px-3">
                    <span className="bg-surface-container border border-border-line px-2 py-0.5 rounded text-[10px] uppercase">
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-primary">{o.payment?.status || 'PENDING'}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-on-surface">GHS {o.total.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="px-3 py-1 rounded bg-primary-container text-on-primary-container text-[11px] font-sans font-semibold hover:bg-secondary-container transition-colors"
                    >
                      Process Order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
