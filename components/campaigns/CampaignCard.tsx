import Link from 'next/link';
import Image from 'next/image';
import type { CampaignSummary } from '@/lib/api/campaigns';

interface CampaignCardProps {
  campaign: CampaignSummary;
  variant?: 'hero' | 'card';
}

export function CampaignCard({ campaign, variant = 'card' }: CampaignCardProps) {
  const imageUrl = campaign.image_urls?.[0];

  if (variant === 'hero') {
    return (
      <Link
        href={`/campaigns/${campaign.id}`}
        className="group relative block w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[8px] bg-[var(--color-charcoal)] cursor-pointer"
        aria-label={`View campaign: ${campaign.title}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={campaign.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2C1F00)' }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <p className="eyebrow mb-3">Featured Collection</p>
          <h2 className="font-display text-3xl md:text-5xl font-300 text-[var(--color-parchment)] leading-tight mb-4 max-w-xl">
            {campaign.title}
          </h2>
          {campaign.copy_text && (
            <p className="font-body text-sm text-[var(--color-parchment)]/70 max-w-md line-clamp-2 mb-6">
              {campaign.copy_text}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-accent text-[11px] tracking-widest uppercase group-hover:gap-4 transition-all duration-200">
            View Collection
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group flex flex-col md:flex-row gap-8 items-start cursor-pointer"
      aria-label={`View campaign: ${campaign.title}`}
    >
      <div className="relative w-full md:w-2/5 aspect-[4/3] rounded-[6px] overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={campaign.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, var(--color-cream), var(--color-bg-alt))' }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 py-4">
        <p className="eyebrow">Campaign</p>
        <h2 className="font-display text-2xl md:text-3xl font-300 text-[var(--color-text-primary)] leading-tight">
          {campaign.title}
        </h2>
        {campaign.copy_text && (
          <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md line-clamp-3">
            {campaign.copy_text}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-accent text-[11px] tracking-widest uppercase group-hover:gap-4 transition-all duration-200 mt-2">
          View Collection
          <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
