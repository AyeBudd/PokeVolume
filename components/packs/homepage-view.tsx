'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PackMetric, SortOption } from '@/types/packs';
import { formatDate, formatUsd } from '@/utils/format';

const sortFns: Record<SortOption, (a: PackMetric, b: PackMetric) => number> = {
  valuePerPack: (a, b) => b.valuePerPack - a.valuePerPack,
  packCost: (a, b) => a.packCost - b.packCost,
  releaseDate: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  alphabetical: (a, b) => a.packName.localeCompare(b.packName)
};

export function HomepageView({ initialPacks }: { initialPacks: PackMetric[] }): JSX.Element {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('valuePerPack');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'EBAY' | 'POKEMON_CENTER'>('ALL');

  const filteredPacks = useMemo(() => {
    return initialPacks
      .filter((pack) => {
        const matchesQuery = `${pack.packName} ${pack.setName}`.toLowerCase().includes(query.toLowerCase());
        const matchesSource =
          sourceFilter === 'ALL' ? true : pack.sources.some((source) => source.source === sourceFilter);
        return matchesQuery && matchesSource;
      })
      .sort(sortFns[sortBy]);
  }, [initialPacks, query, sortBy, sourceFilter]);

  const highestCostPackId = filteredPacks.length
    ? filteredPacks.reduce((highest, pack) => (pack.packCost > highest.packCost ? pack : highest), filteredPacks[0]).id
    : '';

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search packs or sets"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="valuePerPack">Value per pack</option>
          <option value="packCost">Cost of pack</option>
          <option value="releaseDate">Release date</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'EBAY', 'POKEMON_CENTER'].map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setSourceFilter(source as 'ALL' | 'EBAY' | 'POKEMON_CENTER')}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                sourceFilter === source ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-200'
              }`}
            >
              {source === 'POKEMON_CENTER' ? 'Pokémon Center' : source}
            </button>
          ))}
        </div>
      </div>

      {filteredPacks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-300">
          No packs match your filters yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPacks.map((pack) => (
            <article key={pack.id} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{pack.packName}</h2>
                  <p className="text-sm text-slate-400">{pack.setName}</p>
                </div>
                {pack.id === highestCostPackId && (
                  <span className="rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-300">Highest cost</span>
                )}
              </div>
              <p className="mb-3 text-xs text-slate-400">Released {formatDate(pack.releaseDate)}</p>
              <p className="mb-3 text-sm text-slate-300">{pack.summary}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {pack.sources.map((source) => (
                  <span key={source.source} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">
                    {source.source === 'POKEMON_CENTER' ? 'Pokémon Center' : 'eBay'}
                  </span>
                ))}
                {pack.valuePerPack >= 1 && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Best value</span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-slate-400">Pack cost</dt>
                  <dd>{formatUsd(pack.packCost)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Expected value</dt>
                  <dd>{formatUsd(pack.expectedValue)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Value / pack</dt>
                  <dd>{pack.valuePerPack.toFixed(2)}x</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Chase card</dt>
                  <dd>{formatUsd(pack.chaseCardValue)}</dd>
                </div>
              </dl>

              <Link href={`/packs/${pack.slug}`} className="mt-4 rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-black">
                View pack analysis
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
