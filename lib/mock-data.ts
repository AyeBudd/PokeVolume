import { MarketPoint, TrendEntity } from './types';

export const mockDailyVolume: MarketPoint[] = [
  { date: '2026-01-14', volume: 10250, salesCount: 181 },
  { date: '2026-01-15', volume: 11870, salesCount: 197 },
  { date: '2026-01-16', volume: 12340, salesCount: 209 },
  { date: '2026-01-17', volume: 13220, salesCount: 227 },
  { date: '2026-01-18', volume: 12950, salesCount: 224 },
  { date: '2026-01-19', volume: 14180, salesCount: 242 },
  { date: '2026-01-20', volume: 14890, salesCount: 261 },
  { date: '2026-01-21', volume: 15220, salesCount: 266 },
  { date: '2026-01-22', volume: 14680, salesCount: 248 },
  { date: '2026-01-23', volume: 15730, salesCount: 274 },
  { date: '2026-01-24', volume: 16360, salesCount: 281 },
  { date: '2026-01-25', volume: 16840, salesCount: 294 },
  { date: '2026-01-26', volume: 17150, salesCount: 301 },
  { date: '2026-01-27', volume: 17990, salesCount: 313 }
];

export const mockTrendingPokemon: TrendEntity[] = [
  { name: 'Pikachu', changePct: 18.2, volume: 21900 },
  { name: 'Charizard', changePct: 15.7, volume: 29800 },
  { name: 'Mewtwo', changePct: 12.3, volume: 16750 },
  { name: 'Gengar', changePct: 9.8, volume: 13120 }
];

export const mockTrendingSets: TrendEntity[] = [
  { name: 'Prismatic Evolutions', changePct: 22.1, volume: 44600 },
  { name: '151', changePct: 16.4, volume: 36900 },
  { name: 'Paldean Fates', changePct: 11.2, volume: 28400 },
  { name: 'Lost Origin', changePct: 8.6, volume: 22340 }
];
