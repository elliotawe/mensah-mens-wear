import { API_BASE, MERCHANT_SLUG } from './config';
import { buildImageUrl } from './merchant';

export interface Item {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  price_minor: number;
  currency: string;
  image_urls: string[] | null;
  in_stock: boolean;
}

export interface ItemDisplay extends Item {
  price_ghs: number;
  primary_image: string;
}

export async function getItems(): Promise<ItemDisplay[]> {
  const res = await fetch(`${API_BASE}/merchants/${MERCHANT_SLUG}/items`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to load products');
  const items: Item[] = await res.json();
  return items.map(normalizeItem);
}

export async function getItem(id: string): Promise<ItemDisplay> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Item ${id} not found`);
  const item: Item = await res.json();
  return normalizeItem(item);
}

function normalizeItem(item: Item): ItemDisplay {
  return {
    ...item,
    price_ghs: item.price_minor / 100,
    primary_image: buildImageUrl(item.image_urls?.[0] ?? null),
    image_urls: item.image_urls?.map(buildImageUrl) ?? [],
  };
}

export function formatPrice(price_minor: number, currency = 'GHS'): string {
  const amount = price_minor / 100;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
