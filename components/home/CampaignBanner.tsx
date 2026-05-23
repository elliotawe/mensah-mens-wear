import Link from 'next/link';
import Image from 'next/image';
import type { CampaignSummary } from '@/lib/api/campaigns';

interface CampaignBannerProps {
  campaign: CampaignSummary;
}

export function CampaignBanner({ campaign }: CampaignBannerProps) {
  const imageUrl = campaign.image_urls?.[0];

  return (
    <section className="relative bg-[var(--color-charcoal)] overflow-hidden" aria-label={`Campaign: ${campaign.title}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Image */}
          {imageUrl && (
            <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-[8px] overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Featured Campaign</p>
            <span className="gold-rule" aria-hidden="true" />
            <h2 className="font-display text-3xl md:text-4xl font-300 text-[var(--color-parchment)] leading-tight">
              {campaign.title}
            </h2>
            {campaign.copy_text && (
              <p className="font-body text-sm text-[var(--color-taupe)] leading-relaxed max-w-md line-clamp-3">
                {campaign.copy_text}
              </p>
            )}
            <Link
              href={`/campaigns/${campaign.id}`}
              className="inline-flex items-center gap-2 text-[var(--color-gold)] font-accent text-[11px] font-500 tracking-widest uppercase hover:gap-4 transition-all duration-200 mt-2 self-start"
            >
              View Campaign
              <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
