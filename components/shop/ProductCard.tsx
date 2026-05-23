'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ItemDisplay } from '@/lib/api/items';
import { formatPrice } from '@/lib/api/items';
import { Badge } from '@/components/ui/Badge';
import { useBasketContext } from '@/context/BasketContext';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  item: ItemDisplay;
}

export function ProductCard({ item }: ProductCardProps) {
  const { addItem, openDrawer } = useBasketContext();
  const toast = useToast();

  function handleAddToBasket(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!item.in_stock) return;
    addItem(item, 1);
    toast.success(`${item.name} added to basket`);
    openDrawer();
  }

  return (
    <article className="group relative flex flex-col" aria-label={item.name}>
      <Link href={`/shop/${item.id}`} className="flex flex-col gap-3 cursor-pointer">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[var(--color-cream)]">
          <Image
            src={item.primary_image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />

          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={item.in_stock ? 'in-stock' : 'out-of-stock'}>
              {item.in_stock ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          {/* Add to cart — slides up on hover (desktop), always visible on mobile */}
          {item.in_stock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToBasket}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-obsidian)]/90 backdrop-blur-sm text-[var(--color-parchment)] font-accent text-[10px] tracking-widest uppercase py-3 hover:bg-[var(--color-obsidian)] transition-colors cursor-pointer"
                aria-label={`Add ${item.name} to basket`}
              >
                <ShoppingBag className="size-3.5" aria-hidden="true" />
                Add to Basket
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <h3 className="product-name-link font-body text-sm text-[var(--color-text-primary)] leading-snug">
            {item.name}
          </h3>
          <p className="font-accent text-sm font-500 text-[var(--color-gold)]">
            {formatPrice(item.price_minor, item.currency)}
          </p>
        </div>
      </Link>

      {/* Mobile add to basket */}
      {item.in_stock && (
        <button
          onClick={handleAddToBasket}
          className="md:hidden mt-2 w-full flex items-center justify-center gap-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-accent text-[10px] tracking-widest uppercase py-2.5 rounded-[4px] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
          aria-label={`Add ${item.name} to basket`}
        >
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          Add to Basket
        </button>
      )}
    </article>
  );
}
