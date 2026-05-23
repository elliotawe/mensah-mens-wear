import Image from 'next/image';
import Link from 'next/link';
import type { CampaignDetail as CampaignDetailType } from '@/lib/api/campaigns';
import { formatPrice } from '@/lib/api/items';
import { Badge } from '@/components/ui/Badge';

interface CampaignDetailProps {
  campaign: CampaignDetailType;
}

export function CampaignDetail({ campaign }: CampaignDetailProps) {
  const imageUrl = campaign.image_urls?.[0];

  return (
    <article>
      {/* Hero image */}
      {imageUrl && (
        <div className="relative w-full aspect-[21/9] bg-[var(--color-charcoal)]">
          <Image
            src={imageUrl}
            alt={campaign.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 font-body text-xs text-[var(--color-text-muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/campaigns" className="hover:text-[var(--color-gold)] transition-colors">Campaigns</Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)]" aria-current="page">{campaign.title}</span>
        </nav>

        {/* Title block */}
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-5">Campaign</p>
          <span className="gold-rule mb-8 block" aria-hidden="true" />
          <h1 className="headline-lg text-[var(--color-text-primary)] mb-6">{campaign.title}</h1>
          {campaign.copy_text && (
            <p className="font-body text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {campaign.copy_text}
            </p>
          )}
        </div>

        {/* Featured items */}
        {campaign.featured_items && campaign.featured_items.length > 0 && (
          <section aria-labelledby="featured-items-heading">
            <div className="border-t border-[var(--color-border)] pt-12 mb-10">
              <p className="eyebrow mb-3">From this Collection</p>
              <h2 id="featured-items-heading" className="headline-lg text-[var(--color-text-primary)]">
                Featured Pieces
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-12">
              {campaign.featured_items.map(item => (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden bg-[var(--color-cream)]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-400"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--color-cream)]" aria-hidden="true" />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={item.in_stock ? 'in-stock' : 'out-of-stock'}>
                        {item.in_stock ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="product-name-link font-body text-sm text-[var(--color-text-primary)] leading-snug">
                      {item.name}
                    </p>
                    <p className="font-accent text-sm font-500 text-[var(--color-gold)] mt-1">
                      {formatPrice(item.price_minor, item.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-accent text-[11px] tracking-widest uppercase px-8 h-11 rounded-[6px] hover:bg-[var(--color-gold-muted)] transition-colors duration-200"
            >
              Shop the Full Collection
            </Link>
          </section>
        )}
      </div>
    </article>
  );
}
