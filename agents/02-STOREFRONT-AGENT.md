# AGENT 02 — Storefront UI Agent

## Role
You are the **Storefront UI Specialist** for the Mensah luxury menswear platform. You build every customer-facing page and component. You consume the typed API functions from AGENT 01 (never call `fetch` directly). You follow DESIGN.md strictly — every pixel, every font, every spacing decision must match.

---

## Project Structure (Your Domain)

```
app/
├── layout.tsx                  # Root layout — fonts, metadata, providers
├── page.tsx                    # Homepage
├── shop/
│   ├── page.tsx                # Full catalog
│   └── [id]/
│       └── page.tsx            # Product detail page
├── campaigns/
│   ├── page.tsx                # All campaigns
│   └── [id]/
│       └── page.tsx            # Campaign detail page
├── checkout/
│   └── page.tsx                # Checkout form + WhatsApp send
└── order-confirmed/
    └── page.tsx                # Post-order confirmation screen

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MobileMenu.tsx
├── home/
│   ├── HeroSection.tsx
│   ├── CampaignBanner.tsx
│   └── FeaturedProducts.tsx
├── shop/
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetail.tsx
│   └── ProductImageGallery.tsx
├── campaigns/
│   ├── CampaignCard.tsx
│   └── CampaignDetail.tsx
├── basket/
│   ├── BasketDrawer.tsx
│   ├── BasketItem.tsx
│   └── BasketSummary.tsx
├── checkout/
│   ├── CheckoutForm.tsx
│   └── WhatsAppButton.tsx
└── ui/
    ├── Button.tsx
    ├── Badge.tsx
    ├── SkeletonCard.tsx
    ├── Toast.tsx
    ├── PriceDisplay.tsx
    └── ImageWithFallback.tsx
```

---

## Page Specifications

### 1. Root Layout (`app/layout.tsx`)

```typescript
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Montserrat } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mensah — Luxury Tailored Menswear | Ghana',
    template: '%s | Mensah',
  },
  description:
    'Mensah crafts luxury tailored menswear for the discerning Ghanaian gentleman. Browse our bespoke collection and order via WhatsApp.',
  keywords: ['luxury menswear', 'tailored suits', 'Ghana fashion', 'bespoke menswear', 'Mensah'],
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    siteName: 'Mensah',
    title: 'Mensah — Luxury Tailored Menswear',
    description: 'Bespoke menswear crafted for the discerning Ghanaian gentleman.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mensah Luxury Menswear' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${montserrat.variable}`}>
      <body>
        <BasketProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <BasketDrawer />
          <ToastContainer />
        </BasketProvider>
      </body>
    </html>
  );
}
```

---

### 2. Homepage (`app/page.tsx`)

**Sections in order:**
1. `<HeroSection />` — full viewport, dark, editorial
2. `<CampaignBanner />` — first active campaign (if any)
3. `<FeaturedProducts />` — first 8 in-stock items, "View All" CTA
4. `<BrandStory />` — static editorial section about Mensah's craft
5. `<CampaignGrid />` — all campaigns as cards
6. `<WhatsAppCTA />` — full-width dark section, "Order via WhatsApp" message

**Data fetching (Server Component):**
```typescript
// app/page.tsx
import { getMerchant } from '@/lib/api/merchant';
import { getItems } from '@/lib/api/items';
import { getCampaigns } from '@/lib/api/campaigns';

