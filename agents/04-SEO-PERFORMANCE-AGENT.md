# AGENT 04 — SEO & Performance Agent

## Role
You are the **SEO & Performance Specialist** for the Mensah luxury menswear platform. You ensure the application ranks well, loads fast, and presents beautifully when shared on social media. You work across the entire project but own no UI — you inject metadata, structured data, sitemaps, and performance optimizations into what AGENT 02 and AGENT 03 build.

---

## SEO Architecture

### Metadata Strategy (Next.js App Router)

#### Root Layout Metadata
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://mensah.vercel.app'), // update with real domain
  title: {
    default: 'Mensah — Luxury Tailored Menswear | Ghana',
    template: '%s | Mensah',
  },
  description:
    'Mensah crafts luxury tailored menswear for the discerning Ghanaian gentleman. Browse our bespoke collection of suits, agbada, and fine tailoring. Order via WhatsApp.',
  keywords: [
    'luxury menswear Ghana',
    'bespoke suits Accra',
    'tailored menswear',
    'Ghanaian fashion',
    'agbada suits',
    'Mensah fashion',
    'West African formalwear',
    'mens tailoring Ghana',
  ],
  authors: [{ name: 'Mensah' }],
  creator: 'Mensah',
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://mensah.vercel.app',
    siteName: 'Mensah',
    title: 'Mensah — Luxury Tailored Menswear',
    description:
      'Bespoke menswear crafted for the discerning Ghanaian gentleman. Shop the collection and order via WhatsApp.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mensah Luxury Tailored Menswear',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mensah — Luxury Tailored Menswear',
    description: 'Bespoke menswear crafted for the discerning Ghanaian gentleman.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  verification: {
    // Add Google Search Console verification if available
    // google: 'verification-token',
  },
};
```

#### Page-Level Metadata

**Homepage:**
```typescript
// No additional metadata needed — inherits root defaults
```

**Shop Page:**
```typescript
export const metadata: Metadata = {
  title: 'Shop Bespoke Menswear',
  description:
    'Browse the complete Mensah menswear collection. Luxury suits, agbada, and tailored pieces. Prices in GHS. Order via WhatsApp.',
  openGraph: {
    title: 'Shop Bespoke Menswear | Mensah',
    description: 'The complete Mensah collection — luxury tailored menswear crafted in Ghana.',
  },
};
```

**Product Detail (Dynamic):**
```typescript
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = await getItem(params.id);

  return {
    title: item.name,
    description:
      item.description ??
      `${item.name} — luxury tailored menswear by Mensah. ${formatPrice(item.price_minor)} GHS. Available to order via WhatsApp.`,
    openGraph: {
      title: `${item.name} | Mensah`,
      description: item.description ?? `${item.name} — GH₵ ${item.price_ghs.toFixed(2)}`,
      images: item.primary_image
        ? [{ url: item.primary_image, width: 800, height: 1067, alt: item.name }]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.name} | Mensah`,
      images: item.primary_image ? [item.primary_image] : undefined,
    },
  };
}
```

**Campaign Detail (Dynamic):**
```typescript
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const campaign = await getCampaign(params.id);

  return {
    title: campaign.title,
    description:
      campaign.copy_text ??
      `${campaign.title} — exclusive collection from Mensah Luxury Menswear.`,
    openGraph: {
      title: `${campaign.title} | Mensah`,
      description: campaign.copy_text ?? `${campaign.title} — Mensah Collection`,
      images: campaign.image_urls?.[0]
        ? [{ url: campaign.image_urls[0], alt: campaign.title }]
        : undefined,
    },
  };
}
```

---

## Structured Data (JSON-LD)

### Organization Schema (Homepage)
```typescript
// components/seo/OrganizationSchema.tsx
export function OrganizationSchema({ merchant }: { merchant: Merchant }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Mensah',
    description: 'Luxury tailored menswear crafted for the discerning Ghanaian gentleman.',
    url: 'https://mensah.vercel.app',
    logo: 'https://mensah.vercel.app/mensah_logo.png',
    contactPoint: merchant.whatsapp_number
      ? {
          '@type': 'ContactPoint',
          telephone: merchant.whatsapp_number,
          contactType: 'sales',
          availableLanguage: 'English',
        }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GH',
    },
    currenciesAccepted: 'GHS',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Product Schema (Product Detail Page)
```typescript
// components/seo/ProductSchema.tsx
export function ProductSchema({ item }: { item: ItemDisplay }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    image: item.image_urls,
    brand: {
      '@type': 'Brand',
      name: 'Mensah',
    },
    offers: {
      '@type': 'Offer',
      url: `https://mensah.vercel.app/shop/${item.id}`,
      priceCurrency: item.currency,
      price: item.price_ghs.toFixed(2),
      availability: item.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Mensah',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### BreadcrumbList (All Pages Except Home)
```typescript
// components/seo/BreadcrumbSchema.tsx
interface Crumb { name: string; url: string }

export function BreadcrumbSchema({ crumbs }: { crumbs: Crumb[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `https://mensah.vercel.app${crumb.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Usage on shop/[id]/page.tsx:
// <BreadcrumbSchema crumbs={[
//   { name: 'Home', url: '/' },
//   { name: 'Shop', url: '/shop' },
//   { name: item.name, url: `/shop/${item.id}` },
// ]} />
```

---

## Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getItems } from '@/lib/api/items';
import { getCampaigns } from '@/lib/api/campaigns';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items, campaigns] = await Promise.all([getItems(), getCampaigns()]);

  const BASE = 'https://mensah.vercel.app';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/campaigns`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const itemPages: MetadataRoute.Sitemap = items.map(item => ({
    url: `${BASE}/shop/${item.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: item.in_stock ? 0.8 : 0.5,
  }));

  const campaignPages: MetadataRoute.Sitemap = campaigns.map(c => ({
    url: `${BASE}/campaigns/${c.id}`,
    lastModified: new Date(c.created_at * 1000),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...itemPages, ...campaignPages];
}
```

---

## Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://mensah.vercel.app/sitemap.xml',
  };
}
```

---

## PWA Manifest

```json
// public/manifest.json
{
  "name": "Mensah — Luxury Menswear",
  "short_name": "Mensah",
  "description": "Luxury tailored menswear crafted in Ghana",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D0D",
  "theme_color": "#C9A84C",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["shopping", "fashion"],
  "lang": "en-GH"
}
```

---

## Performance Optimizations

### Next.js Config
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-hackathon.codedematrixtech.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api-hackathon.codedematrixtech.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/fonts/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

export default nextConfig;
```

### Image Optimization Rules
```typescript
// Always use next/image — NEVER <img> tags for product/campaign images

// Above the fold (hero, first product row): priority
<Image src={item.primary_image} alt={item.name} width={600} height={800} priority />

// Below the fold: lazy (default)
<Image src={item.primary_image} alt={item.name} width={600} height={800} />

// Always set sizes for responsive images
<Image
  src={item.primary_image}
  alt={item.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

### Caching Strategy
```typescript
// Server Components fetch caching:
// - Merchant data: revalidate every 3600s (1 hour)
// - Items: revalidate every 300s (5 min) — stock can change
// - Campaigns: revalidate every 300s (5 min)
// - Individual basket: no cache (always fresh)

// next.config.ts can set global defaults:
// experimental: { staleTimes: { dynamic: 30, static: 180 } }
```

### Font Loading
```typescript
// Already configured in layout.tsx with next/font/google
// Key settings:
// - display: 'swap' — prevents invisible text during load
// - preload: true (default) — fonts preloaded in <head>
// - variable: CSS custom property approach — applies globally
```

---

## Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | `priority` on hero image, preload fonts |
| FID/INP | < 100ms | Minimal client JS, Server Components |
| CLS | < 0.1 | Always set image dimensions, `aspect-ratio` CSS |
| TTFB | < 800ms | Next.js edge runtime for static pages |
| FCP | < 1.8s | Critical CSS inlined, font preload |

---

## OG Image Generation

Create a static OG image at `public/og-image.jpg` (1200×630px):
- Dark background (--color-obsidian)
- Mensah logo centered
- Tagline: "Luxury Tailored Menswear" in Cormorant Garamond
- Gold accent line beneath
- Subtle grain texture overlay

For dynamic product OG images, use Next.js `opengraph-image.tsx` if time allows:
```typescript
// app/shop/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getItem } from '@/lib/api/items';

export default async function OGImage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);
  return new ImageResponse(
    (
      <div style={{ display: 'flex', background: '#0D0D0D', width: '100%', height: '100%' }}>
        <img src={item.primary_image} style={{ width: '50%', objectFit: 'cover' }} />
        <div style={{ flex: 1, padding: '60px', color: '#F5F0E8' }}>
          <p style={{ color: '#C9A84C', fontSize: 16, letterSpacing: 6 }}>MENSAH</p>
          <h1 style={{ fontSize: 48, fontWeight: 300 }}>{item.name}</h1>
          <p style={{ color: '#C9A84C', fontSize: 24 }}>
            GH₵ {item.price_ghs.toFixed(2)}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

---

## Testing Checklist for This Agent

- [ ] All pages have unique, descriptive `<title>` tags
- [ ] All pages have `<meta name="description">` with 150–160 chars
- [ ] Homepage has Organization JSON-LD structured data
- [ ] Product pages have Product JSON-LD structured data
- [ ] All pages have valid Open Graph tags (title, description, image)
- [ ] Twitter card meta tags present on all pages
- [ ] `/sitemap.xml` returns valid XML with all public pages
- [ ] `/robots.txt` blocks `/admin` and allows everything else
- [ ] `next/image` used for all product/campaign images
- [ ] Above-fold images have `priority` prop
- [ ] All images have meaningful `alt` text
- [ ] No layout shift from images (dimensions/aspect-ratio always set)
- [ ] Fonts load with `display: swap`
- [ ] Security headers present on all responses
- [ ] Admin pages have `noindex, nofollow` robots meta
- [ ] PWA manifest is valid and accessible at `/manifest.json`
- [ ] Favicon works in browser tab
- [ ] OG image renders correctly when URL shared on WhatsApp/social
- [ ] Page load time < 3s on 3G throttled connection (Chrome DevTools)
- [ ] No Lighthouse performance warnings on homepage
