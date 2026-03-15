export type CardPriceSnapshot = {
  cardSlug: string;
  price: number;
  currency: 'USD';
  fetchedAt: string;
  sourceName: string;
};

export const fetchCardMarketPricing = async (): Promise<CardPriceSnapshot[]> => {
  return [];
};
