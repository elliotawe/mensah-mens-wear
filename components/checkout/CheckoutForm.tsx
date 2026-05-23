'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBasketContext } from '@/context/BasketContext';
import { createBasket, getBasket } from '@/lib/api/baskets';
import { buildWhatsAppLink, BASKET_ERROR_MESSAGES } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/api/items';
import { useToast } from '@/components/ui/Toast';

export function CheckoutForm() {
  const { items, totalPrice, clearBasket } = useBasketContext();
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    toast.info('Opening WhatsApp…');

    try {
      const result = await createBasket({
        items: items.map(b => ({
          item_id: b.item.id,
          qty: b.qty,
          item_note: b.item_note,
        })),
        customer_name: name.trim(),
        customer_phone: `+233${phone.trim().replace(/^0/, '')}`,
        customer_note: note.trim() || undefined,
      });

      if (!result.success) {
        toast.error(BASKET_ERROR_MESSAGES[result.error ?? 'unknown']);
        setLoading(false);
        return;
      }

      const basket = await getBasket(result.basket_id!);
      const waLink = buildWhatsAppLink(basket);

      // Store basket ID for order-confirmed page
      sessionStorage.setItem('mensah_last_basket_id', basket.id);
      sessionStorage.setItem('mensah_last_wa_link', waLink);

      clearBasket();
      window.open(waLink, '_blank', 'noopener,noreferrer');
      router.push('/order-confirmed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
      <div className="mb-10">
        <p className="eyebrow mb-4">Checkout</p>
        <h1 className="headline-lg text-[var(--color-text-primary)]">Complete Your Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="customer-name" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
                Full Name <span aria-hidden="true" className="text-[var(--color-error)]">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                placeholder="Your full name"
                autoComplete="name"
                className="h-12 border border-[var(--color-border)] rounded-[4px] px-4 font-body text-sm text-[var(--color-text-primary)] bg-transparent placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="font-body text-xs text-[var(--color-error)]" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="customer-phone" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
                Phone Number <span aria-hidden="true" className="text-[var(--color-error)]">*</span>
              </label>
              <div className="flex items-stretch">
                <span className="flex items-center px-3 border border-r-0 border-[var(--color-border)] rounded-l-[4px] font-body text-sm text-[var(--color-text-muted)] bg-[var(--color-cream)] select-none">
                  +233
                </span>
                <input
                  id="customer-phone"
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                  placeholder="XX XXX XXXX"
                  autoComplete="tel"
                  className="flex-1 h-12 border border-[var(--color-border)] rounded-r-[4px] px-4 font-body text-sm text-[var(--color-text-primary)] bg-transparent placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="font-body text-xs text-[var(--color-error)]" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2">
              <label htmlFor="customer-note" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
                Order Note (optional)
              </label>
              <textarea
                id="customer-note"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Any special instructions, measurements, or requests…"
                rows={4}
                className="border border-[var(--color-border)] rounded-[4px] px-4 py-3 font-body text-sm text-[var(--color-text-primary)] bg-transparent placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 flex items-center justify-center gap-3 bg-[var(--color-obsidian)] text-[var(--color-parchment)] font-accent text-[11px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-charcoal)] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none"
          >
            {loading ? (
              <>
                <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                <span>Preparing Order…</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send Order via WhatsApp
              </>
            )}
          </button>
        </form>

        {/* Order summary (sticky) */}
        <div className="lg:sticky lg:top-24">
          <div className="border border-[var(--color-border)] rounded-[8px] p-6 bg-white">
            <h2 className="font-display text-xl font-300 text-[var(--color-text-primary)] mb-6">
              Order Summary
            </h2>

            <div className="flex flex-col gap-0 divide-y divide-[var(--color-border)]">
              {items.map(b => (
                <div key={b.item.id} className="flex items-center gap-4 py-4">
                  <div className="relative w-12 h-16 flex-shrink-0 rounded-[3px] overflow-hidden bg-[var(--color-cream)]">
                    <Image
                      src={b.item.primary_image}
                      alt={b.item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-[var(--color-text-primary)] line-clamp-1">{b.item.name}</p>
                    <p className="font-body text-xs text-[var(--color-text-muted)]">Qty: {b.qty}</p>
                  </div>
                  <p className="font-accent text-sm font-500 text-[var(--color-text-primary)] flex-shrink-0">
                    {formatPrice(b.item.price_minor * b.qty, b.item.currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-[var(--color-border)] mt-2">
              <p className="font-body text-sm text-[var(--color-text-secondary)]">Total</p>
              <p className="font-accent text-xl font-500 text-[var(--color-gold)]">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <p className="font-body text-xs text-[var(--color-text-muted)] mt-2">
              Prices in GHS (Ghanaian Cedi)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
