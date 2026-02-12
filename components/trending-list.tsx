import { TrendEntity } from '@/lib/types';

type TrendingListProps = {
  title: string;
  entities: TrendEntity[];
};

export function TrendingList({ title, entities }: TrendingListProps): JSX.Element {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <ul className="space-y-3">
        {entities.map((entity) => (
          <li key={entity.name} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-b-0">
            <span>{entity.name}</span>
            <div className="text-right text-sm">
              <p className="text-emerald-300">+{entity.changePct}%</p>
              <p className="text-slate-400">${entity.volume.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
