# AGENT 01 — API Integration Agent

## Role
You are the **API Integration Specialist** for the Mensah luxury menswear platform. Your sole responsibility is to build, test, and guarantee every interaction between the frontend and the hackathon backend API. No API call in this project should exist outside of what you define here.

## Base Configuration

```typescript
// lib/api/config.ts
export const API_BASE = 'https://api-hackathon.codedematrixtech.com';
export const MERCHANT_SLUG = 'mensah';
export const TEAM_SLUG = 'mensah-solo'; // register this first via POST /teams
```

---

## Step 1 — Team Registration (One-Time Setup)

Before any other API work, register the team. This is a one-time action.

```typescript
// lib/api/team.ts
export async function registerTeam() {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: TEAM_SLUG,
      name: 'Mensah Solo',
      merchant_id: MERCHANT_SLUG,
      contact: 'mensah@example.com',
    }),
  });

  if (res.status === 409) {
    console.log('Team already registered — continuing.');
    return;
  }
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Team registration failed: ${err.message}`);
  }
  return res.json();
}
```

**When to call:** Run this once on project setup or guard it with a try/catch on first app load.

---

## Step 2 — Merchant Data

```typescript
// lib/api/merchant.ts
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
    next: { revalidate: 3600 }, // Cache 1 hour — merchant data rarely changes
  });
  if (!res.ok) throw new Error('Failed to load merchant data');
  return res.json();
}

// Helper: build full image URL from relative path
export function buildImageUrl(path: string | null): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}
```

---

## Step 3 — Items (Product Catalog)

```typescript
// lib/api/items.ts
import { API_BASE, MERCHANT_SLUG } from './config';
import { buildImageUrl } from './merchant';

export interface Item {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  price_minor: number;   // in pesewas
  currency: string;      // 'GHS'
  image_urls: string[] | null;
  in_stock: boolean;
}

export interface ItemDisplay extends Item {
  price_ghs: number;           // price_minor / 100
  primary_image: string;       // first image URL, full URL
}

