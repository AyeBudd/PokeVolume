import { prisma } from '@/lib/prisma';
import { fallbackPackMetrics } from '@/lib/fallback-data';
import { calculateExpectedValue, calculateMedian, getFallbackPullRate, getRoiSignal } from '@/lib/ev';
import { CardMetric, PackMetric, SortOption } from '@/types/packs';

const sorters: Record<SortOption, (a: PackMetric, b: PackMetric) => number> = {
  valuePerPack: (a, b) => b.valuePerPack - a.valuePerPack,
  packCost: (a, b) => a.packCost - b.packCost,
  releaseDate: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  alphabetical: (a, b) => a.packName.localeCompare(b.packName)
};

const round = (value: number): number => Number(value.toFixed(2));

export const getPackMetrics = async (sortBy: SortOption = 'valuePerPack'): Promise<PackMetric[]> => {
  try {
    const packs = await prisma.pack.findMany({
    include: {
      set: true,
      prices: { orderBy: { fetchedAt: 'desc' } },
      sourceListings: { where: { isInStock: true }, orderBy: { fetchedAt: 'desc' } },
      cards: {
        include: {
          card: {
            include: {
              prices: { orderBy: { fetchedAt: 'desc' } },
              pullRates: true
            }
          }
        }
      }
    }
  });

  const metrics = packs.map((pack) => {
    const sourcePriceMap = new Map<string, { price: number; listingUrl: string }>();

    for (const listing of pack.sourceListings) {
      const current = sourcePriceMap.get(listing.source);
      const listingPrice = Number(listing.price);
      if (!current || listingPrice < current.price) {
        sourcePriceMap.set(listing.source, {
          price: listingPrice,
          listingUrl: listing.listingUrl
        });
      }
    }

    if (sourcePriceMap.size === 0) {
      for (const price of pack.prices) {
        if (!sourcePriceMap.has(price.source)) {
          sourcePriceMap.set(price.source, { price: Number(price.price), listingUrl: '#' });
        }
      }
    }

    const sources = Array.from(sourcePriceMap.entries()).map(([source, data]) => ({ source, ...data })) as PackMetric['sources'];
    const packCost = sources.length ? Math.min(...sources.map((source) => source.price)) : 0;

    const cards: CardMetric[] = pack.cards.map((packCard) => {
      const latestCardPrice = packCard.card.prices[0];
      const pullRateRow = packCard.card.pullRates.find((row) => row.packId === pack.id);
      const pullRate = pullRateRow ? Number(pullRateRow.probability) : getFallbackPullRate(packCard.card.rarity);
      const marketPrice = latestCardPrice ? Number(latestCardPrice.price) : 0;

      return {
        id: packCard.card.id,
        name: packCard.card.name,
        cardNumber: packCard.card.cardNumber,
        rarity: packCard.card.rarity,
        subset: packCard.card.subset,
        specialTag: packCard.card.specialTag,
        imageUrl: packCard.card.imageUrl,
        marketPrice,
        pullRate,
        isEstimatedPullRate: pullRateRow ? pullRateRow.isEstimated : true,
        weightedContribution: round(marketPrice * pullRate)
      };
    });

    cards.sort((a, b) => b.weightedContribution - a.weightedContribution);

    const expectedValue = calculateExpectedValue(cards);
    const valuePerPack = packCost ? round(expectedValue / packCost) : 0;
    const chaseCardValue = cards.length ? Math.max(...cards.map((card) => card.marketPrice)) : 0;
    const averageHitValue = cards.length ? round(cards.reduce((sum, card) => sum + card.marketPrice, 0) / cards.length) : 0;
    const pullValueRatio = cards.length ? round(cards.reduce((sum, card) => sum + card.pullRate, 0)) : 0;
    const costEfficiencyScore = round(valuePerPack * 100);
    const bestCard = cards.length ? cards.reduce((best, card) => (card.marketPrice > best.marketPrice ? card : best), cards[0]) : null;

    return {
      id: pack.id,
      slug: pack.slug,
      packName: pack.name,
      setName: pack.set.name,
      era: pack.set.era,
      summary: pack.summary,
      imageUrl: pack.imageUrl,
      releaseDate: pack.releaseDate.toISOString(),
      sources,
      packCost,
      expectedValue,
      valuePerPack,
      averageHitValue,
      chaseCardValue,
      pullValueRatio,
      costEfficiencyScore,
      bestChaseCardName: bestCard?.name ?? 'N/A',
      medianCardValue: calculateMedian(cards),
      roiSignal: getRoiSignal(valuePerPack),
      cards
    };
  });

    return metrics.sort(sorters[sortBy]);
  } catch (error) {
    console.warn('Falling back to seeded in-memory pack metrics.', error);
    return [...fallbackPackMetrics].sort(sorters[sortBy]);
  }
};

export const getPackBySlug = async (slug: string): Promise<PackMetric | null> => {
  const packs = await getPackMetrics('valuePerPack');
  return packs.find((pack) => pack.slug === slug) ?? null;
};
