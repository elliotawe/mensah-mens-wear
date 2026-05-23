# AGENT 03 — Admin Panel Agent

## Role
You are the **Admin Panel Specialist** for the Mensah luxury menswear platform. You build the `/admin` route — a password-gated dashboard where Mensah staff can create campaigns, upload images, and view all incoming orders (baskets). You follow DESIGN.md dark theme specs. You consume API functions from AGENT 01 only.

---

## Key Principle
There is **no real authentication** on the backend API. The admin panel uses a **cosmetic password gate** (hardcoded password, checked only in the browser) to satisfy the Commercial Viability criterion. Judges should see a believable admin experience — not an open form floating on a page.

The password is stored as an environment variable:
```
NEXT_PUBLIC_ADMIN_PASSWORD=mensah2025
```

**Never expose this in committed code.** Read it only from `process.env.NEXT_PUBLIC_ADMIN_PASSWORD`.

---

## File Structure

```
app/
└── admin/
    ├── layout.tsx          # Admin root layout — dark theme, no public header/footer
    ├── page.tsx            # Password gate → redirect to /admin/dashboard
    └── dashboard/
        ├── page.tsx        # Main dashboard overview
        ├── campaigns/
        │   ├── page.tsx    # List all campaigns
        │   └── new/
        │       └── page.tsx # Create campaign form
        └── orders/
            ├── page.tsx    # List all baskets/orders
            └── [id]/
                └── page.tsx # Single order detail

components/
└── admin/
    ├── AdminLayout.tsx         # Sidebar + header shell
    ├── AdminSidebar.tsx        # Navigation sidebar
    ├── PasswordGate.tsx        # Login screen component
    ├── CampaignForm.tsx        # Create campaign form
    ├── CampaignList.tsx        # Table/grid of campaigns
    ├── OrderList.tsx           # Table of all baskets
    ├── OrderDetail.tsx         # Single basket view
    ├── ImageUploader.tsx       # Drag-and-drop image upload
    └── ItemSelector.tsx        # Multi-select for featured items
```

---

## Admin Auth Flow

### Password Gate (`/admin`)

```typescript
// app/admin/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleLogin() {
    setLoading(true);
    setTimeout(() => { // Artificial delay for realism
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Store auth in sessionStorage (clears on tab close)
        sessionStorage.setItem('mensah_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  }

  return <PasswordGate
    onSubmit={handleLogin}
    onChange={setPassword}
    value={password}
    error={error}
    loading={loading}
  />;
}
```

### Auth Guard Hook

```typescript
// hooks/useAdminAuth.ts
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  useEffect(() => {
    const auth = sessionStorage.getItem('mensah_admin_auth');
    if (auth !== 'true') router.replace('/admin');
  }, [router]);
}
```

**Apply `useAdminAuth()` at the top of every admin dashboard page.**

---

## Password Gate Design

```
Visual spec — dark luxury theme:
- Full viewport, background: --color-obsidian
- Centered card: 400px wide, --color-charcoal background, gold border (1px, 0.3 opacity)
- Top: Mensah logo (white/inverted version), centered, 48px height
- Below logo: gold horizontal rule, 40px wide
- Heading: "Staff Access" — Cormorant Garamond, 28px, weight 300, parchment
- Subtext: "Enter your credentials to manage Mensah." — DM Sans, 13px, taupe
- Password input:
    - Label: "PASSWORD" — Montserrat, 10px, tracking-widest, taupe
    - Input: bottom-border only, dark bg, parchment text, gold focus
    - Type: password, with show/hide toggle
- Login button: full-width, gold background, "ENTER" text, Montserrat
- Error state: "Incorrect password. Please try again." — small, error red, below button
- No "Forgot password" link (not needed — cosmetic auth)
```

---

## Admin Layout

```typescript
// components/admin/AdminLayout.tsx
// Dark sidebar layout — not the public header/footer

Layout structure:
┌─────────────────────────────────────────────────┐
│  [M]  MENSAH ADMIN     ————————    [Logout icon] │  ← Top bar (48px, charcoal)
├──────────────┬──────────────────────────────────┤
│              │                                   │
│  Dashboard   │                                   │
│  Campaigns   │     Main content area             │
│  Orders      │                                   │
│              │                                   │
│  ──────────  │                                   │
│  View Store ↗│                                   │
│              │                                   │
└──────────────┴──────────────────────────────────┘
  240px sidebar        flex-1 content

Sidebar:
- Background: #111111
- Active nav item: gold left border (3px) + gold text
- Inactive: taupe text, hover → parchment
- "View Store ↗" at bottom: opens storefront in new tab
- "Logout" top right: clears sessionStorage, redirects to /admin

Mobile: sidebar collapses to top tab bar
```