export async function getItems(): Promise<ItemDisplay[]> {
  const res = await fetch(`${API_BASE}/merchants/${MERCHANT_SLUG}/items`, {
    next: { revalidate: 300 }, // Cache 5 min — stock can change
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

// Format price for display
export function formatPrice(price_minor: number, currency = 'GHS'): string {
  const amount = price_minor / 100;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
```

---

## Step 4 — Campaigns

```typescript
// lib/api/campaigns.ts
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
    featured_items: data.featured_items.map(item => ({
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
```

---

## Step 5 — Baskets (Checkout)

```typescript
// lib/api/baskets.ts
import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from './config';

export interface BasketItemInput {
  item_id: string;
  qty: number;
  item_note?: string;
}

export interface CreateBasketPayload {
  items: BasketItemInput[];
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
}

export interface BasketDetail {
  id: string;
  merchant: {
    id: string;
    name: string;
    whatsapp_number: string | null;
  } | null;
  items: {
    item_id: string;
    name: string;
    price_minor: number;
    currency: string;
    image_url: string | null;
    in_stock: boolean;
    qty: number;
    item_note: string | null;
  }[];
  total_minor: number;
  currency: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_note: string | null;
  team_slug: string | null;
  created_at: number;
}

export type BasketError =
  | 'items_unavailable'
  | 'items_wrong_merchant'
  | 'validation_error'
  | 'not_found'
  | 'unknown';

export interface BasketResult {
  success: boolean;
  basket_id?: string;
  error?: BasketError;
  message?: string;
}

export async function createBasket(payload: CreateBasketPayload): Promise<BasketResult> {
  try {
    const res = await fetch(`${API_BASE}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: MERCHANT_SLUG,
        team_slug: TEAM_SLUG,
        ...payload,
      }),
    });

    if (res.status === 201) {
      const data = await res.json();
      return { success: true, basket_id: data.id };
    }

    const err = await res.json();
    return {
      success: false,
      error: (err.error as BasketError) ?? 'unknown',
      message: err.message,
    };
  } catch {
    return { success: false, error: 'unknown', message: 'Network error. Please try again.' };
  }
}

export async function getBasket(id: string): Promise<BasketDetail> {
  const res = await fetch(`${API_BASE}/baskets/${id}`);
  if (!res.ok) throw new Error(`Basket ${id} not found`);
  return res.json();
}
```

---

## Step 6 — WhatsApp Deep-Link Builder

```typescript
// lib/whatsapp.ts
import { BasketDetail } from './api/baskets';
import { formatPrice } from './api/items';

export function buildWhatsAppLink(basket: BasketDetail): string {
  const whatsappNumber = basket.merchant?.whatsapp_number?.replace(/\D/g, '');
  if (!whatsappNumber) throw new Error('Merchant WhatsApp number unavailable');

  const lines: string[] = [
    `🛍️ *New Order — Mensah*`,
    `Order ID: ${basket.id}`,
    ``,
    `*Items:*`,
    ...basket.items.map(
      item =>
        `• ${item.name} × ${item.qty} — ${formatPrice(item.price_minor * item.qty, item.currency)}` +
        (item.item_note ? ` _(${item.item_note})_` : '')
    ),
    ``,
    `*Total: ${formatPrice(basket.total_minor, basket.currency ?? 'GHS')}*`,
    ``,
    `*Customer Details:*`,
    basket.customer_name ? `Name: ${basket.customer_name}` : '',
    basket.customer_phone ? `Phone: ${basket.customer_phone}` : '',
    basket.customer_note ? `Note: ${basket.customer_note}` : '',
  ].filter(Boolean);

  const message = lines.join('\n');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

// Fallback: copy order summary to clipboard if WhatsApp unavailable
export function buildOrderSummaryText(basket: BasketDetail): string {
  return [
    `New Order — Mensah`,
    `Order ID: ${basket.id}`,
    ``,
    `Items:`,
    ...basket.items.map(
      item => `${item.name} x${item.qty} — ${formatPrice(item.price_minor * item.qty, item.currency)}`
    ),
    ``,
    `Total: ${formatPrice(basket.total_minor, basket.currency ?? 'GHS')}`,
    basket.customer_name ? `Customer: ${basket.customer_name}` : '',
    basket.customer_phone ? `Phone: ${basket.customer_phone}` : '',
    basket.customer_note ? `Note: ${basket.customer_note}` : '',
  ].filter(Boolean).join('\n');
}
```

---

## Step 7 — Image Uploads (Admin)

```typescript
// lib/api/uploads.ts
import { API_BASE } from './config';

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('File exceeds 10MB limit');
  if (!file.type.startsWith('image/')) throw new Error('File must be an image');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (res.status === 413) throw new Error('Image too large (max 10MB)');
  if (res.status === 422) throw new Error('Invalid file type');
  if (!res.ok) throw new Error('Upload failed');

  const data = await res.json();
  return data.url; // relative URL — prepend API_BASE when displaying
}

export async function rehostImage(sourceUrl: string): Promise<string> {
  const res = await fetch(`${API_BASE}/uploads/rehost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_url: sourceUrl }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Rehost failed');
  }
  const data = await res.json();
  return data.url;
}
```

---

## Error Handling Reference

| API Error Code | User-Facing Message |
|---|---|
| `not_found` | "This item is no longer available." |
| `items_unavailable` | "Some items in your basket are out of stock. Please review your selection." |
| `items_wrong_merchant` | "There was an issue with your order. Please contact support." |
| `validation_error` | "Please check your details and try again." |
| `team_slug_taken` | (Admin only) "Team already registered." |
| `file_too_large` | "Image must be under 10MB." |
| `invalid_file_type` | "Please upload a JPG, PNG, or WebP image." |
| Network failure | "Connection failed. Please check your internet and try again." |
| 503 | "Our service is temporarily unavailable. Please try again in a moment." |

---

## Testing Checklist for This Agent

- [ ] `GET /merchants/mensah` returns correct merchant data
- [ ] `GET /merchants/mensah/items` returns all 20 items with correct prices
- [ ] `buildImageUrl()` correctly prepends base URL to relative paths
- [ ] `formatPrice(85000)` returns "GH₵ 850.00"
- [ ] `POST /baskets` with valid items returns basket ID
- [ ] `POST /baskets` with out-of-stock item returns `items_unavailable` error
- [ ] `POST /baskets` with empty items array is blocked client-side before API call
- [ ] `GET /baskets/{id}` returns full basket with merchant WhatsApp number
- [ ] `buildWhatsAppLink()` produces valid `wa.me` URL with encoded message
- [ ] `GET /merchants/mensah/campaigns` returns campaign list
- [ ] `POST /campaigns` (admin) creates campaign and returns ID
- [ ] `POST /uploads` with valid image returns relative URL
- [ ] `POST /uploads` with file > 10MB is blocked client-side before API call
- [ ] All error codes map to user-friendly messages
- [ ] No raw API errors are ever shown to the user
