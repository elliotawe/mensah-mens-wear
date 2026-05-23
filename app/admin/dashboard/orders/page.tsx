'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getTeamData } from '@/lib/api/team';
import { formatPrice } from '@/lib/api/items';

interface Order {
  id: string;
  customer_name: string | null;
  total_minor: number;
  created_at: number;
}

export default function AdminOrdersPage() {
  useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamData()
      .then(data => {
        const raw: Order[] = data?.baskets ?? [];
        setOrders([...raw].sort((a, b) => b.created_at - a.created_at));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow mb-2">Fulfilment</p>
          <h1 className="font-display text-3xl font-300 text-[var(--color-parchment)]">Orders</h1>
        </div>

        <div
          className="rounded-[8px] overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 skeleton rounded" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <p className="font-display text-xl font-300 text-[var(--color-parchment)] mb-2">No orders yet</p>
              <p className="font-body text-sm text-[var(--color-taupe)]">
                Orders will appear here once customers checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Order ID', 'Customer', 'Total', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-accent text-[9px] tracking-widest uppercase" style={{ color: 'var(--color-taupe)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0 hover:brightness-110 transition-all cursor-pointer"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--color-charcoal)' }}
                      onClick={() => window.location.href = `/admin/dashboard/orders/${order.id}`}
                    >
                      <td className="px-5 py-4 font-accent text-xs" style={{ color: 'var(--color-parchment)' }}>
                        {order.id.slice(0, 12)}…
                      </td>
                      <td className="px-5 py-4 font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                        {order.customer_name ?? 'Anonymous'}
                      </td>
                      <td className="px-5 py-4 font-accent text-xs" style={{ color: 'var(--color-gold)' }}>
                        {formatPrice(order.total_minor)}
                      </td>
                      <td className="px-5 py-4 font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                        {new Date(order.created_at * 1000).toLocaleDateString('en-GH', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/dashboard/orders/${order.id}`}
                          className="font-accent text-[10px] tracking-wider uppercase hover:underline"
                          style={{ color: 'var(--color-gold)' }}
                          onClick={e => e.stopPropagation()}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
