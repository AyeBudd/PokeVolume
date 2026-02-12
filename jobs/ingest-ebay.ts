import { normalizeEbayListing } from '@/lib/normalization';

export async function ingestEbayListings(): Promise<void> {
  const demoPayload = {
    id: 'demo-1',
    title: 'Pikachu Illustrator Promo',
    soldPrice: { value: '999.99', currency: 'USD' },
    soldDate: new Date().toISOString(),
    setName: 'Promo',
    pokemonName: 'Pikachu'
  };

  const normalized = normalizeEbayListing(demoPayload);
  console.info('Normalized listing prepared for upsert', normalized.externalId);
}
