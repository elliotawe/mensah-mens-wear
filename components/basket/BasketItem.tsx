'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import type { BasketItem as BasketItemType } from '@/context/BasketContext';
import { formatPrice } from '@/lib/api/items';
import { useBasketContext } from '@/context/BasketContext';

interface BasketItemProps {
  basketItem: BasketItemType;
}

export function BasketItem({ basketItem }: BasketItemProps) {
  const { updateQty, removeItem } = useBasketContext();
  const { item, qty, item_note } = basketItem;

  return (
    <div className="flex gap-4 py-5 border-b border-[var(--color-border)] last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-20 flex-shrink-0 rounded-[4px] overflow-hidden bg-[var(--color-cream)]">
        <Image
          src={item.primary_image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-body text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2">
            {item.name}
          </p>
          <button
            onClick={() => removeItem(item.id)}
            className="text-[var(--color-taupe)] hover:text-[var(--color-error)] transition-colors cursor-pointer flex-shrink-0 mt-0.5"
            aria-label={`Remove ${item.name} from basket`}
          >
            <X className="size-3.5" />
          </button>
        </div>

        <p className="font-accent text-sm font-500 text-[var(--color-gold)]">
          {formatPrice(item.price_minor * qty, item.currency)}
        </p>

        {item_note && (
          <p className="font-body text-xs text-[var(--color-text-muted)] italic line-clamp-1">
            {item_note}
          </p>
        )}

        {/* Qty stepper */}
        <div className="flex items-center gap-0 border border-[var(--color-border)] rounded-[4px] w-fit mt-1">
          <button
            onClick={() => updateQty(item.id, qty - 1)}
            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-cream)] transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 text-center font-accent text-xs" aria-live="polite">{qty}</span>
          <button
            onClick={() => updateQty(item.id, qty + 1)}
            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-cream)] transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
