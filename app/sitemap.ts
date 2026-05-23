import type { MetadataRoute } from 'next';
import { getItems } from '@/lib/api/items';
import { getCampaigns } from '@/lib/api/campaigns';

const BASE = 'https://mensah.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/campaigns`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  let itemRoutes: MetadataRoute.Sitemap = [];
  let campaignRoutes: MetadataRoute.Sitemap = [];

  try {
    const items = await getItems();
    itemRoutes = items.map(item => ({
      url: `${BASE}/shop/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch { /* fail silently */ }

  try {
    const campaigns = await getCampaigns();
    campaignRoutes = campaigns.map(campaign => ({
      url: `${BASE}/campaigns/${campaign.id}`,
      lastModified: new Date(campaign.created_at * 1000),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch { /* fail silently */ }

  return [...staticRoutes, ...itemRoutes, ...campaignRoutes];
}
