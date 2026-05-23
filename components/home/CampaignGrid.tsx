import Link from 'next/link';
import Image from 'next/image';
import type { CampaignSummary } from '@/lib/api/campaigns';
import { buildImageUrl } from '@/lib/api/merchant';

interface CampaignGridProps {
  campaigns: CampaignSummary[];
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  if (campaigns.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[var(--color-bg-alt)]" aria-labelledby="campaigns-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">Campaigns</p>
            <h2 id="campaigns-heading" className="headline-lg text-[var(--color-text-primary)]">
              The Collections
            </h2>
          </div>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] font-accent text-[11px] tracking-widest uppercase hover:text-[var(--color-gold)] hover:gap-4 transition-all duration-200 self-start md:self-auto"
          >
            View All
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.slice(0, 6).map(campaign => {
            const imageUrl = campaign.image_urls?.[0] ? buildImageUrl(campaign.image_urls[0]) : null;
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group relative bg-[var(--color-charcoal)] rounded-[8px] overflow-hidden aspect-[4/3] flex flex-col justify-end hover:shadow-[var(--shadow-hover)] transition-shadow duration-300 cursor-pointer"
              >
                {/* Background image */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, var(--color-charcoal), var(--color-slate))' }}
                    aria-hidden="true"
                  />
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10 p-6">
                  <h3 className="font-display text-xl font-300 text-[var(--color-parchment)] leading-snug">
                    {campaign.title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-gold)] font-accent text-[10px] tracking-widest uppercase mt-2 group-hover:gap-3 transition-all duration-200">
                    View
                    <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
