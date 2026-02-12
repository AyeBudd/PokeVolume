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

Open `http://localhost:3000`.

## Included Dashboard

The home page provides a working market dashboard with mock seed data exposed by `GET /api/dashboard`.
Analytics are computed server-side in `lib/analytics.ts`.
