import { PackMetric } from '@/types/packs';

export const fallbackPackMetrics: PackMetric[] = [
  {
    id: 'fallback-151',
    slug: '151-booster-pack',
    packName: 'Pokémon 151 Booster Pack',
    setName: '151',
    era: 'Scarlet & Violet',
    summary: 'Collector favorite with strong nostalgia demand.',
    releaseDate: '2023-09-22T00:00:00.000Z',
    sources: [
      { source: 'EBAY', price: 11.5, listingUrl: 'https://www.ebay.com' },
      { source: 'POKEMON_CENTER', price: 8.99, listingUrl: 'https://www.pokemoncenter.com' }
    ],
    packCost: 8.99,
    expectedValue: 10.74,
    valuePerPack: 1.19,
    averageHitValue: 43.6,
    chaseCardValue: 94,
    pullValueRatio: 0.07,
    costEfficiencyScore: 119,
    bestChaseCardName: 'Mew ex',
    medianCardValue: 34,
    roiSignal: 'Undervalued',
    cards: [
      { id: 'c1', name: 'Mew ex', cardNumber: '205/165', rarity: 'Special Illustration Rare', marketPrice: 94, pullRate: 0.005, isEstimatedPullRate: false, weightedContribution: 0.47 },
      { id: 'c2', name: 'Pikachu ex', cardNumber: '198/165', rarity: 'Special Illustration Rare', marketPrice: 82, pullRate: 0.0045, isEstimatedPullRate: false, weightedContribution: 0.37 }
    ]
  }
];
