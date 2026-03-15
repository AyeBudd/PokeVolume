import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { fetchEbayPackPricing } from '@/services/adapters/ebay-pack-pricing';

export const ingestEbaySoldListings = async (): Promise<{ inserted: number }> => {
  const snapshots = await fetchEbayPackPricing('pokemon booster pack');

  for (const snapshot of snapshots) {
    const pack = await prisma.pack.findFirst({ where: { name: { contains: snapshot.title, mode: 'insensitive' } } });
    if (!pack) {
      continue;
    }

    await prisma.sourceListing.upsert({
      where: {
        source_externalId: {
          source: 'EBAY',
          externalId: snapshot.externalId
        }
      },
      update: {
        title: snapshot.title,
        listingUrl: snapshot.listingUrl,
        price: snapshot.price,
        fetchedAt: new Date(snapshot.fetchedAt),
        rawPayload: snapshot.rawPayload as Prisma.InputJsonValue
      },
      create: {
        packId: pack.id,
        source: 'EBAY',
        externalId: snapshot.externalId,
        title: snapshot.title,
        listingUrl: snapshot.listingUrl,
        price: snapshot.price,
        confidenceScore: 0.9,
        rawPayload: snapshot.rawPayload as Prisma.InputJsonValue,
        fetchedAt: new Date(snapshot.fetchedAt)
      }
    });
  }

  return { inserted: snapshots.length };
};
