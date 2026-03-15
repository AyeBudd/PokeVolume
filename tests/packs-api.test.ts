import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/pack-data', () => ({
  getPackMetrics: vi.fn(async () => [{ id: '1', slug: 'pack', packName: 'Pack', setName: 'Set', era: 'Era', summary: 'S', releaseDate: new Date().toISOString(), sources: [], packCost: 4, expectedValue: 5, valuePerPack: 1.2, averageHitValue: 2, chaseCardValue: 10, pullValueRatio: 0.1, costEfficiencyScore: 90, bestChaseCardName: 'Card', medianCardValue: 1, roiSignal: 'Undervalued', cards: [] }])
}));

import { GET } from '@/app/api/packs/route';

describe('GET /api/packs', () => {
  it('returns generated payload for packs', async () => {
    const request = new Request('http://localhost:3000/api/packs?sort=valuePerPack');
    const response = await GET(request as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.generatedAt).toBeTypeOf('string');
    expect(payload.packs.length).toBe(1);
  });
});
