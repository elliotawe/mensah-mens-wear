'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Merchant } from '@/lib/api/merchant';
import type { ItemDisplay } from '@/lib/api/items';
import { formatPrice } from '@/lib/api/items';
import { buildImageUrl } from '@/lib/api/merchant';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORIES = ['All Pieces', 'Suits', 'Blazers', 'Accessories'];

interface HeroSectionProps {
  merchant: Merchant;
  featuredItems?: ItemDisplay[];
}

export function HeroSection({ merchant: _merchant, featuredItems = [] }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(0);

  useGSAP(() => {
    // Staggered entrance — left column
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.7 })
      .from(headlineRef.current?.querySelectorAll('.hero-line') ?? [], {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
      }, '-=0.4')
      .from(sublineRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
      .from(statsRef.current?.querySelectorAll('.stat-item') ?? [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
      }, '-=0.3');

    // Image clip-path reveal
    if (imageRef.current) {
      gsap.from(imageRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        delay: 0.2,
      });
    }

    // Product cards stagger entrance
    if (cardsRef.current) {
      gsap.from(cardsRef.current.querySelectorAll('.product-preview-card'), {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 1,
      });
    }

    // Parallax on scroll
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: '-8%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }
  }, { scope: containerRef });

  const previewItems = featuredItems.slice(0, 3);
  const heroImageSrc = featuredItems[0]?.image_urls?.[0]
    ? buildImageUrl(featuredItems[0].image_urls[0])
    : '/images/placeholder.jpg';

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: '#0A0A08' }}
      aria-label="Mensah hero"
    >
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Top gold rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
        aria-hidden="true"
      />

      {/* Main grid: left content + right image */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_46%] min-h-[100dvh]">

        {/* ── LEFT COLUMN ── */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-28 pb-16 lg:pt-32">

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="font-accent text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-8 flex items-center gap-3"
          >
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'var(--color-gold)' }}
              aria-hidden="true"
            />
            New Season — SS25
          </p>

          {/* Main headline */}
          <h1
            ref={headlineRef}
            className="font-display font-300 text-[var(--color-parchment)] leading-[0.95] mb-8"
            style={{
              fontSize: 'clamp(3.2rem, 7vw, 7rem)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="hero-line block">Luxury</span>
            <span className="hero-line block italic" style={{ color: 'var(--color-gold)', opacity: 0.9 }}>
              Tailored
            </span>
            <span className="hero-line block">Menswear</span>
          </h1>

          {/* Sub */}
          <p
            ref={sublineRef}
            className="font-body text-sm md:text-base text-[var(--color-taupe)] max-w-[320px] leading-relaxed mb-10"
          >
            Bespoke craftsmanship for the discerning Ghanaian gentleman. Each piece a statement.
          </p>

          {/* Category selector */}
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Browse by category">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className="font-accent text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: activeCategory === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
                  background: activeCategory === i ? 'var(--color-gold-muted)' : 'transparent',
                  color: activeCategory === i ? 'var(--color-gold)' : 'var(--color-taupe)',
                }}
                aria-pressed={activeCategory === i}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CTA group */}
          <div ref={ctaRef} className="flex items-center gap-5 mb-14">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[10px] tracking-[0.2em] uppercase px-8 h-12 rounded-[4px] hover:bg-[var(--color-gold-light)] transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              Shop Collection
            </Link>
            <Link
              href="/campaigns"
              className="font-accent text-[10px] tracking-[0.2em] uppercase text-[var(--color-taupe)] hover:text-[var(--color-parchment)] transition-colors duration-200 flex items-center gap-2 min-h-11"
            >
              View Campaigns
              <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Social proof stats */}
          <div ref={statsRef} className="flex items-center gap-8">
            <div className="stat-item">
              <p className="font-display text-2xl font-300 text-[var(--color-parchment)]">500+</p>
              <p className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)] mt-0.5">Pieces Crafted</p>
            </div>
            <div className="stat-item w-px h-8 bg-white/10" aria-hidden="true" />
            <div className="stat-item">
              <p className="font-display text-2xl font-300 text-[var(--color-parchment)]">10+</p>
              <p className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)] mt-0.5">Years Experience</p>
            </div>
            <div className="stat-item w-px h-8 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div className="stat-item hidden sm:block">
              <p className="font-display text-2xl font-300 text-[var(--color-parchment)]">GH</p>
              <p className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)] mt-0.5">Made in Ghana</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Full-height image ── */}
        <div
          ref={imageRef}
          className="relative hidden lg:block h-full min-h-[100dvh] overflow-hidden"
          style={{ clipPath: 'inset(0 0 0 0)', willChange: 'transform' }}
        >
          {/* Gradient left edge blend */}
          <div
            className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #0A0A08, transparent)' }}
            aria-hidden="true"
          />

          {/* Gradient bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(0deg, #0A0A08 0%, transparent 100%)' }}
            aria-hidden="true"
          />

          {/* Hero image */}
          <Image
            src={heroImageSrc}
            alt="Mensah luxury tailored menswear — SS25 collection"
            fill
            className="object-cover object-top"
            priority
            sizes="46vw"
          />

          {/* Collection badge — floating top right */}
          <div
            className="absolute top-12 right-8 z-20 px-4 py-2 rounded-[4px] backdrop-blur-sm"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            <p className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-gold)]">
              SS 2025
            </p>
          </div>
        </div>
      </div>

      {/* ── PRODUCT PREVIEW CARDS — bottom strip ── */}
      {previewItems.length > 0 && (
        <div
          ref={cardsRef}
          className="relative z-10 px-8 md:px-14 lg:px-20 pb-10 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-4 h-px"
              style={{ background: 'var(--color-gold)' }}
              aria-hidden="true"
            />
            <p className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)]">
              Featured Pieces
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {previewItems.map(item => (
              <Link
                key={item.id}
                href={`/shop/${item.id}`}
                className="product-preview-card group flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-[6px] border transition-all duration-200 hover:border-[var(--color-gold)]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-gold)]"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', minWidth: 220 }}
              >
                {item.image_urls?.[0] && (
                  <div className="relative w-10 h-12 flex-shrink-0 rounded-[3px] overflow-hidden" style={{ background: 'var(--color-charcoal)' }}>
                    <Image
                      src={buildImageUrl(item.image_urls[0])}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-body text-xs text-[var(--color-parchment)] truncate group-hover:text-[var(--color-gold)] transition-colors duration-200">
                    {item.name}
                  </p>
                  <p className="font-accent text-[10px] text-[var(--color-gold)] mt-0.5">
                    {formatPrice(item.price_minor, item.currency)}
                  </p>
                </div>
              </Link>
            ))}
            <Link
              href="/shop"
              className="product-preview-card flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-[6px] border transition-all duration-200 hover:border-[var(--color-gold)]/40 cursor-pointer"
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', minWidth: 120 }}
            >
              <span className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)] hover:text-[var(--color-gold)] transition-colors">
                View All →
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 lg:hidden"
        aria-hidden="true"
      >
        <span className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)]">Scroll</span>
        <div className="w-px h-10 overflow-hidden">
          <div className="w-px h-full bg-[var(--color-gold)] scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
