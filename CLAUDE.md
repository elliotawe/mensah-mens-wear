# CLAUDE.md — Mensah Luxury Menswear Platform
## Master Orchestration Document for Claude Code

---

## Project Overview

**Brand:** Mensah — Luxury Tailored Menswear  
**Track:** AI Fashion Retail Hackathon — Single Track  
**Framework:** Next.js 14+ (App Router)  
**API:** `https://api-hackathon.codedematrixtech.com`  
**Merchant Slug:** `mensah`  
**Team Slug:** `mensah-solo`  
**Logo:** `mensah_logo.png` (wordmark, in `/public`)

---

## Evaluation Criteria (Always Keep in Mind)

Every decision — code, design, copy — must serve these five pillars:

1. **UI/Design** — Premium fashion look & feel. Responsive. Intuitive.
2. **Functionality** — Inventory, checkout, campaigns all working perfectly.
3. **Testing** — Robust. Edge cases handled. Nothing breaks.
4. **Data Integrity** — API data correct. Prices correct. No hardcoded data.
5. **Commercial Viability** — Feels like a real business. Professional end-to-end.

---

## Agent System

This project is divided across 5 specialist agents. Each has its own `.md` file in `/agents/`. Always consult the relevant agent before working on its domain.

| Agent | File | Domain |
|---|---|---|
| API Integration | `agents/01-API-AGENT.md` | All API calls, types, error handling, WhatsApp link |
| Storefront UI | `agents/02-STOREFRONT-AGENT.md` | All customer-facing pages and components |
| Admin Panel | `agents/03-ADMIN-AGENT.md` | `/admin` route, campaign creation, order viewing |
| SEO & Performance | `agents/04-SEO-PERFORMANCE-AGENT.md` | Metadata, structured data, sitemap, images |
| Testing & QA | `agents/05-TESTING-QA-AGENT.md` | All tests, QA checklists, pre-submission checks |

**Rule:** Before writing any code in a domain, read that agent's `.md` file completely.

---

## Design System

All visual decisions are in `DESIGN.md` and its refernces available in `./design-refs/*`. Key references:
- Color palette: `--color-obsidian`, `--color-gold`, `--color-parchment`
- Fonts: Cormorant Garamond (display), DM Sans (body), Montserrat (accent/prices)
- Spacing: generous — luxury = breathing room
- Never use Inter, Roboto, Arial, purple gradients, or full rounded buttons

---

## Project Setup Commands

```bash

# 1. Install dependencies
pnpm install msw @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# 2. Add font packages (handled by next/font/google — no pnpm install needed)

# 3. Create environment file
echo "NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah-solo
NEXT_PUBLIC_ADMIN_PASSWORD=mensah2025" > .env.local

# 4. Add to .gitignore
echo ".env.local" >> .gitignore

# 6. Place logo
# logo is available in /public/mensah_logo.png
```

---

## Directory Structure (Complete)

