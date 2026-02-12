import { DashboardMetrics } from '@/lib/types';

type MetricsCardsProps = {
  metrics: DashboardMetrics;
};

export function MetricsCards({ metrics }: MetricsCardsProps): JSX.Element {
  const cards = [
    { label: 'Total Market Volume', value: `$${metrics.totalVolume.toLocaleString()}` },
    { label: '7 Day Volume', value: `$${metrics.sevenDayVolume.toLocaleString()}`, change: `${metrics.sevenDayTrendPct}%` },
    { label: '30 Day Volume', value: `$${metrics.thirtyDayVolume.toLocaleString()}`, change: `${metrics.thirtyDayTrendPct}%` }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          {card.change ? <p className="mt-1 text-sm text-emerald-300">{card.change}</p> : null}
        </article>
      ))}
    </div>
  );
}
