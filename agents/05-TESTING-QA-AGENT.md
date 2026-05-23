# AGENT 05 — Testing & QA Agent

## Role
You are the **Testing & QA Specialist** for the Mensah luxury menswear platform. You write and execute tests covering every feature, edge case, and error path. You are the last line of defense before submission. Nothing ships without passing your checklists.

---

## Testing Stack

```json
{
  "dependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0"
  }
}
```

**Mock Service Worker (MSW)** is used for all API mocking — no real API calls in tests.

---

## Mock API Setup (MSW)

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API = 'https://api-hackathon.codedematrixtech.com';

export const mockMerchant = {
  id: 'mensah',
  name: 'Mensah',
  description: 'Luxury tailored menswear',
  logo_url: '/images/mensah-logo.png',
  brand_colors: ['#C9A84C', '#0D0D0D'],
  whatsapp_number: '+233201234567',
};

export const mockItems = [
  {
    id: 'mensah-item-1',
    merchant_id: 'mensah',
    name: 'Classic Slim Suit',
    description: 'A perfectly tailored slim-fit suit.',
    price_minor: 250000,
    currency: 'GHS',
    image_urls: ['/images/suit-1.jpg'],
    in_stock: true,
  },
  {
    id: 'mensah-item-2',
    merchant_id: 'mensah',
    name: 'White Agbada',
    description: 'Ceremonial white agbada.',
    price_minor: 85000,
    currency: 'GHS',
    image_urls: ['/images/agbada-1.jpg'],
    in_stock: true,
  },
  {
    id: 'mensah-item-out',
    merchant_id: 'mensah',
    name: 'Sold Out Piece',
    description: null,
    price_minor: 120000,
    currency: 'GHS',
    image_urls: null,
    in_stock: false,
  },
];

export const mockCampaign = {
  id: 'campaign-1',
  title: 'Heritage Collection',
  copy_text: 'Limited-time pieces for the season.',
  image_urls: ['/images/campaign-1.jpg'],
  team_slug: 'mensah-solo',
  created_at: 1716400000,
};

export const mockBasket = {
  id: 'basket-123',
  merchant: { id: 'mensah', name: 'Mensah', whatsapp_number: '+233201234567' },
  items: [
    {
      item_id: 'mensah-item-1',
      name: 'Classic Slim Suit',
      price_minor: 250000,
      currency: 'GHS',
      image_url: '/images/suit-1.jpg',
      in_stock: true,
      qty: 1,
      item_note: 'Size 42',
    },
  ],
  total_minor: 250000,
  currency: 'GHS',
  customer_name: 'Kwame Asante',
  customer_phone: '+233201234567',
  customer_note: 'Need by Friday',
  team_slug: 'mensah-solo',
  created_at: 1716400000,
};

export const handlers = [
  http.get(`${API}/merchants/mensah`, () => HttpResponse.json(mockMerchant)),
  http.get(`${API}/merchants/mensah/items`, () => HttpResponse.json(mockItems)),
  http.get(`${API}/merchants/mensah/campaigns`, () => HttpResponse.json([mockCampaign])),
  http.get(`${API}/items/mensah-item-1`, () => HttpResponse.json(mockItems[0])),
  http.get(`${API}/items/mensah-item-out`, () => HttpResponse.json(mockItems[2])),
  http.get(`${API}/campaigns/campaign-1`, () =>
    HttpResponse.json({ ...mockCampaign, merchant: mockMerchant, featured_items: [mockItems[0]] })
  ),
  http.post(`${API}/baskets`, () => HttpResponse.json({ id: 'basket-123' }, { status: 201 })),
  http.get(`${API}/baskets/basket-123`, () => HttpResponse.json(mockBasket)),
  http.post(`${API}/campaigns`, () => HttpResponse.json({ id: 'new-campaign-1' }, { status: 201 })),
  http.post(`${API}/uploads`, () => HttpResponse.json({ url: '/uploads/test-image.jpg' }, { status: 201 })),
  http.get(`${API}/teams/mensah-solo`, () =>
    HttpResponse.json({
      slug: 'mensah-solo',
      name: 'Mensah Solo',
      merchant: mockMerchant,
      registered: true,
      baskets: [{ id: 'basket-123', merchant_id: 'mensah', total_minor: 250000, currency: 'GHS', created_at: 1716400000 }],
      campaigns: [{ id: 'campaign-1', merchant_id: 'mensah', title: 'Heritage Collection', created_at: 1716400000 }],
      created_at: 1716400000,
    })
  ),
];
```

---

## Unit Tests

### API Layer Tests

```typescript
// tests/unit/api.test.ts

