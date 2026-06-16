# XYZ Marketplace

A directory site for electronics & audio equipment vendors. Customers browse
products and vendors, and every "Enquire" button opens WhatsApp (to one
central number) to ask about price and availability — there's no cart or
checkout.

Stack: **Next.js 14 (App Router, TypeScript) + Supabase (Postgres + Auth) +
Tailwind CSS**, deployable to **Vercel**.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`.
   This creates the `categories`, `vendors`, `products`, and `settings`
   tables, sets up Row Level Security policies, seeds the starter category
   list, and adds a default settings row.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Create an admin user

In Supabase, go to **Authentication → Users → Add user** and create one user
with an email and password. This is the only login the admin panel needs —
there's no public sign-up.

## 4. Run locally

```bash
npm install
npm run dev
```

- Customer site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  — sign in with the user you created in step 3.

## 5. Add your data

Everything is managed from the admin panel — no spreadsheets needed for v1:

1. **Settings** — set your real WhatsApp number (with country code, digits
   only, e.g. `919876543210`) and customize the enquiry message template.
   Also set the site name (replace the "XYZ" placeholder).
2. **Categories** — the 10 starter categories are seeded already; edit, add,
   or remove as needed.
3. **Vendors** — add your 50 vendors (name, area, description).
4. **Products** — add products one at a time, assigning each to a vendor and
   category, with optional brand, specs, and description. No price field —
   pricing is always handled over WhatsApp.

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the two environment variables from step 2 in the Vercel project
   settings (Project → Settings → Environment Variables).
4. Deploy.

## Notes

- **No prices, no photos (v1)** — product pages always show "Enquire for
  price". Photo support can be added later via Supabase Storage.
- **One WhatsApp number** — all enquiries go to the number set in
  **Settings**, regardless of which vendor the product belongs to. Vendors
  don't get their own logins in v1.
- **Deleting categories** — a category can't be deleted while products are
  still assigned to it (reassign or remove those products first). Deleting a
  vendor deletes its products too.
- **OG previews** — product pages have server-rendered metadata, so WhatsApp
  link previews show the product name, brand, vendor and category.
