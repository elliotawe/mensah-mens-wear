import { Suspense } from 'react';
import { getCampaigns } from '@/lib/api/campaigns';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { Skeleton } from '@/components/ui/SkeletonCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Explore Mensah marketing campaigns and seasonal collections. Discover curated menswear edits.',
};

async function CampaignsContent() {
  const campaigns = await getCampaigns();

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow mb-4">Coming Soon</p>
        <h2 className="headline-lg text-[var(--color-text-primary)] mb-4">No Campaigns Yet</h2>
        <p className="font-body text-sm text-[var(--color-text-muted)] max-w-sm">
          Our next editorial collection is being crafted. Check back soon.
        </p>
      </div>
    );
  }

  const [first, ...rest] = campaigns;

  return (
    <div className="flex flex-col gap-20">
      {/* Hero campaign */}
      <CampaignCard campaign={first} variant="hero" />

      {/* Remaining — alternating layout */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-16">
          {rest.map((campaign, i) => (
            <div key={campaign.id} className={i % 2 === 1 ? 'md:[&>a]:flex-row-reverse' : ''}>
              <CampaignCard campaign={campaign} variant="card" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignsSkeleton() {
  return (
    <div className="flex flex-col gap-16">
      <Skeleton className="w-full aspect-[21/9] rounded-[8px]" />
      <div className="flex gap-8">
        <Skeleton className="w-2/5 aspect-[4/3] rounded-[6px]" />
        <div className="flex flex-col gap-4 flex-1 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="bg-[var(--color-obsidian)] pt-16 pb-12 mb-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <p className="eyebrow mb-4">Editorial</p>
          <h1 className="headline-lg text-[var(--color-parchment)]">The Collections</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Suspense fallback={<CampaignsSkeleton />}>
          <CampaignsContent />
        </Suspense>
      </div>
    </div>
  );
}