---

## Dashboard Overview Page (`/admin/dashboard`)

**Data to fetch:**
```typescript
const [items, campaigns, teamData] = await Promise.all([
  getItems(),           // for stats
  getCampaigns(),       // for stats + list
  getTeamData(),        // GET /teams/{TEAM_SLUG} — orders + campaigns
]);
```

**Stats row (4 cards):**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 20          │ │ 3           │ │ 12          │ │ GH₵ 4,200   │
│ Total Items │ │ Campaigns   │ │ Orders      │ │ Total Orders│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

**Recent orders table:** Last 5 baskets (id, total, date)

**Recent campaigns:** Last 3 campaigns as mini cards

**Quick action buttons:**
- "Create Campaign" → /admin/dashboard/campaigns/new
- "View All Orders" → /admin/dashboard/orders

---

## Campaign Management

### Campaign List (`/admin/dashboard/campaigns`)

```
Layout: card grid (3 cols desktop, 1 col mobile)

Each campaign card shows:
- Campaign image (first image_url if available, else placeholder)
- Title: Cormorant, 20px
- Created date: formatted from unix timestamp
- Featured items count
- "View" button → /campaigns/[id] (public page, new tab)

Empty state:
  "No campaigns yet"
  "Create your first campaign to promote the Mensah collection."
  [Create Campaign — gold button]
```

### Campaign Creation Form (`/admin/dashboard/campaigns/new`)

**Form sections:**

**Section 1 — Basic Info**
```
Campaign Title *
  Input, required, placeholder: "e.g. The Heritage Collection"

Body Copy
  Textarea, 6 rows, placeholder: "Write compelling marketing copy for this campaign..."
```

**Section 2 — Campaign Image**
```
Image Upload
  - Drag-and-drop zone: dashed border, gold on dragover
  - OR "Upload Image" button → file picker
  - Accepted: JPG, PNG, WebP only
  - Max: 10MB (validate client-side before upload)
  - On upload: POST /uploads → show preview image
  - Show upload progress bar
  - Can remove and re-upload
  - Error states: file too large / wrong type
```

**Section 3 — Featured Items**
```
Featured Products (optional)
  - Search/filter input to find items by name
  - Scrollable list of all Mensah items (from GET /merchants/mensah/items)
  - Each item: thumbnail + name + price + in_stock badge
  - Click to select (checkmark appears), click again to deselect
  - Selected items shown as chips above the list
  - Out-of-stock items: shown but greyed out, cannot be selected
```

**Section 4 — Preview & Publish**
```
Live preview panel (right column on desktop):
  - Shows how the campaign will look on the storefront
  - Updates as form is filled in

Publish button:
  - "Publish Campaign" — full-width gold
  - Loading state: "Publishing..." + spinner
  - On success: toast "Campaign published!" + redirect to campaign list
  - On error: toast with specific error message
```

**Form Submission Logic:**
```typescript
async function handlePublish() {
  // 1. Validate title (required)
  if (!title.trim()) { setError('title', 'Campaign title is required'); return; }

  // 2. Upload image if selected (and not already uploaded)
  let finalImageUrl: string | undefined;
  if (imageFile && !uploadedImageUrl) {
    finalImageUrl = await uploadImage(imageFile); // from AGENT 01
  } else {
    finalImageUrl = uploadedImageUrl;
  }

  // 3. POST campaign
  const result = await createCampaign({
    title,
    copy_text: copyText || undefined,
    image_urls: finalImageUrl ? [finalImageUrl] : undefined,
    featured_item_ids: selectedItemIds.length > 0 ? selectedItemIds : undefined,
  });

  // 4. Handle result
  if (result.id) {
    toast.success('Campaign published successfully!');
    router.push('/admin/dashboard/campaigns');
  }
}
```

---

## Orders Management

### Order List (`/admin/dashboard/orders`)

