import { describe, expect, it } from 'vitest';
import { normalizeEbayListing } from '@/lib/normalization';

describe('normalizeEbayListing', () => {
  it('normalizes valid payload and keeps raw payload', () => {
    const payload = {
      itemId: 'abc123',
      title: '  Charizard EX  ',
      price: { value: '120.50', currency: 'USD' },
      soldDate: '2026-01-01T00:00:00.000Z'
    };

    const normalized = normalizeEbayListing(payload);

    expect(normalized).not.toBeNull();
    if (!normalized) {
      throw new Error('Expected normalized payload to be defined');
    }

    expect(normalized.externalId).toBe('abc123');
    expect(normalized.title).toBe('Charizard EX');
    expect(normalized.price).toBe(120.5);
    expect(normalized.rawPayload).toEqual(payload);
  });

  it('returns null for invalid sold price', () => {
    const payload = {
      itemId: 'abc124',
      title: 'Invalid price card',
      price: { value: 'abc', currency: 'USD' },
      soldDate: '2026-01-01T00:00:00.000Z'
    };

    expect(normalizeEbayListing(payload)).toBeNull();
  });

  it('returns null when required fields are missing', () => {
    const payload = {
      itemId: 'abc125',
      title: 'Missing price listing'
    };

    expect(normalizeEbayListing(payload)).toBeNull();
  });
});
