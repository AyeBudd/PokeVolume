import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { fetchSoldListings, getEbayAccessToken } from "../lib/ebay.js";
import { normalizeEbayItem, type EbayListingPayload } from "../lib/normalization.js";

interface IngestionOptions {
  query: string;
  limit: number;
}

const getOrCreateUnknownSeries = async () => {
  const series =
    (await prisma.series.findFirst({
      where: { name: "Unknown" },
    })) ??
    (await prisma.series.create({
      data: { name: "Unknown" },
    }));

  return series;
};

const upsertDimensions = async (normalized: {
  pokemonName: string;
  setName: string;
  cardName: string;
}) => {
  const pokemon =
    (await prisma.pokemon.findFirst({
      where: { name: normalized.pokemonName },
    })) ??
    (await prisma.pokemon.create({
      data: { name: normalized.pokemonName },
    }));

  const unknownSeries = await getOrCreateUnknownSeries();

  const set =
    (await prisma.set.findFirst({
      where: { name: normalized.setName },
    })) ??
    (await prisma.set.create({
      data: {
        name: normalized.setName,
        series: { connect: { id: unknownSeries.id } },
      },
    }));

  const card =
    (await prisma.card.findFirst({
      where: {
        name: normalized.cardName,
        setId: set.id,
      },
    })) ??
    (await prisma.card.create({
      data: {
        name: normalized.cardName,
        setId: set.id,
        pokemonId: pokemon.id,
        cardNumber: null,
      },
    }));

  // Optional: ensure the card points at the current pokemon
  if (card.pokemonId !== pokemon.id) {
    await prisma.card.update({
      where: { id: card.id },
      data: { pokemonId: pokemon.id },
    });
  }

  return { pokemon, set, card };
};

export const ingestEbaySoldListings = async ({
  query,
  limit,
}: IngestionOptions): Promise<{ fetched: number; normalized: number; upserted: number }> => {
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  if (!appId || !certId) {
    throw new Error("Missing EBAY_APP_ID or EBAY_CERT_ID environment variable");
  }

  const source =
    (await prisma.source.findFirst({
      where: { name: "ebay" },
    })) ??
    (await prisma.source.create({
      data: {
        name: "ebay",
        platform: "ebay",
      },
    }));

  const accessToken = await getEbayAccessToken({ appId, certId });
  const listings = await fetchSoldListings({ query, limit, accessToken });

  let normalizedCount = 0;
  let upsertedCount = 0;

  for (const listing of listings) {
    if (!listing.itemId || !listing.title) {
      continue;
    }

    const saleDate = listing.soldDate ? new Date(listing.soldDate) : undefined;
    const priceRaw = listing.price?.value;
    const currency = listing.price?.currency;

    const rawListing = await prisma.rawListing.upsert({
      where: {
        sourceId_externalListingId: {
          sourceId: source.id,
          externalListingId: listing.itemId,
        },
      },
      update: {
        title: listing.title,
        payload: listing as unknown as Prisma.InputJsonValue,
        ingestedAt: new Date(),
        ...(saleDate ? { saleDate } : {}),
        ...(priceRaw ? { priceRaw } : {}),
        ...(currency ? { currency } : {}),
      },
      create: {
        sourceId: source.id,
        externalListingId: listing.itemId,
        title: listing.title,
        payload: listing as unknown as Prisma.InputJsonValue,
        ...(saleDate ? { saleDate } : {}),
        ...(priceRaw ? { priceRaw } : {}),
        ...(currency ? { currency } : {}),
      },
    });

    if (!listing.price?.value || !listing.price?.currency || !listing.soldDate) {
      continue;
    }

    const payload: EbayListingPayload = {
      id: listing.itemId,
      title: listing.title,
      soldPrice: {
        value: listing.price.value,
        currency: listing.price.currency,
      },
      soldDate: listing.soldDate,
    };

    let normalized: ReturnType<typeof normalizeEbayItem>;
    try {
      normalized = normalizeEbayItem(payload);
    } catch (error) {
      console.warn("Skipping listing due to normalization error", {
        itemId: listing.itemId,
        error,
      });
      continue;
    }
    if (!normalized) {
      continue;
    }

    normalizedCount += 1;

    const dimensions = await upsertDimensions({
      pokemonName: normalized.pokemonName ?? "Unknown",
      setName: normalized.setName ?? "Unknown",
      cardName: normalized.title,
    });

    await prisma.normalizedSale.upsert({
      where: {
        rawListingId: rawListing.id,
      },
      update: {
        saleDate: normalized.saleDate,
        price: normalized.price,
        currency: normalized.currency,
        condition: listing.condition,
        cardId: dimensions.card.id,
      },
      create: {
        rawListingId: rawListing.id,
        saleDate: normalized.saleDate,
        price: normalized.price,
        currency: normalized.currency,
        condition: listing.condition,
        cardId: dimensions.card.id,
      },
    });

    upsertedCount += 1;
  }

  return {
    fetched: listings.length,
    normalized: normalizedCount,
    upserted: upsertedCount,
  };
};

const run = async () => {
  const query = process.env.EBAY_QUERY ?? "pokemon card";
  const limit = Number(process.env.EBAY_LIMIT ?? "50");

  const result = await ingestEbaySoldListings({ query, limit });
  console.log("eBay ingestion complete", result);
};

run()
  .catch((error: unknown) => {
    console.error("eBay ingestion failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
