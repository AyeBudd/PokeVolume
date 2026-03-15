import { CardMetric } from '@/types/packs';

const rarityFallbackRates: Record<string, number> = {
  'Hyper Rare': 0.0025,
  'Special Illustration Rare': 0.004,
  'Illustration Rare': 0.012,
  'Ultra Rare': 0.018,
  Rare: 0.05,
  'Double Rare': 0.028,
  Uncommon: 0.1,
  Common: 0.2
};

const round = (value: number): number => Number(value.toFixed(2));

export const getFallbackPullRate = (rarity: string): number => rarityFallbackRates[rarity] ?? 0.01;

export const calculateExpectedValue = (cards: CardMetric[]): number =>
  round(cards.reduce((sum, card) => sum + card.weightedContribution, 0));

export const calculateMedian = (cards: CardMetric[]): number => {
  const sorted = cards.map((card) => card.marketPrice).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return 0;
  }

  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return round((sorted[midpoint - 1] + sorted[midpoint]) / 2);
  }

  return round(sorted[midpoint]);
};

export const getRoiSignal = (valuePerPack: number): 'Undervalued' | 'Fair' | 'Overpriced' => {
  if (valuePerPack >= 1.1) {
    return 'Undervalued';
  }

  if (valuePerPack >= 0.85) {
    return 'Fair';
  }

  return 'Overpriced';
};
