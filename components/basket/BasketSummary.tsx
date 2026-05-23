import { formatPrice } from '@/lib/api/items';

interface BasketSummaryProps {
  totalPrice: number;
  currency?: string;
}

export function BasketSummary({ totalPrice, currency = 'GHS' }: BasketSummaryProps) {
  return (
    <div className="border-t border-[var(--color-border)] pt-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-[var(--color-text-secondary)]">Subtotal</p>
        <p className="font-accent text-lg font-500 text-[var(--color-text-primary)]">
          {formatPrice(totalPrice, currency)}
        </p>
      </div>
      <p className="font-body text-xs text-[var(--color-text-muted)] mt-1.5">
        Final price confirmed on WhatsApp checkout
      </p>
    </div>
  );
}
