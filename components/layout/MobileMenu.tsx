'use client';

import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  totalItems: number;
  onBasketClick: () => void;
}

export function MobileMenu({ isOpen, onClose, links, totalItems, onBasketClick }: MobileMenuProps) {
  // Trap focus + close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-modal)] transition-all duration-400',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      style={{ zIndex: 50 }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-[var(--color-obsidian)] transition-opacity duration-400',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col px-8 pt-16 pb-12 transition-transform duration-400',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 p-2 text-[var(--color-taupe)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="size-6" />
        </button>

        {/* Gold rule */}
        <span className="gold-rule mb-10" aria-hidden="true" />

        {/* Nav links */}
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-6">
            {links.map((link, i) => (
              <li
                key={link.href}
                className={cn('animate-fade-up', `animate-delay-${i + 1}`)}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-display text-4xl font-300 text-[var(--color-parchment)] hover:text-[var(--color-gold)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Basket */}
        <div className={cn('mt-auto animate-fade-up animate-delay-4')}>
          <button
            onClick={onBasketClick}
            className="flex items-center gap-3 text-[var(--color-taupe)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
          >
            <ShoppingBag className="size-5" />
            <span className="font-body text-sm">
              Basket {totalItems > 0 && `(${totalItems})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
