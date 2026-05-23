import { API_BASE, MERCHANT_SLUG } from './config';

export interface Merchant {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  brand_colors: string[] | null;
  whatsapp_number: string | null;
}

export async function getMerchant(): Promise<Merchant> {
  const res = await fetch(`${API_BASE}/merchants/${MERCHANT_SLUG}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to load merchant data');
  return res.json();
}

export function buildImageUrl(path: string | null): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}
