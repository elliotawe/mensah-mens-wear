import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'in-stock' | 'out-of-stock' | 'gold' | 'neutral';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', className, children }: BadgeProps) {
  const variants = {
    'in-stock': 'bg-[var(--color-success)] text-white',
    'out-of-stock': 'bg-[var(--color-error)] text-white',
    gold: 'bg-[var(--color-gold-muted)] text-[var(--color-gold)] border border-[var(--color-gold)]/30',
    neutral: 'bg-[var(--color-cream)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[10px] font-accent font-600 tracking-wider uppercase rounded-[4px]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
