import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from './config';
import { buildImageUrl } from './merchant';

export interface CampaignSummary {
  id: string;
  title: string;
  copy_text: string | null;
  image_urls: string[] | null;
  team_slug: string | null;
  created_at: number;
}

export interface CampaignDetail extends CampaignSummary {
  merchant: { id: string; name: string; whatsapp_number: string | null } | null;
  featured_items: {
    id: string;
    name: string;
    price_minor: number;
    currency: string;
    image_url: string | null;
    in_stock: boolean;
  }[];
}

export async function getCampaigns(): Promise<CampaignSummary[]> {
  const res = await fetch(
    `${API_BASE}/merchants/${MERCHANT_SLUG}/campaigns?team_slug=${TEAM_SLUG}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error('Failed to load campaigns');
  const campaigns: CampaignSummary[] = await res.json();
  return campaigns.map(c => ({
    ...c,
    image_urls: c.image_urls?.map(buildImageUrl) ?? [],
  }));
}

export async function getCampaign(id: string): Promise<CampaignDetail> {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Campaign ${id} not found`);
  const data: CampaignDetail = await res.json();
  return {
    ...data,
    image_urls: data.image_urls?.map(buildImageUrl) ?? [],
    featured_items: (data.featured_items ?? []).map(item => ({
      ...item,
      image_url: buildImageUrl(item.image_url),
    })),
  };
}

export interface CreateCampaignPayload {
  title: string;
  copy_text?: string;
  image_urls?: string[];
  featured_item_ids?: string[];
}

export async function createCampaign(payload: CreateCampaignPayload) {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: MERCHANT_SLUG,
      team_slug: TEAM_SLUG,
      ...payload,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Failed to create campaign');
  }
  return res.json() as Promise<{ id: string }>;
}
