'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getCampaigns } from '@/lib/api/campaigns';
import type { CampaignSummary } from '@/lib/api/campaigns';
import { Plus, ExternalLink } from 'lucide-react';

export default function AdminCampaignsPage() {
  useAdminAuth();

  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Content</p>
            <h1 className="font-display text-3xl font-300 text-[var(--color-parchment)]">Campaigns</h1>
          </div>
          <Link
            href="/admin/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[10px] tracking-widest uppercase px-6 h-10 rounded-[4px] hover:bg-[var(--color-gold-light)] transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New Campaign
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="aspect-[4/3] skeleton rounded-[8px]" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div
            className="rounded-[8px] p-16 text-center"
            style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="font-display text-xl font-300 text-[var(--color-parchment)] mb-2">No campaigns yet</p>
            <p className="font-body text-sm text-[var(--color-taupe)] mb-6">
              Create your first campaign to promote the Mensah collection.
            </p>
            <Link
              href="/admin/dashboard/campaigns/new"
              className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[10px] tracking-widest uppercase px-6 h-10 rounded-[4px] hover:bg-[var(--color-gold-light)] transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => {
              const img = campaign.image_urls?.[0];
              return (
                <div
                  key={campaign.id}
                  className="rounded-[8px] overflow-hidden flex flex-col"
                  style={{ background: 'var(--color-charcoal)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="relative aspect-[4/3] bg-[var(--color-slate)]">
                    {img ? (
                      <Image src={img} alt={campaign.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-accent text-[9px] tracking-widest uppercase text-[var(--color-taupe)]">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-display text-lg font-300 text-[var(--color-parchment)] leading-snug">
                      {campaign.title}
                    </h3>
                    <p className="font-body text-xs text-[var(--color-taupe)]">
                      {new Date(campaign.created_at * 1000).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <div className="mt-auto pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <a
                        href={`/campaigns/${campaign.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-accent text-[10px] tracking-wider uppercase text-[var(--color-gold)] hover:underline"
                      >
                        <ExternalLink className="size-3" aria-hidden="true" />
                        View on Store
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
