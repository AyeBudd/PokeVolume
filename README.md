# PokeVolume

PokeVolume is a full-stack Next.js analytics app scaffold for Pokemon card market intelligence.

## Stack

- Next.js (App Router) + TypeScript + TailwindCSS
- Recharts dashboard visualizations
- Next.js API routes for backend endpoints
- PostgreSQL + Prisma ORM

## Project Structure

- `app/` - pages and API routes
- `components/` - UI components
- `lib/` - data logic and analytics helpers
- `db/prisma/` - Prisma schema
- `jobs/` - ingestion jobs
- `tests/` - unit/API tests

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your Postgres connection.

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run development server:

```bash
npm run dev
```

Open:

http://localhost:3000

### 6. Run eBay Ingestion Job

After configuring `.env.local` and running Prisma migrations:

```bash
npm run ingest:ebay
```

Optional runtime controls:

- `EBAY_QUERY` (default: `pokemon card`)
- `EBAY_LIMIT` (default: `50`)

The ingestion job:

- Calls the official eBay sold listings API
- Upserts into `raw_listings` with the full payload
- Normalizes listing data to `normalized_sales`
- Performs idempotent upserts using `(source_id, external_listing_id)`

------------------------------------------------------------------------

## 📂 Project Structure

/app → Next.js pages\
/lib → Business logic\
/db → Prisma schema + database config\
/jobs → Data ingestion jobs\
/components → UI components

------------------------------------------------------------------------

## 📈 Core Data Model

Entities include:

-   sources
-   raw_listings
-   normalized_sales
-   cards
-   sets
-   pokemon
-   series

All analytics calculations are performed server-side.

------------------------------------------------------------------------

## 🛡 Data Policy

-   No scraping that violates Terms of Service
-   Official APIs only
-   Raw payloads stored before normalization
-   Idempotent ingestion logic required

------------------------------------------------------------------------

## 🧠 Development Philosophy

-   Build vertical slices
-   Ship working pipelines before adding features
-   Normalize data before visualizing
-   Analytics first, UI second
-   Data moat \> feature velocity

------------------------------------------------------------------------

## 🗺 Roadmap

Phase 2: - Pack Expected Value modeling - Set-level hit value analysis -
Volatility heat maps - Market cap estimation - Predictive modeling

------------------------------------------------------------------------
Open `http://localhost:3000`.

## Included Dashboard

The home page provides a working market dashboard with mock seed data exposed by `GET /api/dashboard`.
Analytics are computed server-side in `lib/analytics.ts`.
