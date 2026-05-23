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
