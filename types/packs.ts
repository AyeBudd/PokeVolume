export type PackSourceKey = 'EBAY' | 'POKEMON_CENTER';

export type SortOption = 'valuePerPack' | 'packCost' | 'releaseDate' | 'alphabetical';
export type CardSortOption = 'evContribution' | 'marketPrice' | 'rarity' | 'alphabetical' | 'pullRate';

export type SourceAvailability = {
  source: PackSourceKey;
  price: number;
  listingUrl: string;
};

export type CardMetric = {
  id: string;
  name: string;
  cardNumber: string;
  rarity: string;
  subset?: string | null;
  specialTag?: string | null;
  imageUrl?: string | null;
  marketPrice: number;
  pullRate: number;
  isEstimatedPullRate: boolean;
  weightedContribution: number;
};

export type PackMetric = {
  id: string;
  slug: string;
  packName: string;
  setName: string;
  era: string;
  summary: string;
  imageUrl?: string | null;
  releaseDate: string;
  sources: SourceAvailability[];
  packCost: number;
  expectedValue: number;
  valuePerPack: number;
  averageHitValue: number;
  chaseCardValue: number;
  pullValueRatio: number;
  costEfficiencyScore: number;
  bestChaseCardName: string;
  medianCardValue: number;
  roiSignal: 'Undervalued' | 'Fair' | 'Overpriced';
  cards: CardMetric[];
};
