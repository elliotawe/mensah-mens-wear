'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ItemDisplay } from '@/lib/api/items';
import { formatPrice } from '@/lib/api/items';
import { ProductImageGallery } from './ProductImageGallery';
import { Badge } from '@/components/ui/Badge';
import { useBasketContext } from '@/context/BasketContext';
import { useToast } from '@/components/ui/Toast';
import { Minus, Plus } from 'lucide-react';

interface ProductDetailProps {
  item: ItemDisplay;
  whatsappNumber?: string | null;
}

export function ProductDetail({ item, whatsappNumber }: ProductDetailProps) {
  const { addItem, openDrawer } = useBasketContext();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  function handleAddToBasket() {
    if (!item.in_stock) return;
    addItem(item, qty, note || undefined);
    toast.success(`${item.name} added to basket`);
    openDrawer();
  }

  const digits = whatsappNumber?.replace(/\D/g, '');
  const enquiryLink = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hello Mensah, I am interested in: ${item.name} (GH₵${item.price_ghs.toFixed(2)}). Could you tell me more?`)}`
    : null;

  const images = (item.image_urls as string[]) ?? [];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-10 font-body text-xs text-[var(--color-text-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop" className="hover:text-[var(--color-gold)] transition-colors">Shop</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-primary)]" aria-current="page">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Left — Images */}
        <ProductImageGallery images={images} productName={item.name} />

        {/* Right — Details */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <p className="eyebrow">Mensah Collection</p>

          {/* Name */}
          <h1 className="font-display text-4xl md:text-5xl font-300 text-[var(--color-text-primary)] leading-tight">
            {item.name}
          </h1>

          {/* Price */}
          <p className="font-accent text-2xl font-500 text-[var(--color-gold)]">
            {formatPrice(item.price_minor, item.currency)}
          </p>

          {/* Stock */}
          <Badge variant={item.in_stock ? 'in-stock' : 'out-of-stock'}>
            {item.in_stock ? 'In Stock' : 'Out of Stock'}
          </Badge>

          {/* Divider */}
          <span className="gold-rule" aria-hidden="true" />

          {/* Description */}
          {item.description && (
            <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed">
              {item.description}
            </p>
          )}

          {item.in_stock && (
            <>
              {/* Special instructions */}
              <div className="flex flex-col gap-2">
                <label htmlFor="item-note" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
                  Special Instructions (optional)
                </label>
                <textarea
                  id="item-note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Size 42, slim fit, extra length"
                  rows={3}
                  className="w-full border border-[var(--color-border)] rounded-[4px] px-4 py-3 font-body text-sm text-[var(--color-text-primary)] bg-transparent placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
                />
              </div>

              {/* Quantity stepper */}
              <div className="flex flex-col gap-2">
                <p className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">Quantity</p>
                <div className="flex items-center gap-0 border border-[var(--color-border)] rounded-[4px] w-fit">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-cream)] transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-10 text-center font-accent text-sm" aria-live="polite" aria-label="Quantity">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-cream)] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to basket */}
              <button
                onClick={handleAddToBasket}
                className="w-full h-13 bg-[var(--color-obsidian)] text-[var(--color-parchment)] font-accent text-[11px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-charcoal)] transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none"
              >
                Add to Basket
              </button>
            </>
          )}

          {/* WhatsApp enquiry */}
          {enquiryLink && (
            <a
              href={enquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 flex items-center justify-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-accent text-[11px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-gold-muted)] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Enquiry via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
