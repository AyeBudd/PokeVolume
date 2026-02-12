import type { EbayItemSummary } from "./ebay";

export type NormalizedSale = {
  externalId: string;
  title: string;
  price: number;
  currency: string;
  saleDate: Date;
  condition: string | null;
  quantity: number;
  setName: string | null;
  pokemonName: string | null;
  ingestedAt: Date;
  rawPayload: EbayItemSummary;
};

export const normalizeEbayListing = (payload: EbayItemSummary): NormalizedSale | null => {
  if (!payload.price?.value || !payload.price.currency || !payload.soldDate) {
    return null;
  }

  const parsedPrice = Number(payload.price.value);

  if (!Number.isFinite(parsedPrice)) {
    return null;
  }

  return {
    externalId: payload.itemId,
    title: payload.title.trim(),
    price: parsedPrice,
    currency: payload.price.currency,
    saleDate: new Date(payload.soldDate),
    condition: payload.condition?.trim() ?? null,
    quantity: 1,
    setName: null,
    pokemonName: null,
    ingestedAt: new Date(),
    rawPayload: payload
  };
};

// 🔧 Add this line:
export const normalizeEbayItem = normalizeEbayListing;
