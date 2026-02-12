# PokeVolume

## 🚀 Overview

PokeVolume is a market intelligence platform for Pokémon card sales
analytics.

It aggregates sold listing data (starting with eBay), normalizes it, and
provides:

-   Total market volume tracking
-   Liquidity trend analysis
-   Trending Pokémon and sets
-   Card-level valuation metrics
-   Set-level velocity and heat scoring

Long-term objective: become the definitive analytics layer for the
Pokémon collectibles market.

------------------------------------------------------------------------

## 🏗 Architecture

### Frontend

-   Next.js (App Router)
-   TypeScript
-   TailwindCSS
-   Recharts

### Backend

-   Next.js API routes
-   Background ingestion jobs

### Database

-   PostgreSQL
-   Prisma ORM

### Deployment

-   Vercel (frontend)
-   Railway / Supabase (database)

------------------------------------------------------------------------

## 📊 MVP Scope

Phase 1 includes:

-   eBay sold listings ingestion (official API only)
-   Normalized sales storage
-   Market dashboard with:
    -   Daily volume
    -   7-day / 30-day trends
    -   Trending Pokémon
    -   Trending sets

------------------------------------------------------------------------

## ⚙️ Local Development Setup

### 1. Clone Repo

git clone https://github.com/YOUR_USERNAME/pokevolume.git cd pokevolume

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create `.env.local`:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE\
EBAY_APP_ID=your_ebay_app_id\
EBAY_CERT_ID=your_ebay_cert_id\
EBAY_DEV_ID=your_ebay_dev_id

Never commit `.env.local`.

### 4. Setup Database

npx prisma migrate dev

### 5. Run Development Server

npm run dev

Open:

http://localhost:3000

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

## 📌 Status

🚧 In active development.