export default async function HomePage() {
  const [merchant, items, campaigns] = await Promise.all([
    getMerchant(),
    getItems(),
    getCampaigns(),
  ]);

  const featured = items.filter(i => i.in_stock).slice(0, 8);

  return (
    <>
      <HeroSection merchant={merchant} />
      {campaigns[0] && <CampaignBanner campaign={campaigns[0]} />}
      <FeaturedProducts items={featured} />
      <BrandStory />
      {campaigns.length > 0 && <CampaignGrid campaigns={campaigns} />}
      <WhatsAppCTA whatsappNumber={merchant.whatsapp_number} />
    </>
  );
}
```

---

### 3. HeroSection Component

```
Visual spec:
- 100dvh height
- Background: dark editorial image OR CSS gradient:
  background: linear-gradient(135deg, #0D0D0D 0%, #1A1408 60%, #2C1F00 100%);
  with grain texture overlay (CSS noise)
- Gold horizontal rule above headline (width: 60px, height: 1px)
- Eyebrow: "THE MENSAH COLLECTION" — Montserrat, 11px, tracking-widest, gold
- Headline: "Crafted for the" (newline) "Discerning Man" — Cormorant Garamond, 88px, weight 300, italic, parchment
- Subline: "Luxury tailored menswear, made in Ghana" — DM Sans, 14px, taupe
- CTA: "Explore the Collection" — ghost gold button
- Scroll indicator: thin animated vertical line, gold, bottom center
- Staggered entrance animation: eyebrow → rule → headline → subline → CTA (80ms delay each)
```

---

### 4. ProductCard Component

```typescript
interface ProductCardProps {
  item: ItemDisplay;
  onAddToBasket: (item: ItemDisplay) => void;
}
```

```
Visual spec:
- Container: no border, no box-shadow, white background
- Image: aspect-ratio 3/4, object-fit cover, overflow hidden
  - On hover: scale(1.03), transition 400ms ease
- Stock badge: absolute, top-right, 8px offset
  - In stock: #4A7C59 bg, white text, "Available"
  - Out of stock: #8B2E2E bg, white text, "Unavailable"
- Name: DM Sans 400, 15px, color --color-slate, mt-3
  - On card hover: gold underline animates in (width 0 → 100%, 300ms)
- Price: Montserrat 500, 14px, color --color-gold
- Add to Cart area:
  - Desktop: hidden by default, slides up from bottom on card hover
  - Mobile: always visible below price
  - Disabled + muted if out of stock
- Entire card is a link to /shop/[id]
- Add to cart button stops propagation (doesn't navigate)
```

---

### 5. Product Detail Page (`app/shop/[id]/page.tsx`)

**Layout:** Two-column on desktop (image left, details right), stacked on mobile.

**Left column:**
- Large primary image
- Thumbnail row for additional images (click to swap primary)
- All images from `item.image_urls`

**Right column:**
- Eyebrow: "MENSAH COLLECTION" — small, gold, all-caps
- Name: Cormorant Garamond, 42px, weight 300
- Price: Montserrat 500, 22px, gold
- Stock status: badge + text
- Divider: thin gold line
- Description (if exists): DM Sans, 16px, leading-relaxed
- Size/Note input: "Special Instructions" label, textarea, placeholder "e.g. Size 42, slim fit"
- Quantity stepper: minus / number / plus, minimum 1
- Add to Basket CTA: full-width gold button
- WhatsApp direct CTA: secondary ghost button — "Send Enquiry via WhatsApp"
- Breadcrumb: Home → Shop → {item name}

**Metadata:**
```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getItem(params.id);
  return {
    title: `${item.name} | Mensah`,
    description: item.description ?? `${item.name} — luxury tailored menswear by Mensah. GH₵ ${item.price_ghs.toFixed(2)}.`,
    openGraph: {
      images: [{ url: item.primary_image }],
    },
  };
}
```

---

### 6. Shop Page (`app/shop/page.tsx`)

**Layout:**
- Hero bar: page title "The Collection", item count, filter/sort controls
- Filter row: "All" | "In Stock" | "Out of Stock" — pill toggles, gold active state
- Product grid: responsive (see DESIGN.md grid specs)
- Empty state: "No items match your filter" with clear filter CTA

**Skeleton loading:** Show 12 skeleton cards while fetching.

---

### 7. Campaign Pages

**Campaign list (`/campaigns`):**
- Editorial magazine layout — NOT a simple grid
- First campaign: full-width hero treatment (like a magazine cover)
- Remaining: alternating left/right image + text layout
- Each card links to `/campaigns/[id]`

**Campaign detail (`/campaigns/[id]`):**
- Hero image (if available), full-width
- Campaign title: large Cormorant display
- Copy text: editorial body text
- Featured items section: "Featured in this Collection" — mini product grid
- CTA: "Shop the Collection" → links to /shop with featured items highlighted

---

### 8. Basket Drawer

**Behavior:**
- Triggered by basket icon in header
- Slides in from right (translateX 100% → 0)
- Backdrop: semi-transparent dark overlay, click to close
- Trap focus when open
- Close on Escape key

**Structure:**
```
Header: "Your Selection" — Cormorant, "X" close button
─────────────────────────────────────────────
[Item thumbnail] [Item name]       [Price]
                 [qty stepper]  [remove link]
                 [item note if set]
─────────────────────────────────────────────
[Item thumbnail] [Item name]       [Price]
...
─────────────────────────────────────────────
Subtotal:                         GH₵ XXX.XX
─────────────────────────────────────────────
[Proceed to Checkout — gold full-width button]
[Continue Shopping — text link]

Empty state:
  "Your basket awaits"
  "Add pieces from our collection to begin"
  [Explore the Collection — ghost button]
```

---

### 9. Checkout Page (`app/checkout/page.tsx`)

**Guard:** If basket is empty, redirect to /shop.

**Layout:** Two-column on desktop — form left, order summary right (sticky).

**Form fields:**
```
Full Name *
  placeholder: "Your full name"

Phone Number *
  prefix: +233 (Ghana code, pre-filled, cannot remove)
  placeholder: "XX XXX XXXX"

Order Note (optional)
  placeholder: "Any special instructions, measurements, or requests..."
  rows: 4
```

**Order summary (right/bottom):**
- Each item: thumbnail, name, qty, price
- Divider
- Total in Montserrat, large, gold
- "Prices in GHS (Ghanaian Cedi)"

**WhatsApp Button:**
- Full-width, dark background
- WhatsApp logo (SVG icon) + "Send Order via WhatsApp"
- On click: validate form → POST basket → GET basket → build link → open link
- Loading state: spinner replaces icon, button disabled
- Error state: toast notification with specific error message

---

### 10. Order Confirmed Page (`app/order-confirmed/page.tsx`)

**Accessed after:** Successful WhatsApp deep-link built.

**Layout:**
- Centered, minimal
- Gold checkmark icon (SVG, animated draw-on)
- "Order Sent!" — Cormorant, 48px
- "Your order has been sent to Mensah on WhatsApp. They will confirm shortly."
- Order ID displayed: "Reference: {basket_id}"
- "Continue Shopping" — ghost button
- "View on WhatsApp" — if link still available

---

### 11. Header Component

```
Desktop layout:
[Mensah logo] ——————————————— [Shop] [Campaigns] [About] ——— [🛒 (count)]

Behavior:
- Transparent background when at top of homepage hero
- Transitions to --color-obsidian background on scroll > 80px
- Transition: background 400ms ease
- Logo: mensah_logo.png, invert filter on dark bg
- Nav links: DM Sans 300, 12px, tracking-widest, all-caps
- Active link: gold color
- Basket icon: outline style, gold badge with item count
- Mobile: hamburger icon (3 lines → X animation)

Mobile menu:
- Full-screen overlay, dark background
- Links stagger in from right (80ms delay each)
- Large Cormorant Garamond link style
- Basket link at bottom with total price
```

---

### 12. Footer Component

```
Layout: 3-column grid on desktop, stacked on mobile

Column 1:
  Mensah logo
  "Crafted for the discerning man."
  Instagram icon | WhatsApp icon

Column 2:
  SHOP
  All Products
  Campaigns
  
Column 3:
  CONTACT
  Order via WhatsApp
  {whatsapp_number}

Bottom bar:
  © 2025 Mensah. All rights reserved.   |   Powered by Coded Matrix Hackathon
```

---

## Basket State Management

```typescript
// context/BasketContext.tsx
// Use React Context + useReducer (no localStorage — keep in memory per session)

interface BasketItem {
  item: ItemDisplay;
  qty: number;
  item_note?: string;
}

interface BasketState {
  items: BasketItem[];
  isOpen: boolean;
}

type BasketAction =
  | { type: 'ADD_ITEM'; item: ItemDisplay; qty?: number; note?: string }
  | { type: 'REMOVE_ITEM'; item_id: string }
  | { type: 'UPDATE_QTY'; item_id: string; qty: number }
  | { type: 'UPDATE_NOTE'; item_id: string; note: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' };

// Rules:
// - ADD_ITEM: if item already in basket, increment qty
// - UPDATE_QTY: if qty reaches 0, remove item
// - Cannot add out-of-stock items (check item.in_stock)
// - Computed: totalItems (sum of qty), totalPrice (sum of price_minor * qty)
```

---

## Toast Notification System

```typescript
// Trigger toasts from anywhere via useToast() hook
// Types: 'success' | 'error' | 'info' | 'warning'

// Examples:
toast.success('Added to basket'); 
toast.error('Some items are out of stock. Please review your basket.');
toast.info('Opening WhatsApp...');
toast.warning('Your basket is empty');
```

---

## Accessibility Requirements (Non-Negotiable)

- Every `<img>` has meaningful `alt` text
- All buttons have `aria-label` if icon-only
- Basket drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Your basket"`, focus trap
- Form inputs: `<label htmlFor>` always associated
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`
- Color contrast: all text meets WCAG AA
- Keyboard navigation: Tab through all interactive elements in logical order
- `@media (prefers-reduced-motion: reduce)`: disable all animations

---

## Performance Requirements

- LCP (Largest Contentful Paint): < 2.5s
- Use `next/image` with `priority` on above-fold images
- Use `loading="lazy"` on below-fold product images
- Skeleton screens instead of spinners during data fetch
- `Suspense` boundaries around async Server Components
- Minimize client-side JS — prefer Server Components where possible
- CSS-only animations where possible (no JS animation for simple transitions)

---

## Testing Checklist for This Agent

- [ ] Homepage loads all sections with real API data
- [ ] Product grid renders correct images (full URL, not relative)
- [ ] Out of stock items show correct badge and disabled Add to Cart
- [ ] Add to basket adds item to drawer with correct qty
- [ ] Basket count in header updates immediately
- [ ] Basket drawer opens/closes correctly, focus trapped
- [ ] Escape key closes basket drawer
- [ ] Quantity stepper in drawer updates total
- [ ] Remove item from drawer removes it and updates total
- [ ] Empty basket shows empty state (not broken layout)
- [ ] Checkout redirects to /shop if basket empty
- [ ] Checkout form validates required fields before submission
- [ ] Phone number field pre-fills +233
- [ ] Order summary in checkout matches basket items exactly
- [ ] Header becomes dark/solid on scroll
- [ ] Mobile menu opens and closes correctly
- [ ] All pages have correct meta titles
- [ ] Product detail page shows all images in gallery
- [ ] Campaign detail shows featured items with correct prices
- [ ] Site is fully navigable by keyboard only
- [ ] Reduced motion preference disables animations
- [ ] No console errors on any page
- [ ] All images have alt text
