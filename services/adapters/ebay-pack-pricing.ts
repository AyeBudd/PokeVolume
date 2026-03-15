export type PackPriceSnapshot = {
  externalId: string;
  title: string;
  price: number;
  currency: 'USD';
  listingUrl: string;
  fetchedAt: string;
  rawPayload: Record<string, unknown>;
};

export const fetchEbayPackPricing = async (_query: string): Promise<PackPriceSnapshot[]> => {
  return [];
};
