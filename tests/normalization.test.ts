import { describe, expect, it } from 'vitest';
import { normalizeEbayListing } from '@/lib/normalization';

describe('normalizeEbayListing', () => {
  it('normalizes valid payload and keeps raw payload', () => {
    const payload = {
      id: 'abc123',
      title: '  Charizard EX  ',
      soldPrice: { value: '120.50', currency: 'USD' },
      soldDate: '2026-01-01T00:00:00.000Z',
      setName: '151',
      pokemonName: 'Charizard'
    };

    const normalized = normalizeEbayListing(payload);

    expect(normalized.externalId).toBe('abc123');
    expect(normalized.title).toBe('Charizard EX');
    expect(normalized.price).toBe(120.5);
    expect(normalized.rawPayload).toEqual(payload);
  });

  it('throws for invalid sold price', () => {
    const payload = {
      id: 'abc124',
      title: 'Invalid price card',
      soldPrice: { value: 'abc', currency: 'USD' },
      soldDate: '2026-01-01T00:00:00.000Z'
    };

    expect(() => normalizeEbayListing(payload)).toThrow('Invalid sold price in payload');
  });
});
