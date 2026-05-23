import Link from 'next/link';
import type { ItemDisplay } from '@/lib/api/items';
import { ProductCard } from '@/components/shop/ProductCard';

interface FeaturedProductsProps {
  items: ItemDisplay[];
}

export function FeaturedProducts({ items }: FeaturedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[var(--color-bg)]" aria-labelledby="featured-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">The Edit</p>
            <h2 id="featured-heading" className="headline-lg text-[var(--color-text-primary)]">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] font-accent text-[11px] tracking-widest uppercase hover:text-[var(--color-gold)] hover:gap-4 transition-all duration-200 self-start md:self-auto"
          >
            View All
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {items.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
