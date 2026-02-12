-- Materialized analytics views for market volume and trend detection.
-- Run this file against PostgreSQL after base tables are present.

BEGIN;

DROP MATERIALIZED VIEW IF EXISTS mv_daily_volume CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_daily_volume_7d_rolling CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_trending_pokemon CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_trending_sets CASCADE;

-- 1) Daily market volume.
CREATE MATERIALIZED VIEW mv_daily_volume AS
SELECT
  sale_date::date AS sale_day,
  COUNT(*)::bigint AS sales_count,
  SUM(price)::numeric(18, 2) AS total_volume,
  AVG(price)::numeric(18, 2) AS avg_sale_price
FROM normalized_sales
GROUP BY sale_date::date;

CREATE UNIQUE INDEX mv_daily_volume_sale_day_idx
  ON mv_daily_volume (sale_day);

-- 2) Daily market volume with trailing 7-day rolling volume.
CREATE MATERIALIZED VIEW mv_daily_volume_7d_rolling AS
SELECT
  sale_day,
  sales_count,
  total_volume,
  avg_sale_price,
  SUM(total_volume) OVER (
    ORDER BY sale_day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  )::numeric(18, 2) AS rolling_7d_volume,
  SUM(sales_count) OVER (
    ORDER BY sale_day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  )::bigint AS rolling_7d_sales_count
FROM mv_daily_volume;

CREATE UNIQUE INDEX mv_daily_volume_7d_rolling_sale_day_idx
  ON mv_daily_volume_7d_rolling (sale_day);

-- 3) Top trending Pokémon using velocity delta:
--    velocity delta = current 7d sales count - previous 7d sales count.
CREATE MATERIALIZED VIEW mv_trending_pokemon AS
WITH daily AS (
  SELECT
    sale_date::date AS sale_day,
    pokemon_id,
    COUNT(*)::bigint AS day_sales_count,
    SUM(price)::numeric(18, 2) AS day_volume
  FROM normalized_sales
  WHERE pokemon_id IS NOT NULL
  GROUP BY sale_date::date, pokemon_id
),
rolling AS (
  SELECT
    sale_day,
    pokemon_id,
    SUM(day_sales_count) OVER (
      PARTITION BY pokemon_id
      ORDER BY sale_day
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )::bigint AS rolling_7d_sales_count,
    SUM(day_volume) OVER (
      PARTITION BY pokemon_id
      ORDER BY sale_day
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )::numeric(18, 2) AS rolling_7d_volume,
    SUM(day_sales_count) OVER (
      PARTITION BY pokemon_id
      ORDER BY sale_day
      ROWS BETWEEN 13 PRECEDING AND 7 PRECEDING
    )::bigint AS previous_7d_sales_count,
    SUM(day_volume) OVER (
      PARTITION BY pokemon_id
      ORDER BY sale_day
      ROWS BETWEEN 13 PRECEDING AND 7 PRECEDING
    )::numeric(18, 2) AS previous_7d_volume
  FROM daily
)
SELECT
  sale_day,
  pokemon_id,
  rolling_7d_sales_count,
  rolling_7d_volume,
  COALESCE(previous_7d_sales_count, 0) AS previous_7d_sales_count,
  COALESCE(previous_7d_volume, 0)::numeric(18, 2) AS previous_7d_volume,
  (rolling_7d_sales_count - COALESCE(previous_7d_sales_count, 0))::bigint AS velocity_delta_sales,
  (rolling_7d_volume - COALESCE(previous_7d_volume, 0))::numeric(18, 2) AS velocity_delta_volume
FROM rolling;

CREATE INDEX mv_trending_pokemon_sale_day_velocity_idx
  ON mv_trending_pokemon (sale_day, velocity_delta_sales DESC);

CREATE UNIQUE INDEX mv_trending_pokemon_day_pokemon_idx
  ON mv_trending_pokemon (sale_day, pokemon_id);

-- 4) Top trending sets using same velocity-delta definition.
CREATE MATERIALIZED VIEW mv_trending_sets AS
WITH daily AS (
  SELECT
    sale_date::date AS sale_day,
    set_id,
    COUNT(*)::bigint AS day_sales_count,
    SUM(price)::numeric(18, 2) AS day_volume
  FROM normalized_sales
  WHERE set_id IS NOT NULL
  GROUP BY sale_date::date, set_id
),
rolling AS (
  SELECT
    sale_day,
    set_id,
    SUM(day_sales_count) OVER (
      PARTITION BY set_id
      ORDER BY sale_day
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )::bigint AS rolling_7d_sales_count,
    SUM(day_volume) OVER (
      PARTITION BY set_id
      ORDER BY sale_day
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )::numeric(18, 2) AS rolling_7d_volume,
    SUM(day_sales_count) OVER (
      PARTITION BY set_id
      ORDER BY sale_day
      ROWS BETWEEN 13 PRECEDING AND 7 PRECEDING
    )::bigint AS previous_7d_sales_count,
    SUM(day_volume) OVER (
      PARTITION BY set_id
      ORDER BY sale_day
      ROWS BETWEEN 13 PRECEDING AND 7 PRECEDING
    )::numeric(18, 2) AS previous_7d_volume
  FROM daily
)
SELECT
  sale_day,
  set_id,
  rolling_7d_sales_count,
  rolling_7d_volume,
  COALESCE(previous_7d_sales_count, 0) AS previous_7d_sales_count,
  COALESCE(previous_7d_volume, 0)::numeric(18, 2) AS previous_7d_volume,
  (rolling_7d_sales_count - COALESCE(previous_7d_sales_count, 0))::bigint AS velocity_delta_sales,
  (rolling_7d_volume - COALESCE(previous_7d_volume, 0))::numeric(18, 2) AS velocity_delta_volume
FROM rolling;

CREATE INDEX mv_trending_sets_sale_day_velocity_idx
  ON mv_trending_sets (sale_day, velocity_delta_sales DESC);

CREATE UNIQUE INDEX mv_trending_sets_day_set_idx
  ON mv_trending_sets (sale_day, set_id);

COMMIT;
