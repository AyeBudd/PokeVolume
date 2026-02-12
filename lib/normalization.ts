import type { EbayItemSummary } from "./ebay.js";

export interface NormalizedListing {
  externalListingId: string;
  title: string;
  saleDate: Date;
  price: number;
  currency: string;
  quantity: number;
  condition?: string;
  pokemonName: string;
  setName: string;
  cardName: string;
}

const POKEMON_NAMES = [
  "Pikachu",
  "Charizard",
  "Mew",
  "Mewtwo",
  "Eevee",
  "Gengar",
  "Squirtle",
  "Bulbasaur",
] as const;

const SET_HINTS = [
  "Base Set",
  "Jungle",
  "Fossil",
  "Team Rocket",
  "Evolving Skies",
  "151",
  "Paldean Fates",
  "Crown Zenith",
] as const;

export const inferPokemonFromTitle = (title: string): string => {
  const found = POKEMON_NAMES.find((name) =>
    title.toLowerCase().includes(name.toLowerCase()),
  );

  return found ?? "Unknown Pokemon";
};

export const inferSetFromTitle = (title: string): string => {
  const found = SET_HINTS.find((setName) =>
    title.toLowerCase().includes(setName.toLowerCase()),
  );

  return found ?? "Unknown Set";
};

export const normalizeEbayItem = (item: EbayItemSummary): NormalizedListing | null => {
  if (!item.itemId || !item.title || !item.price?.value || !item.price.currency) {
    return null;
  }

  const parsedPrice = Number(item.price.value);
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return null;
  }

  const saleDate = item.soldDate ? new Date(item.soldDate) : new Date();

  return {
    externalListingId: item.itemId,
    title: item.title,
    saleDate,
    price: parsedPrice,
    currency: item.price.currency,
    quantity: 1,
    condition: item.condition,
    pokemonName: inferPokemonFromTitle(item.title),
    setName: inferSetFromTitle(item.title),
    cardName: item.title,
  };
};
