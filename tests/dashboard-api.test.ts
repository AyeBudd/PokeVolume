import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/dashboard/route';

describe('GET /api/dashboard', () => {
  it('returns dashboard metrics payload', async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.source).toBe('mock-seed');
    expect(payload.metrics.dailyVolume.length).toBeGreaterThan(0);
    expect(payload.metrics.trendingPokemon.length).toBeGreaterThan(0);
  });
});
