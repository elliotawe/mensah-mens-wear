'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBasketContext } from '@/context/BasketContext';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/campaigns', label: 'Campaigns' },
];

export function Header() {
  const { totalItems, openDrawer } = useBasketContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-(--z-sticky) transition-all duration-400',
          scrolled
            ? 'bg-obsidian shadow-[0_1px_0_rgba(201,168,76,0.15)]'
            : 'bg-transparent'
        )}
        style={{ zIndex: 30 }}
      >
        <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0" aria-label="Mensah — Home">
            <Image
              src="/mensah_logo.png"
              alt="Mensah"
              width={120}
              height={32}
              className={cn(
                'h-7 w-auto transition-all duration-300',
                scrolled ? 'brightness-0 invert' : 'brightness-0 invert'
              )}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-accent text-[11px] font-500 tracking-widest uppercase text-[var(--color-parchment)]/70 hover:text-[var(--color-gold)] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={openDrawer}
              className="relative p-2 text-[var(--color-parchment)]/70 hover:text-[var(--color-gold)] transition-colors cursor-pointer"
              aria-label={`Open basket${totalItems > 0 ? `, ${totalItems} item${totalItems > 1 ? 's' : ''}` : ''}`}
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center bg-[var(--color-gold)] text-[var(--color-obsidian)] text-[9px] font-accent font-600 rounded-full leading-none"
                  aria-hidden="true"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[var(--color-parchment)]/70 hover:text-[var(--color-gold)] transition-colors cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        totalItems={totalItems}
        onBasketClick={() => { setMobileOpen(false); openDrawer(); }}
      />
    </>
  );
}
