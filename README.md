# PokeVolume

PokeVolume is a production-focused Next.js app for Pokémon TCG booster-pack valuation. It compares current pack costs from eBay and Pokémon Center with expected card-market value to rank packs by decision quality.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Server-side EV calculation utilities
- Placeholder source adapters for future live ingestion

## Features

- **Homepage pack grid** with search, sorting, source chips, and value/cost badges
- **Pack ranking metrics**:
  - Expected Value (EV)
  - Value per Pack (`EV / lowest pack price`)
  - Average Hit Value
  - Chase Card Value
  - Pull Value Ratio
  - Cost Efficiency Score
  - ROI Signal (`Undervalued`, `Fair`, `Overpriced`)
- **Pack detail page** with KPI cards, source links, and sortable tracked-card table
- **Pull-rate fallback logic** by rarity when exact pull rates are missing (marked as estimated)
- **Seeded demo dataset** covering:
  - Surging Sparks
  - 151
  - Crown Zenith
  - Paldean Fates
  - Obsidian Flames
  - Twilight Masquerade
  - Temporal Forces
  - Paradox Rift
  - Stellar Crown

## Project Structure

- `app/` — routes, pages, loading/error states, API endpoints
- `components/` — reusable UI components
- `lib/` — Prisma client, EV logic, pack aggregation logic
- `prisma/` — schema + seed script
- `services/adapters/` — ingestion adapter stubs for external data providers
- `types/` — app domain types
- `utils/` — formatting helpers
- `jobs/` — ingestion jobs (existing)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.local.example .env.local
```

3. Set a PostgreSQL connection string in `DATABASE_URL`.

4. Generate Prisma client, push schema, and seed:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## APIs

- `GET /api/packs?sort=valuePerPack|packCost|releaseDate|alphabetical`
  - Returns server-calculated pack metrics used by the UI.

## Plugging in Real APIs Later

Use these adapter stubs:

- `services/adapters/ebay-pack-pricing.ts`
- `services/adapters/pokemon-center-pricing.ts`
- `services/adapters/card-market-pricing.ts`
- `services/adapters/pull-rates.ts`

Recommended integration flow:

1. Fetch raw provider payloads.
2. Store source listings + confidence metadata in `SourceListing`.
3. Store temporal prices in `PackPrice` / `CardPrice`.
4. Store exact pull rates in `PullRate` (`isEstimated=false`).
5. Recompute EV using `lib/ev.ts` and `lib/pack-data.ts` without UI rewrites.
