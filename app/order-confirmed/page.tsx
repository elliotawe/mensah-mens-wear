'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmedPage() {
  const [basketId, setBasketId] = useState<string | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);

  useEffect(() => {
    setBasketId(sessionStorage.getItem('mensah_last_basket_id'));
    setWaLink(sessionStorage.getItem('mensah_last_wa_link'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] pt-16 px-6">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
        {/* Animated checkmark */}
        <div className="relative">
          <div className="size-20 rounded-full bg-[var(--color-gold-muted)] flex items-center justify-center animate-fade-up">
            <CheckCircle className="size-10 text-[var(--color-gold)]" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col gap-3 animate-fade-up animate-delay-1">
          <h1 className="font-display text-4xl md:text-5xl font-300 text-[var(--color-text-primary)]">
            Order Sent!
          </h1>
          <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
            Your order has been sent to Mensah on WhatsApp. Our team will confirm your order shortly.
          </p>
        </div>

        {basketId && (
          <div
            className="w-full p-4 bg-[var(--color-cream)] rounded-[6px] border border-[var(--color-border)] animate-fade-up animate-delay-2"
          >
            <p className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">
              Order Reference
            </p>
            <p className="font-accent text-sm text-[var(--color-text-primary)]">{basketId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full animate-fade-up animate-delay-3">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-accent text-[11px] tracking-widest uppercase h-11 rounded-[6px] hover:bg-[var(--color-gold-muted)] transition-colors duration-200"
            >
              View on WhatsApp
            </a>
          )}
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-obsidian)] text-[var(--color-parchment)] font-accent text-[11px] tracking-widest uppercase h-11 rounded-[6px] hover:bg-[var(--color-charcoal)] transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
