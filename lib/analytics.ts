import { mockDailyVolume, mockTrendingPokemon, mockTrendingSets } from './mock-data';
import { DashboardMetrics, MarketPoint } from './types';

const sumVolume = (points: MarketPoint[]): number => points.reduce((acc, point) => acc + point.volume, 0);

const calculateTrendPct = (current: number, previous: number): number => {
  if (previous === 0) {
    return 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(2));
};

export const getDashboardMetrics = (): DashboardMetrics => {
  const totalVolume = sumVolume(mockDailyVolume);
  const last7 = mockDailyVolume.slice(-7);
  const prior7 = mockDailyVolume.slice(-14, -7);

  const sevenDayVolume = sumVolume(last7);
  const previousSevenDayVolume = sumVolume(prior7);

  const sevenDayTrendPct = calculateTrendPct(sevenDayVolume, previousSevenDayVolume);
  const thirtyDayVolume = totalVolume;
  const thirtyDayTrendPct = sevenDayTrendPct;

  return {
    totalVolume,
    sevenDayVolume,
    thirtyDayVolume,
    sevenDayTrendPct,
    thirtyDayTrendPct,
    dailyVolume: mockDailyVolume,
    trendingPokemon: mockTrendingPokemon,
    trendingSets: mockTrendingSets
  };
};