describe('formatPrice', () => {
  it('converts pesewas to GHS correctly', () => {
    expect(formatPrice(85000)).toBe('GH₵ 850.00');
    expect(formatPrice(250000)).toBe('GH₵ 2,500.00');
    expect(formatPrice(100)).toBe('GH₵ 1.00');
    expect(formatPrice(0)).toBe('GH₵ 0.00');
  });
});

describe('buildImageUrl', () => {
  it('prepends API base to relative URLs', () => {
    expect(buildImageUrl('/images/suit.jpg'))
      .toBe('https://api-hackathon.codedematrixtech.com/images/suit.jpg');
  });
  it('returns absolute URLs unchanged', () => {
    const abs = 'https://example.com/image.jpg';
    expect(buildImageUrl(abs)).toBe(abs);
  });
  it('returns placeholder for null', () => {
    expect(buildImageUrl(null)).toBe('/images/placeholder.jpg');
  });
});

describe('buildWhatsAppLink', () => {
  it('builds valid wa.me URL', () => {
    const link = buildWhatsAppLink(mockBasket);
    expect(link).toMatch(/^https:\/\/wa\.me\/233201234567\?text=/);
  });
  it('encodes message correctly', () => {
    const link = buildWhatsAppLink(mockBasket);
    expect(link).toContain(encodeURIComponent('Mensah'));
    expect(link).toContain(encodeURIComponent('basket-123'));
  });
  it('throws if no whatsapp_number', () => {
    const basketNoWA = { ...mockBasket, merchant: { ...mockBasket.merchant, whatsapp_number: null } };
    expect(() => buildWhatsAppLink(basketNoWA)).toThrow();
  });
  it('strips non-digit chars from phone number', () => {
    const basketWeirdPhone = {
      ...mockBasket,
      merchant: { ...mockBasket.merchant, whatsapp_number: '+233 (20) 123-4567' }
    };
    const link = buildWhatsAppLink(basketWeirdPhone);
    expect(link).toMatch(/wa\.me\/233201234567/);
  });
});

describe('normalizeItem', () => {
  it('computes price_ghs from price_minor', () => {
    const item = normalizeItem(mockItems[0]);
    expect(item.price_ghs).toBe(2500.00);
  });
  it('sets primary_image from first image_url', () => {
    const item = normalizeItem(mockItems[0]);
    expect(item.primary_image).toContain('suit-1.jpg');
  });
  it('handles null image_urls gracefully', () => {
    const item = normalizeItem(mockItems[2]); // out of stock, null images
    expect(item.primary_image).toBe('/images/placeholder.jpg');
    expect(item.image_urls).toEqual([]);
  });
});
```

### Basket Context Tests

```typescript
// tests/unit/basket-context.test.tsx

describe('BasketContext', () => {
  it('adds item to empty basket', () => {
    // render with BasketProvider, call addItem, check state
  });
  it('increments qty when same item added twice', () => {
    // add item, add same item again, expect qty 2
  });
  it('removes item completely when qty reaches 0', () => {
    // add item qty 1, update to 0, expect empty basket
  });
  it('does not add out-of-stock item', () => {
    // attempt to add item with in_stock: false, expect no change
  });
  it('updates item note correctly', () => {
    // add item, update note, verify note stored
  });
  it('clears basket after clear action', () => {
    // add 3 items, dispatch clear, expect empty
  });
  it('computes totalItems correctly', () => {
    // add 2×item1 + 3×item2 → totalItems = 5
  });
  it('computes totalPrice correctly', () => {
    // add 1×250000 + 2×85000 → totalPrice = 420000
  });
});
```

---

## Integration Tests

### Checkout Flow

```typescript
// tests/integration/checkout.test.tsx

describe('Checkout Flow — Happy Path', () => {
  it('completes full checkout: add item → fill form → submit → WhatsApp link opens', async () => {
    // 1. Render product page with item
    // 2. Click "Add to Basket"
    // 3. Open basket drawer, verify item present
    // 4. Click "Proceed to Checkout"
    // 5. Fill name, phone, note
    // 6. Click "Send Order via WhatsApp"
    // 7. Verify POST /baskets called with correct payload
    // 8. Verify GET /baskets/basket-123 called
    // 9. Verify window.open called with wa.me URL
    // 10. Verify redirect to /order-confirmed
  });
});

describe('Checkout Flow — Error Paths', () => {
  it('shows validation error if name is empty on submit', async () => {
    // Fill phone, leave name empty
    // Click submit
    // Expect inline error: "Full name is required"
    // Expect POST /baskets NOT called
  });

  it('shows validation error if phone is empty on submit', async () => {
    // Fill name, leave phone empty
    // Click submit
    // Expect error: "Phone number is required"
  });

  it('shows toast if API returns items_unavailable', async () => {
    // Mock POST /baskets to return 422 items_unavailable
    // Submit valid form
    // Expect toast: "Some items in your basket are out of stock"
  });

  it('shows toast on network error', async () => {
    // Mock POST /baskets to throw network error
    // Submit form
    // Expect toast: "Connection failed. Please check your internet and try again."
  });

  it('redirects to /shop if basket is empty on checkout page load', async () => {
    // Render checkout page with empty basket
    // Expect redirect to /shop
  });
});
```

### Product Catalog

```typescript
// tests/integration/catalog.test.tsx

