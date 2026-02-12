export type MarketPoint = {
  date: string;
  volume: number;
  salesCount: number;
};

export type TrendEntity = {
  name: string;
  changePct: number;
  volume: number;
};

export type DashboardMetrics = {
  totalVolume: number;
  sevenDayVolume: number;
  thirtyDayVolume: number;
  sevenDayTrendPct: number;
  thirtyDayTrendPct: number;
  dailyVolume: MarketPoint[];
  trendingPokemon: TrendEntity[];
  trendingSets: TrendEntity[];
};
