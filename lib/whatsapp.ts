import type { BasketDetail } from './api/baskets';
import { formatPrice } from './api/items';

export function buildWhatsAppLink(basket: BasketDetail): string {
  const whatsappNumber = "+233551694847"; // Replace with actual merchant WhatsApp number
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
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

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

export const BASKET_ERROR_MESSAGES: Record<string, string> = {
  items_unavailable: 'Some items in your basket are out of stock. Please review your selection.',
  items_wrong_merchant: 'There was an issue with your order. Please contact support.',
  validation_error: 'Please check your details and try again.',
  not_found: 'This item is no longer available.',
  unknown: 'Connection failed. Please check your internet and try again.',
};
