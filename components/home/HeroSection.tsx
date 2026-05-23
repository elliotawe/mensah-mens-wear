'use client';

import Link from 'next/link';
import type { Merchant } from '@/lib/api/merchant';

interface HeroSectionProps {
  merchant: Merchant;
}

export function HeroSection({ merchant: _merchant }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1408 60%, #2C1F00 100%)',
      }}
      aria-label="Mensah hero"
    >
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Gold accent line — top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="eyebrow animate-fade-up animate-delay-1 mb-6">
          The Mensah Collection
        </p>

        {/* Gold rule */}
        <span className="gold-rule mx-auto animate-fade-up animate-delay-2 mb-8" aria-hidden="true" />

        {/* Headline */}
        <h1
          className="headline-xl text-[var(--color-parchment)] animate-fade-up animate-delay-3"
          style={{ fontStyle: 'italic', fontWeight: 300 }}
        >
          Crafted for the
          <br />
          <span style={{ color: 'var(--color-parchment)', opacity: 0.9 }}>Discerning Man</span>
        </h1>

        {/* Subline */}
        <p className="font-body text-sm md:text-base text-[var(--color-taupe)] mt-6 mb-10 max-w-sm leading-relaxed animate-fade-up animate-delay-4">
          Luxury tailored menswear, made in Ghana
        </p>

        {/* CTA */}
        <div className="animate-fade-up animate-delay-5">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-accent text-[11px] font-500 tracking-widest uppercase px-10 h-12 rounded-[6px] hover:bg-[var(--color-gold-muted)] transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            Explore the Collection
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)]">Scroll</span>
        <div className="w-px h-12 overflow-hidden">
          <div className="w-px h-full bg-[var(--color-gold)] scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
