import { formatPrice } from '@/lib/api/items';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price_minor: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({
  price_minor,
  currency = 'GHS',
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <span
      className={cn(
        'font-accent font-500 text-[var(--color-gold)] tracking-tight',
        sizes[size],
        className
      )}
    >
      {formatPrice(price_minor, currency)}
    </span>
  );
}
