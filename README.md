# Mensah — Luxury Tailored Menswear

A premium e-commerce platform for Mensah, a luxury tailored menswear brand built for the Coded Matrix AI Fashion Retail Hackathon.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** with shadcn/ui
- **GSAP** for animations
- **Fonts:** Cormorant Garamond, DM Sans, Montserrat

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/elliotawe/mensah-mens-wear.git
cd mensah-mens-wear
pnpm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=mensah
NEXT_PUBLIC_TEAM_SLUG=mensah-solo
NEXT_PUBLIC_ADMIN_PASSWORD=mensah2025
```

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Panel

Go to `/admin` and enter the password from `NEXT_PUBLIC_ADMIN_PASSWORD`.

The admin panel has three sections:

- **Dashboard** — Overview stats
- **Campaigns** — Create and view marketing campaigns
- **Orders** — View submitted WhatsApp orders with customer details

---

## How to Add a Campaign

1. Go to `/admin` and log in
2. Click **Campaigns** in the sidebar
3. Click **New Campaign**
4. Fill in:
   - **Title** (required) — e.g. "The Heritage Collection"
   - **Body Copy** — marketing description shown on the campaign page
   - **Image** — drag and drop or browse; JPG, PNG, or WebP up to 10MB
   - **Featured Products** — search and select items to attach to the campaign
5. Click **Publish Campaign**

The campaign will immediately appear on the `/campaigns` page and the homepage campaign section.

---

## Project Structure

```
app/               Next.js App Router pages
components/        React components (layout, home, shop, basket, admin)
lib/api/           All API calls (items, campaigns, baskets, uploads)
lib/whatsapp.ts    WhatsApp deeplink builder
context/           BasketContext (cart state)
hooks/             useBasket, useToast, useAdminAuth
public/            Static assets (logo, images)
```

## Key Rules

- Prices are in **Pesewas** — always divide by 100 for GHS display
- The basket is **in-memory only** — clears on page refresh
- Checkout creates a real basket via the API, then opens WhatsApp with the order summary
- Admin auth is session-based (sessionStorage) — not production security

---

## Deployment

```bash
pnpm build
vercel deploy
```

Set the same environment variables in the Vercel dashboard under Project Settings > Environment Variables.

After deploying, update `metadataBase` in `app/layout.tsx` with the live Vercel URL.
