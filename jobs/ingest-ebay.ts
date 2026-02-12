import { normalizeEbayListing } from '@/lib/normalization';
import type { EbayItemSummary } from '@/lib/ebay';

export async function ingestEbayListings(): Promise<void> {
  const demoPayload: EbayItemSummary = {
    itemId: 'demo-1',
    title: 'Pikachu Illustrator Promo',
    price: { value: '999.99', currency: 'USD' },
    soldDate: new Date().toISOString()
  };

  const normalized = normalizeEbayListing(demoPayload);
  if (!normalized) {
    throw new Error('Failed to normalize demo listing payload');
  }

  console.info('Normalized listing prepared for upsert', normalized.externalId);
}
