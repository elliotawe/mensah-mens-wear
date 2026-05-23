import { Suspense } from 'react';
import { getItems } from '@/lib/api/items';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Collection',
  description: 'Browse the full Mensah luxury menswear collection. Bespoke tailored suits, agbadas, and more — made in Ghana.',
};

async function ShopContent() {
  const items = await getItems();
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-body text-sm text-[var(--color-text-muted)]">
            {items.length} piece{items.length !== 1 ? 's' : ''} in the collection
          </p>
        </div>
      </div>
      <ProductGrid items={items} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page hero bar */}
      <div className="bg-[var(--color-obsidian)] pt-16 pb-12 mb-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <p className="eyebrow mb-4">Mensah</p>
          <h1 className="headline-lg text-[var(--color-parchment)]">The Collection</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Suspense fallback={<SkeletonGrid count={12} />}>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
