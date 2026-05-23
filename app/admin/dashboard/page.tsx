'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getItems } from '@/lib/api/items';
import { getCampaigns } from '@/lib/api/campaigns';
import { getTeamData } from '@/lib/api/team';
import { formatPrice } from '@/lib/api/items';
import { Package, Megaphone, ShoppingBag, TrendingUp, Plus } from 'lucide-react';

interface Stats {
  totalItems: number;
  totalCampaigns: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: { id: string; customer_name: string | null; total_minor: number; created_at: number }[];
}

export default function AdminDashboard() {
  useAdminAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [items, campaigns, team] = await Promise.all([
          getItems(),
          getCampaigns(),
          getTeamData(),
        ]);
        const orders: { id: string; customer_name: string | null; total_minor: number; created_at: number }[] =
          team?.baskets ?? [];
        setStats({
          totalItems: items.length,
          totalCampaigns: campaigns.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((s: number, o: { total_minor: number }) => s + o.total_minor, 0),
          recentOrders: orders.slice(0, 5).sort((a: { created_at: number }, b: { created_at: number }) => b.created_at - a.created_at),
        });
      } catch {
        /* silently fail — partial data ok */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Items', value: stats?.totalItems ?? '—', icon: Package, color: 'var(--color-gold)' },
    { label: 'Campaigns', value: stats?.totalCampaigns ?? '—', icon: Megaphone, color: 'var(--color-gold)' },
    { label: 'Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'var(--color-gold)' },
    {
      label: 'Total Revenue',
      value: stats ? formatPrice(stats.totalRevenue) : '—',
      icon: TrendingUp,
      color: 'var(--color-gold)',
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h1 className="font-display text-3xl font-300 text-[var(--color-parchment)]">Dashboard</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <div
              key={card.label}
              className="rounded-[8px] p-5 flex flex-col gap-3"
              style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <card.icon className="size-5" style={{ color: card.color }} aria-hidden="true" />
              <div>
                <p
                  className="font-display text-2xl font-300"
                  style={{ color: 'var(--color-parchment)' }}
                >
                  {loading ? (
                    <span className="inline-block w-16 h-6 skeleton rounded" />
                  ) : card.value}
                </p>
                <p className="font-accent text-[10px] tracking-widest uppercase mt-1" style={{ color: 'var(--color-taupe)' }}>
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/admin/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[10px] tracking-widest uppercase px-6 h-10 rounded-[4px] hover:bg-[var(--color-gold-light)] transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Create Campaign
          </Link>
          <Link
            href="/admin/dashboard/orders"
            className="inline-flex items-center gap-2 border font-accent text-[10px] tracking-widest uppercase px-6 h-10 rounded-[4px] transition-colors cursor-pointer"
            style={{ borderColor: 'rgba(201,168,76,0.3)', color: 'var(--color-gold)' }}
          >
            View All Orders
          </Link>
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-display text-xl font-300 text-[var(--color-parchment)] mb-5">Recent Orders</h2>
          <div
            className="rounded-[8px] overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {loading ? (
              <div className="p-6 flex flex-col gap-3">
                {[1, 2, 3].map(i => <div key={i} className="h-10 skeleton rounded" />)}
              </div>
            ) : (stats?.recentOrders ?? []).length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-body text-sm" style={{ color: 'var(--color-taupe)' }}>
                  No orders yet. Orders will appear here once customers checkout.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Order ID', 'Customer', 'Total', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-accent text-[9px] tracking-widest uppercase" style={{ color: 'var(--color-taupe)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders ?? []).map(order => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--color-charcoal)' }}
                    >
                      <td className="px-4 py-3 font-accent text-xs" style={{ color: 'var(--color-parchment)' }}>
                        {order.id.slice(0, 10)}…
                      </td>
                      <td className="px-4 py-3 font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                        {order.customer_name ?? 'Anonymous'}
                      </td>
                      <td className="px-4 py-3 font-accent text-xs" style={{ color: 'var(--color-gold)' }}>
                        {formatPrice(order.total_minor)}
                      </td>
                      <td className="px-4 py-3 font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                        {new Date(order.created_at * 1000).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/dashboard/orders/${order.id}`}
                          className="font-accent text-[10px] tracking-wider uppercase hover:underline"
                          style={{ color: 'var(--color-gold)' }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