```
mensah/
├── public/
│   ├── mensah_logo.png          # Wordmark logo
│   ├── favicon.ico
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-icon.png
│   ├── og-image.jpg             # 1200×630 OG image
│   ├── manifest.json
│   └── images/
│       └── placeholder.jpg      # Fallback product image
│
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata, providers)
│   ├── page.tsx                 # Homepage
│   ├── not-found.tsx            # Custom 404
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── robots.ts                # Robots.txt
│   ├── globals.css              # CSS variables, base styles
│   ├── shop/
│   │   ├── page.tsx             # Full catalog
│   │   └── [id]/
│   │       ├── page.tsx         # Product detail
│   │       └── opengraph-image.tsx
│   ├── campaigns/
│   │   ├── page.tsx             # Campaigns list
│   │   └── [id]/
│   │       └── page.tsx         # Campaign detail
│   ├── checkout/
│   │   └── page.tsx             # Checkout form
│   ├── order-confirmed/
│   │   └── page.tsx             # Post-order success
│   └── admin/
│       ├── layout.tsx           # Admin layout (dark, no public header)
│       ├── page.tsx             # Password gate
│       └── dashboard/
│           ├── page.tsx         # Dashboard overview
│           ├── campaigns/
│           │   ├── page.tsx     # Campaign list
│           │   └── new/
│           │       └── page.tsx # Create campaign
│           └── orders/
│               ├── page.tsx     # Order list
│               └── [id]/
│                   └── page.tsx # Order detail
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── CampaignBanner.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── BrandStory.tsx
│   │   ├── CampaignGrid.tsx
│   │   └── WhatsAppCTA.tsx
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductImageGallery.tsx
│   ├── campaigns/
│   │   ├── CampaignCard.tsx
│   │   └── CampaignDetail.tsx
│   ├── basket/
│   │   ├── BasketDrawer.tsx
│   │   ├── BasketItem.tsx
│   │   └── BasketSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   └── WhatsAppButton.tsx
│   ├── seo/
│   │   ├── OrganizationSchema.tsx
│   │   ├── ProductSchema.tsx
│   │   └── BreadcrumbSchema.tsx
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── PasswordGate.tsx
│   │   ├── CampaignForm.tsx
│   │   ├── CampaignList.tsx
│   │   ├── OrderList.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── ImageUploader.tsx
│   │   └── ItemSelector.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── SkeletonCard.tsx
│       ├── Toast.tsx
│       ├── PriceDisplay.tsx
│       └── ImageWithFallback.tsx
│
├── lib/
│   ├── api/
│   │   ├── config.ts            # API base URL, slugs
│   │   ├── merchant.ts          # getMerchant, buildImageUrl
│   │   ├── items.ts             # getItems, getItem, formatPrice
│   │   ├── campaigns.ts         # getCampaigns, getCampaign, createCampaign
│   │   ├── baskets.ts           # createBasket, getBasket
│   │   └── uploads.ts           # uploadImage, rehostImage
│   └── whatsapp.ts              # buildWhatsAppLink, buildOrderSummaryText
│
├── context/
│   └── BasketContext.tsx        # Basket state management
│
├── hooks/
│   ├── useBasket.ts             # useBasket() hook
│   ├── useToast.ts              # useToast() hook
│   └── useAdminAuth.ts          # Admin session guard
│
├── tests/
│   ├── mocks/
│   │   ├── handlers.ts          # MSW request handlers
│   │   └── server.ts            # MSW server setup
│   ├── unit/
│   │   ├── api.test.ts
│   │   └── basket-context.test.tsx
│   ├── integration/
│   │   ├── checkout.test.tsx
│   │   ├── catalog.test.tsx
│   │   └── campaigns.test.tsx
│   └── edge-cases.test.tsx
│
├── CLAUDE.md                    # This file
├── DESIGN.md                    # Design system
├── agents/
│   ├── 01-API-AGENT.md
│   ├── 02-STOREFRONT-AGENT.md
│   ├── 03-ADMIN-AGENT.md
│   ├── 04-SEO-PERFORMANCE-AGENT.md
│   └── 05-TESTING-QA-AGENT.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts
├── .env.local                   # Never commit
├── .gitignore
└── README.md
```

---

## Build Order (Recommended)

Follow this sequence to avoid dependency issues:

```
Phase 1 — Foundation
  1. Project setup (commands above)
  2. globals.css — CSS variables from DESIGN.md
  3. lib/api/ — all API functions (AGENT 01)
  4. context/BasketContext.tsx
  5. hooks/ — useBasket, useToast, useAdminAuth

Phase 2 — Layout Shell
  6. app/layout.tsx — fonts, metadata, providers
  7. components/layout/Header.tsx
  8. components/layout/Footer.tsx
  9. components/ui/ — Button, Badge, SkeletonCard, Toast, PriceDisplay, ImageWithFallback

Phase 3 — Core Pages
  10. app/page.tsx + all home/ components (HeroSection, CampaignBanner, FeaturedProducts, etc.)
  11. app/shop/page.tsx + ProductGrid, ProductCard
  12. app/shop/[id]/page.tsx + ProductDetail, ProductImageGallery
  13. app/campaigns/page.tsx + CampaignCard
  14. app/campaigns/[id]/page.tsx + CampaignDetail

Phase 4 — Basket & Checkout
  15. components/basket/BasketDrawer.tsx + BasketItem, BasketSummary
  16. app/checkout/page.tsx + CheckoutForm, WhatsAppButton
  17. app/order-confirmed/page.tsx
  18. lib/whatsapp.ts

Phase 5 — Admin Panel
  19. app/admin/page.tsx + PasswordGate
  20. components/admin/AdminLayout.tsx + AdminSidebar
  21. app/admin/dashboard/page.tsx
  22. app/admin/dashboard/campaigns/ pages + CampaignForm, ImageUploader, ItemSelector
  23. app/admin/dashboard/orders/ pages + OrderList, OrderDetail

Phase 6 — SEO & Performance
  24. components/seo/ — all schema components
  25. app/sitemap.ts
  26. app/robots.ts
  27. app/not-found.tsx
  28. next.config.ts — image domains, headers, compression

Phase 7 — Testing
  29. tests/mocks/ — MSW setup
  30. tests/unit/ — API and basket tests
  31. tests/integration/ — flow tests
  32. tests/edge-cases.test.tsx
  33. Manual QA checklist (AGENT 05)
```