describe('Product Catalog', () => {
  it('displays all items from API', async () => {
    // Render shop page
    // Expect 3 product cards (from mockItems)
  });

  it('shows "Out of Stock" badge on unavailable items', async () => {
    // Find card for mensah-item-out
    // Expect badge text "Unavailable"
    // Expect Add to Cart button to be disabled
  });

  it('filters to in-stock only when filter applied', async () => {
    // Click "In Stock" filter
    // Expect only 2 cards visible (not the out-of-stock one)
  });

  it('shows skeleton cards while loading', async () => {
    // Add artificial delay to MSW handler
    // Render shop page
    // Expect skeleton cards visible before data arrives
  });

  it('shows error state if API fails', async () => {
    // Mock GET /items to return 503
    // Render shop page
    // Expect error message, not crash
  });
});
```

### Campaign Display

```typescript
// tests/integration/campaigns.test.tsx

describe('Campaign Display', () => {
  it('shows campaign banner on homepage', async () => {
    // Render homepage
    // Expect campaign title "Heritage Collection" visible
  });

  it('renders campaign detail with featured items', async () => {
    // Navigate to /campaigns/campaign-1
    // Expect campaign title
    // Expect featured item "Classic Slim Suit" visible
    // Expect price "GH₵ 2,500.00"
  });

  it('allows adding featured item to basket from campaign page', async () => {
    // Render campaign detail
    // Click "Add to Basket" on featured item
    // Expect basket count to increment
  });
});
```

---

## Edge Case Tests

```typescript
// tests/edge-cases.test.tsx

