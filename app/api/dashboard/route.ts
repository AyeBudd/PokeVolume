import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/analytics';

export async function GET(): Promise<NextResponse> {
  const metrics = getDashboardMetrics();

  return NextResponse.json({
    source: 'mock-seed',
    generatedAt: new Date().toISOString(),
    metrics
  });
}
