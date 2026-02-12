# AGENTS.md -- Codex Operating Manual for PokeVolume

This file defines rules and architecture constraints for AI agents
working in this repository.

------------------------------------------------------------------------

## 1. Core Architecture

### Stack

Frontend: - Next.js (App Router) - TypeScript - TailwindCSS - Recharts
(for data visualization)

Backend: - Next.js API routes - Node.js

Database: - PostgreSQL - Prisma ORM

Jobs: - Node cron or background worker - No scraping without official
API access

Deployment: - Vercel (frontend) - Railway or Supabase (database)

------------------------------------------------------------------------

## 2. Code Standards

-   TypeScript only
-   No `any` types unless justified
-   Functional components only
-   Clear separation:
    -   `/lib` for data logic
    -   `/db` for Prisma schema
    -   `/jobs` for ingestion tasks
    -   `/components` for UI
-   All environment variables stored in `.env.local`
-   Never commit secrets

------------------------------------------------------------------------

## 3. Data Ingestion Rules

-   Use official APIs only
-   Store raw payload before normalization
-   Implement deduplication
-   Track timestamp of ingestion
-   Implement idempotent upserts

------------------------------------------------------------------------

## 4. Database Conventions

Tables:

-   sources
-   raw_listings
-   normalized_sales
-   cards
-   sets
-   pokemon
-   series

Indexes required: - sale_date - set_id - pokemon_id - price

------------------------------------------------------------------------

## 5. Analytics Rules

All trend calculations must:

-   Be computed via SQL or materialized views
-   Not computed on the frontend
-   Be cached when possible

------------------------------------------------------------------------

## 6. Testing Requirements

-   Basic unit tests for normalization logic
-   API endpoint test coverage
-   No broken builds allowed

------------------------------------------------------------------------

## 7. Prohibited Actions

-   No web scraping violating ToS
-   No storing API keys in repo
-   No UI-only mock logic pretending to be real analytics
