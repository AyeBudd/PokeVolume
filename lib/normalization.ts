export type EbayListingPayload = {
  id: string;
  title: string;
  soldPrice: { value: string; currency: string };
  soldDate: string;
  setName?: string;
  pokemonName?: string;
};

export type NormalizedSale = {
  externalId: string;
  title: string;
  price: number;
  currency: string;
  saleDate: Date;
  setName: string | null;
  pokemonName: string | null;
  ingestedAt: Date;
  rawPayload: EbayListingPayload;
};

export const normalizeEbayListing = (payload: EbayListingPayload): NormalizedSale => {
  const parsedPrice = Number(payload.soldPrice.value);

  if (!Number.isFinite(parsedPrice)) {
    throw new Error('Invalid sold price in payload');
  }

  return {
    externalId: payload.id,
    title: payload.title.trim(),
    price: parsedPrice,
    currency: payload.soldPrice.currency,
    saleDate: new Date(payload.soldDate),
    setName: payload.setName?.trim() ?? null,
    pokemonName: payload.pokemonName?.trim() ?? null,
    ingestedAt: new Date(),
    rawPayload: payload
  };
};
