'use client';

import { useMemo, useState } from 'react';
import { CardMetric, CardSortOption } from '@/types/packs';
import { formatPercent, formatUsd } from '@/utils/format';

const sorters: Record<CardSortOption, (a: CardMetric, b: CardMetric) => number> = {
  evContribution: (a, b) => b.weightedContribution - a.weightedContribution,
  marketPrice: (a, b) => b.marketPrice - a.marketPrice,
  rarity: (a, b) => a.rarity.localeCompare(b.rarity),
  alphabetical: (a, b) => a.name.localeCompare(b.name),
  pullRate: (a, b) => b.pullRate - a.pullRate
};

export function CardTable({ cards }: { cards: CardMetric[] }): JSX.Element {
  const [sortBy, setSortBy] = useState<CardSortOption>('evContribution');

  const sortedCards = useMemo(() => [...cards].sort(sorters[sortBy]), [cards, sortBy]);

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tracked cards</h2>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as CardSortOption)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="evContribution">EV contribution</option>
          <option value="marketPrice">Market price</option>
          <option value="rarity">Rarity</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="pullRate">Pull rate</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">Card</th>
              <th className="py-2">#</th>
              <th className="py-2">Rarity</th>
              <th className="py-2">Market</th>
              <th className="py-2">Pull rate</th>
              <th className="py-2">Weighted EV</th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map((card) => (
              <tr key={card.id} className="border-t border-slate-800">
                <td className="py-2">
                  <div className="font-medium">{card.name}</div>
                  <div className="text-xs text-slate-400">{card.specialTag ?? card.subset ?? 'Base pool'}</div>
                </td>
                <td>{card.cardNumber}</td>
                <td>{card.rarity}</td>
                <td>{formatUsd(card.marketPrice)}</td>
                <td>
                  {formatPercent(card.pullRate)}
                  {card.isEstimatedPullRate && <span className="ml-2 text-xs text-amber-300">estimated</span>}
                </td>
                <td>{formatUsd(card.weightedContribution)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