**Data:** `GET /teams/{TEAM_SLUG}` returns all baskets.

```
Table layout:
┌──────────────┬──────────┬─────────────┬──────────┬────────────┐
│ Order ID     │ Customer │ Total       │ Date     │ Action     │
├──────────────┼──────────┼─────────────┼──────────┼────────────┤
│ pMyZgIah_s   │ Kwame    │ GH₵ 850.00  │ 23 May   │ [View]     │
│ ...          │ ...      │ ...         │ ...      │ [View]     │
└──────────────┴──────────┴─────────────┴──────────┴────────────┘

- Sorted: newest first
- Clicking row or [View] → /admin/dashboard/orders/[id]
- Empty state: "No orders yet. Orders will appear here once customers checkout."
```

### Order Detail (`/admin/dashboard/orders/[id]`)

**Data:** `GET /baskets/{id}` — full basket detail.

```
Layout:

[← Back to Orders]

Order Reference: pMyZgIah_s
Placed: 23 May 2025, 10:34 AM

┌─────────────────────────────────┐ ┌──────────────────────────┐
│ ORDER ITEMS                     │ │ CUSTOMER                 │
│                                 │ │ Name: Kwame Asante       │
│ [img] White Agbada × 1          │ │ Phone: +233 24 123 4567  │
│       GH₵ 850.00                │ │ Note: Need by Friday     │
│       Note: Size L              │ │                          │
│                                 │ │ ──────────────────────── │
│ [img] Slim Fit Suit × 2         │ │ TOTAL                    │
│       GH₵ 1,400.00              │ │ GH₵ 2,250.00             │
│                                 │ └──────────────────────────┘
│ ─────────────────────────────── │
│ Total: GH₵ 2,250.00             │
└─────────────────────────────────┘

[Reply on WhatsApp — gold button]
  → opens wa.me link with pre-filled message referencing order ID
```

---

## Admin-Specific UI Components

### ImageUploader Component
```typescript
interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onError: (message: string) => void;
}

// Features:
// - Drag and drop support (dragover/drop events)
// - Click to open file picker
// - Client-side validation: type (image/*) + size (< 10MB) before API call
// - Upload progress: fake progress bar (0→90% during upload, 100% on success)
// - Preview: show thumbnail after successful upload
// - Remove button: clears uploaded URL and preview
// - Accessible: aria-dropzone, keyboard activatable
```

### ItemSelector Component
```typescript
interface ItemSelectorProps {
  items: ItemDisplay[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

// Features:
// - Search bar to filter items by name
// - Checkbox-style selection on each item
// - Selected items shown as removable chips at top
// - Out-of-stock items shown greyed, unselectable, with badge
// - "Select All in Stock" convenience button
// - Max selection: no limit (backend accepts any number)
```

---

## Admin Routes — No SEO

```typescript
// app/admin/layout.tsx
export const metadata: Metadata = {
  title: 'Mensah Admin',
  robots: { index: false, follow: false }, // No indexing for admin
};
```

---

## Testing Checklist for This Agent

- [ ] `/admin` shows password gate, not dashboard
- [ ] Wrong password shows error, does NOT navigate
- [ ] Correct password navigates to `/admin/dashboard`
- [ ] Refreshing dashboard without auth redirects to `/admin`
- [ ] Dashboard stats load correctly from API data
- [ ] Campaign list shows all team campaigns
- [ ] Campaign creation: empty title shows validation error
- [ ] Campaign creation: image validates size before upload
- [ ] Campaign creation: image validates type before upload
- [ ] Campaign creation: upload progress shows during POST /uploads
- [ ] Campaign creation: featured item list loads all Mensah items
- [ ] Campaign creation: out-of-stock items cannot be selected
- [ ] Campaign creation: successful publish shows toast + redirects
- [ ] Campaign creation: API error shows meaningful error toast
- [ ] Created campaign appears on public storefront
- [ ] Order list loads from GET /teams/{slug}
- [ ] Order list sorted newest first
- [ ] Order detail shows all items, quantities, customer info, total
- [ ] Order detail WhatsApp button opens correct wa.me link
- [ ] Logout clears session and redirects to /admin password gate
- [ ] Mobile: sidebar collapses to tab bar
- [ ] Admin pages are not indexed (robots noindex)
- [ ] No console errors on any admin page
