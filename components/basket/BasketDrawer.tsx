'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useBasketContext } from '@/context/BasketContext';
import { BasketItem } from './BasketItem';
import { BasketSummary } from './BasketSummary';
import { cn } from '@/lib/utils';

export function BasketDrawer() {
  const { items, isOpen, totalItems, totalPrice, closeDrawer } = useBasketContext();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus + Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';

    // Focus drawer
    drawerRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-[var(--color-obsidian)]/60 backdrop-blur-sm transition-opacity duration-400',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 40 }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-[var(--color-ivory)] flex flex-col transition-transform duration-400 shadow-[var(--shadow-elevated)] outline-none',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ zIndex: 40 }}
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl font-300 text-[var(--color-text-primary)]">
            Your Selection
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 -mr-2 text-[var(--color-taupe)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            aria-label="Close basket"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {totalItems === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="size-12 text-[var(--color-taupe)] mb-5" aria-hidden="true" />
              <h3 className="font-display text-xl font-300 text-[var(--color-text-primary)] mb-2">
                Your basket awaits
              </h3>
              <p className="font-body text-sm text-[var(--color-text-muted)] mb-8 max-w-xs">
                Add pieces from our collection to begin your order.
              </p>
              <button
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-accent text-[10px] tracking-widest uppercase px-7 h-10 rounded-[6px] hover:bg-[var(--color-gold-muted)] transition-colors duration-200 cursor-pointer"
              >
                Explore the Collection
              </button>
            </div>
          ) : (
            <div>
              {items.map(basketItem => (
                <BasketItem key={basketItem.item.id} basketItem={basketItem} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="px-6 py-6 border-t border-[var(--color-border)] flex flex-col gap-4 bg-[var(--color-ivory)]">
            <BasketSummary totalPrice={totalPrice} />

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center h-12 bg-[var(--color-obsidian)] text-[var(--color-parchment)] font-accent text-[11px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-charcoal)] transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={closeDrawer}
              className="text-center font-body text-xs text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
