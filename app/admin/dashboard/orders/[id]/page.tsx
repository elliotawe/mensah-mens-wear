'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getBasket } from '@/lib/api/baskets';
import type { BasketDetail } from '@/lib/api/baskets';
import { formatPrice } from '@/lib/api/items';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { buildImageUrl } from '@/lib/api/merchant';
import { ArrowLeft } from 'lucide-react';

export default function AdminOrderDetailPage() {
  useAdminAuth();
  const { id } = useParams<{ id: string }>();

  const [basket, setBasket] = useState<BasketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getBasket(id)
      .then(setBasket)
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  let waLink: string | null = null;
  if (basket) {
    try { waLink = buildWhatsAppLink(basket); } catch { /* no whatsapp */ }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-3xl">
        <Link
          href="/admin/dashboard/orders"
          className="inline-flex items-center gap-2 font-body text-sm text-[var(--color-taupe)] hover:text-[var(--color-parchment)] transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Orders
        </Link>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => <div key={i} className="h-16 skeleton rounded-[6px]" />)}
          </div>
        ) : error ? (
          <p className="font-body text-sm text-[var(--color-error)]">{error}</p>
        ) : basket ? (
          <>
            <div>
              <p className="eyebrow mb-2">Order Detail</p>
              <h1 className="font-display text-2xl font-300 text-[var(--color-parchment)] mb-1">
                Reference: {basket.id}
              </h1>
              <p className="font-body text-xs text-[var(--color-taupe)]">
                Placed: {new Date(basket.created_at * 1000).toLocaleString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
              {/* Items */}
              <div
                className="rounded-[8px] p-6 flex flex-col gap-5"
                style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">Order Items</p>
                <div className="flex flex-col gap-4 divide-y divide-white/5">
                  {basket.items.map(item => (
                    <div key={item.item_id} className="flex items-start gap-4 pt-4 first:pt-0">
                      <div className="relative w-14 h-18 flex-shrink-0 rounded-[3px] overflow-hidden" style={{ background: 'var(--color-slate)' }}>
                        {item.image_url && (
                          <Image
                            src={buildImageUrl(item.image_url)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-body text-sm text-[var(--color-parchment)]">{item.name}</p>
                        <p className="font-body text-xs text-[var(--color-taupe)]">Qty: {item.qty}</p>
                        {item.item_note && (
                          <p className="font-body text-xs italic text-[var(--color-taupe)] mt-0.5">{item.item_note}</p>
                        )}
                        <p className="font-accent text-sm text-[var(--color-gold)] mt-1">
                          {formatPrice(item.price_minor * item.qty, item.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">Total</p>
                  <p className="font-accent text-xl font-500 text-[var(--color-gold)]">
                    {formatPrice(basket.total_minor, basket.currency ?? 'GHS')}
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-[8px] p-6 flex flex-col gap-4"
                  style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">Customer</p>
                  <div className="flex flex-col gap-2.5">
                    {basket.customer_name && (
                      <div>
                        <p className="font-body text-xs text-[var(--color-taupe)]">Name</p>
                        <p className="font-body text-sm text-[var(--color-parchment)]">{basket.customer_name}</p>
                      </div>
                    )}
                    {basket.customer_phone && (
                      <div>
                        <p className="font-body text-xs text-[var(--color-taupe)]">Phone</p>
                        <p className="font-body text-sm text-[var(--color-parchment)]">{basket.customer_phone}</p>
                      </div>
                    )}
                    {basket.customer_note && (
                      <div>
                        <p className="font-body text-xs text-[var(--color-taupe)]">Note</p>
                        <p className="font-body text-sm italic text-[var(--color-parchment)]">{basket.customer_note}</p>
                      </div>
                    )}
                    {!basket.customer_name && !basket.customer_phone && (
                      <p className="font-body text-xs text-[var(--color-taupe)]">No customer info provided.</p>
                    )}
                  </div>
                </div>

                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[10px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-gold-light)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Reply on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
