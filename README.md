# Inventory Management

A single-page inventory management app with full CRUD, image uploads (Cloudinary), and a Neon PostgreSQL database.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Images | Cloudinary |
| Styling | Tailwind CSS 4 |
| UI | Lucide icons, React Hot Toast |

## Features

- **Create** – Add products with name, description, category, price, stock, and optional image
- **Read** – Product table with search and category filter
- **Update** – Edit via the left-side form (select a row’s edit action)
- **Delete** – Confirmation modal; Cloudinary image removed on delete
- **No auth** – Open single-page app as required
- **Responsive** – Stacked layout on mobile; form + table side-by-side on large screens

## Getting started

### Prerequisites

- Node.js 18+
- [Neon](https://neon.tech) project (connection string)
- [Cloudinary](https://cloudinary.com) account

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in `.env.local`:

   ```env
   DATABASE_URL=postgresql://...@....neon.tech/neondb?sslmode=require
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Push the schema to Neon:

   ```bash
   npm run db:push
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:push      # Push schema to Neon
npm run db:studio    # Drizzle Studio
```

## Project structure

```
src/
  app/
    page.tsx                    # Entry page
    layout.tsx                  # Root layout
    globals.css                 # Global styles
    api/products/
      route.ts                  # GET (list), POST (create)
      [id]/route.ts             # GET, PUT, DELETE
  components/
    layout/AppHeader.tsx        # Top bar
    inventory/                  # Product list, form, filters, stats
    modals/                     # Detail & delete confirmation
    ui/PanelCard.tsx            # Shared panel wrapper
  features/inventory/
    InventoryDashboard.tsx      # Main dashboard composition
  hooks/
    use-products.ts             # Fetch & CRUD state
    use-product-filters.ts      # Search, filter, sort
  lib/
    api/product-form.ts         # FormData parsing & validation
    constants/categories.ts     # Product categories
    db/schema.ts                # Drizzle schema
    db/index.ts                 # Neon connection
    services/cloudinary.ts      # Upload / delete images
    types/inventory.ts          # Sort & filter types
    utils/                      # Filtering, stats helpers
```

## Database schema

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary key |
| name | text | Required |
| description | text | Optional |
| category | text | Required |
| price | decimal(10,2) | Required |
| stock | integer | Required, default 0 |
| imageUrl | text | Cloudinary URL |
| imagePublicId | text | For delete on update/remove |
| createdAt / updatedAt | timestamp | Auto |

## Data flow

- **Text fields** → Neon via Drizzle (`products` table)
- **Images** → Cloudinary (`inventory-management` folder); URL + `publicId` stored in Neon
- **API** → `multipart/form-data` from the form to `/api/products` routes

## Deployment (Vercel)

Add the same environment variables in the Vercel project settings, then deploy. Run `npm run db:push` against your production Neon branch before first use.
