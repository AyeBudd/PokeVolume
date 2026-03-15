import { NextResponse } from 'next/server';
import { getPackMetrics } from '@/lib/pack-data';
import { SortOption } from '@/types/packs';

const isSortOption = (value: string): value is SortOption =>
  ['valuePerPack', 'packCost', 'releaseDate', 'alphabetical'].includes(value);

export async function GET(request: Request): Promise<NextResponse> {
  const sort = new URL(request.url).searchParams.get('sort') ?? 'valuePerPack';
  const packs = await getPackMetrics(isSortOption(sort) ? sort : 'valuePerPack');

  return NextResponse.json({ generatedAt: new Date().toISOString(), packs });
}