---

## Critical Rules (Never Break These)

1. **Never call `fetch` directly in components** — always use lib/api/ functions
2. **Never hardcode prices** — always divide `price_minor / 100` using `formatPrice()`
3. **Never use raw `<img>` for API images** — always use `next/image` with `buildImageUrl()`
4. **Always include `team_slug: 'mensah-solo'`** on every POST /baskets and POST /campaigns
5. **Always include `merchant_id: 'mensah'`** on every POST
6. **Never show raw API error messages to users** — always map to user-friendly copy
7. **Never commit `.env.local`** — it's in .gitignore
8. **Always escape user-generated content** — never use `dangerouslySetInnerHTML` with API data
9. **Admin pages must check auth** — every dashboard page calls `useAdminAuth()`
10. **Every async operation needs a loading state** — no bare awaits without UI feedback
11. **Every list needs an empty state** — no blank pages
12. **Every image needs alt text** — no empty or missing alt attributes

---

## Key Data Facts

| Fact | Value |
|---|---|
| Merchant slug | `mensah` |
| Team slug | `mensah-solo` |
| Price unit | Pesewas (divide by 100 for GHS) |
| Currency code | `GHS` |
| Image URLs | Relative — prepend API base URL |
| API base | `https://api-hackathon.codedematrixtech.com` |
| WhatsApp link format | `https://wa.me/{digits_only}?text={encoded}` |
| Basket: immutable | Once created, cannot edit — create a new one |
| Out-of-stock | `in_stock: false` — cannot add to basket |
| Admin password env | `NEXT_PUBLIC_ADMIN_PASSWORD` |

---

## README.md Template

```markdown
# Mensah — Luxury Tailored Menswear

A premium e-commerce platform for Mensah, a luxury tailored menswear brand. Built for the AI Fashion Retail Hackathon by Coded Matrix.

## Features
- 🛍️ Full product catalog with real-time stock status
- 📱 WhatsApp-native checkout flow
- 📣 Marketing campaign showcase
- 🔐 Admin panel for campaign management and order viewing
- ⚡ Optimized for performance and SEO

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cormorant Garamond + DM Sans + Montserrat typography

## Getting Started

\`\`\`bash
pnpm install
cp .env.example .env.local
# Fill in your values in .env.local
pnpm run dev
\`\`\`

## Environment Variables

\`\`\`
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah-solo
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
\`\`\`

## Running Tests

\`\`\`bash
pnpm run test
\`\`\`

## Live Demo
[https://mensah.vercel.app](https://mensah.vercel.app)

## Hackathon Track
Mensah — Luxury/Tailored Menswear (Single Track)
AI Fashion Retail Hackathon by Coded Matrix
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_BASE
# NEXT_PUBLIC_MERCHANT_SLUG  
# NEXT_PUBLIC_TEAM_SLUG
# NEXT_PUBLIC_ADMIN_PASSWORD
```

**After deployment:**
- Update `metadataBase` in `app/layout.tsx` with real Vercel URL
- Update `sitemap.ts` BASE URL
- Update `OrganizationSchema` url field
- Test live URL on mobile device
- Test WhatsApp link on real phone
