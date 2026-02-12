import { MarketChart } from '@/components/market-chart';
import { MetricsCards } from '@/components/metrics-cards';
import { TrendingList } from '@/components/trending-list';
import { getDashboardMetrics } from '@/lib/analytics';

export default function DashboardPage(): JSX.Element {
  const metrics = getDashboardMetrics();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">PokeVolume Market Dashboard</h1>
        <p className="mt-1 text-slate-400">Server-rendered analytics with mock seed data for local development.</p>
      </header>

      <MetricsCards metrics={metrics} />
      <MarketChart data={metrics.dailyVolume} />

      <div className="grid gap-4 md:grid-cols-2">
        <TrendingList title="Trending Pokémon" entities={metrics.trendingPokemon} />
        <TrendingList title="Trending Sets" entities={metrics.trendingSets} />
      </div>
    </main>
  );
}