describe('Edge Cases', () => {
  // Images
  it('shows placeholder when product has no images', async () => {
    // Render ProductCard with item.image_urls = null
    // Expect fallback placeholder visible, no broken img
  });

  it('does not crash if image URL returns 404', async () => {
    // Mock image URL to 404
    // Render ProductCard
    // Expect fallback renders, no unhandled error
  });

  // Prices
  it('handles price of 0 without crashing', () => {
    expect(formatPrice(0)).toBe('GH₵ 0.00');
  });

  it('handles very large prices correctly', () => {
    expect(formatPrice(100000000)).toBe('GH₵ 1,000,000.00');
  });

  // Basket
  it('qty stepper cannot go below 1 on product page', async () => {
    // Render product detail
    // Click minus on stepper when qty is 1
    // Expect qty stays at 1
  });

  it('basket handles 20 different items without layout breaking', async () => {
    // Add all 20 mock items to basket
    // Open basket drawer
    // Expect no UI overflow or crash
  });

  // WhatsApp
  it('shows fallback copy-to-clipboard if WhatsApp link fails to open', async () => {
    // Mock window.open to throw
    // Complete checkout
    // Expect fallback "Copy order summary" UI visible
  });

  // Campaigns
  it('homepage renders gracefully if no campaigns exist', async () => {
    // Mock GET /campaigns to return []
    // Render homepage
    // Expect no crash, campaign section hidden or shows empty state
  });

  // API failures
  it('merchant API failure shows branded error page, not blank screen', async () => {
    // Mock GET /merchants/mensah to return 503
    // Render homepage
    // Expect Mensah-branded error page
    // Expect no white screen or unhandled error
  });

  // XSS prevention
  it('renders campaign copy_text as escaped text, not raw HTML', async () => {
    // Mock campaign with copy_text: '<script>alert("xss")</script>'
    // Render campaign detail
    // Expect text is visible as string, NOT executed
    // Expect no alert triggered
  });

  // Admin
  it('wrong admin password does not navigate', async () => {
    // Render /admin
    // Enter wrong password
    // Expect still on /admin, error message shown
  });

  it('admin dashboard without session redirects to /admin', async () => {
    // Clear sessionStorage
    // Navigate to /admin/dashboard directly
    // Expect redirect to /admin
  });

  // Phone number
  it('phone field with just prefix (+233) fails validation', async () => {
    // Render checkout
    // Leave phone as just the pre-filled prefix
    // Submit
    // Expect validation error
  });
});
```

---

## Manual QA Checklist (Pre-Submission)

### Visual QA
- [ ] Homepage looks premium on desktop (1440px width)
- [ ] Homepage looks premium on mobile (375px width — iPhone SE)
- [ ] Homepage looks premium on tablet (768px width — iPad)
- [ ] No text overflow anywhere on any screen size
- [ ] No images broken or missing
- [ ] Logo renders correctly on dark and light backgrounds
- [ ] Gold accent color consistent throughout — same hex everywhere
- [ ] Font rendering correct: Cormorant Garamond for headings, DM Sans for body
- [ ] Buttons have correct hover states
- [ ] Links have correct hover states (gold underline animation)
- [ ] Basket drawer animation is smooth (no jank)
- [ ] Product card hover animation is smooth
- [ ] Page transitions are smooth
- [ ] Loading skeletons match the cards they replace (same dimensions)
- [ ] Admin panel is visually distinct from storefront (dark theme)
- [ ] All forms have proper focus indicators (gold outline)

### Functional QA
- [ ] Browse all products — all 20 items load with images and prices
- [ ] Click a product — detail page shows full info
- [ ] Add to basket — drawer updates count
- [ ] Add same item twice — qty increments (does NOT add duplicate)
- [ ] Remove item from basket — total updates
- [ ] Change qty in basket — total updates correctly
- [ ] Add item note — note visible in basket and order summary
- [ ] Out of stock item — Add to Cart disabled
- [ ] Attempt to add out-of-stock item programmatically — blocked
- [ ] Checkout form — name required
- [ ] Checkout form — phone required
- [ ] Checkout form — submit calls POST /baskets with correct payload
- [ ] Checkout form — WhatsApp link opens after submission
- [ ] Checkout form — WhatsApp message contains all order items and total
- [ ] Order confirmed page shows basket reference ID
- [ ] Campaigns display on homepage
- [ ] Campaign detail shows featured items
- [ ] Add featured item to basket from campaign page
- [ ] Admin password gate — wrong password blocked
- [ ] Admin password gate — correct password grants access
- [ ] Admin — create campaign form validates required fields
- [ ] Admin — image upload shows preview
- [ ] Admin — published campaign appears on storefront (may need page refresh)
- [ ] Admin — orders list loads all baskets
- [ ] Admin — order detail shows full basket info
- [ ] Admin — logout clears session

### API Integrity QA
- [ ] GET /merchants/mensah — merchant name, logo, WhatsApp present
- [ ] GET /merchants/mensah/items — 20 items returned, prices in pesewas
- [ ] All displayed prices correctly divided by 100
- [ ] All image URLs have API base URL prepended
- [ ] POST /baskets payload matches API schema exactly (snake_case)
- [ ] POST /campaigns payload matches API schema exactly
- [ ] team_slug included on every POST /baskets and POST /campaigns
- [ ] merchant_id is 'mensah' on every POST
- [ ] GET /baskets/{id} used after POST to get WhatsApp number
- [ ] WhatsApp deep-link uses phone number from API, not hardcoded

### Accessibility QA
- [ ] Tab through entire site — all interactive elements reachable
- [ ] Enter on focused button — activates button
- [ ] Basket drawer — focus trapped inside when open
- [ ] Escape key — closes basket drawer
- [ ] All product images have non-empty alt text
- [ ] All form inputs have associated labels
- [ ] Skip to main content link works (visible on focus)
- [ ] Screen reader announces basket count change
- [ ] Color contrast passes on all text (use browser DevTools or axe extension)

### Performance QA (Chrome DevTools)
- [ ] Lighthouse Performance score ≥ 80 on homepage
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse SEO score ≥ 90
- [ ] Lighthouse Best Practices score ≥ 90
- [ ] No layout shift visible during page load
- [ ] Images are lazy loaded below fold
- [ ] Hero image loads with priority (no LCP delay)
- [ ] /sitemap.xml accessible and valid
- [ ] /robots.txt accessible and blocks /admin

### Cross-Browser QA
- [ ] Chrome — all features working
- [ ] Firefox — all features working
- [ ] Safari (iOS) — all features working, WhatsApp link opens app
- [ ] Chrome Android — all features working, WhatsApp link opens app

---

## Pre-Submission Final Checklist

- [ ] No `console.log` statements in production code
- [ ] No hardcoded API keys or secrets in code
- [ ] `.env.local` is in `.gitignore`
- [ ] `README.md` explains how to run the project
- [ ] GitHub repo is public
- [ ] Vercel/Netlify deployment is live and accessible
- [ ] Live URL tested on a separate device (not just localhost)
- [ ] All API calls use the correct `MERCHANT_SLUG = 'mensah'`
- [ ] `team_slug` is registered and consistent across all API calls
- [ ] No raw API error messages visible to users anywhere
- [ ] 404 page exists and is branded (Mensah-styled, not Next.js default)
- [ ] Loading states exist for all async operations
- [ ] Empty states exist for all list views (no blank pages)
