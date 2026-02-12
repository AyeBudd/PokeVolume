# PokeVolume -- Product Requirements Document (MVP v1)

## 1. Product Overview

PokeVolume is a market intelligence platform for Pokémon card sales
data.

It aggregates sold listing data from marketplaces (starting with eBay),
normalizes it, and presents:

-   Total market volume
-   Liquidity trends
-   Price movement
-   Trending Pokémon characters
-   Trending sets
-   Set-level "hit value" analytics

Long-term vision: Become the Bloomberg Terminal for Pokémon
collectibles.

------------------------------------------------------------------------

## 2. Target Users

-   Serious collectors
-   Flippers
-   Long-term sealed investors
-   Pokémon content creators
-   Data-driven hobbyists

------------------------------------------------------------------------

## 3. MVP Scope (Phase 1)

### Data Source

-   eBay Sold Listings (via official API)

### Core Features

#### Market Dashboard

-   Daily total sales volume (\$)
-   Number of items sold
-   7-day and 30-day volume trends
-   Median sale price movement

#### Trending Pokémon

-   Top 10 Pokémon by sales velocity increase (7-day delta)
-   Top 10 Pokémon by total dollar volume

#### Trending Sets

-   Top 10 sets by volume growth
-   Set-level liquidity score

#### Basic Card Valuation

For each card: - 30-day average sale price - 7-day average sale price -
Volume count - Volatility metric

------------------------------------------------------------------------

## 4. Future Features (Out of MVP Scope)

-   Pack Expected Value (EV) modeling
-   Hit probability modeling
-   PSA/BGS grading premium analytics
-   Cross-market arbitrage signals
-   Total circulating market cap estimation
-   Predictive modeling using ML

------------------------------------------------------------------------

## 5. Key Metrics (KPIs)

-   Total Market Volume (Daily / Weekly / Monthly)
-   Median Card Price Index
-   Set Liquidity Index
-   Velocity Score (sales acceleration rate)
-   Heat Score (volume × volatility)

------------------------------------------------------------------------

## 6. Data Model (High Level)

Entities:

-   sources
-   listings
-   sales
-   cards
-   sets
-   pokemon
-   series

Relationships:

-   Listing belongs to Source
-   Listing maps to Card
-   Card belongs to Set
-   Set belongs to Series
-   Card references Pokémon character

------------------------------------------------------------------------

## 7. Definition of Done (MVP)

-   Live ingestion of eBay sold listings
-   Postgres database storing normalized sales
-   Dashboard displaying:
    -   Daily total volume
    -   Top trending Pokémon
    -   Top trending sets
-   Deployed to a staging environment
-   README includes local setup instructions
