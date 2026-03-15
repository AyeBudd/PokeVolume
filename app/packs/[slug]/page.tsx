export const dynamic = "force-dynamic";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CardTable } from '@/components/packs/card-table';
import { getPackBySlug } from '@/lib/pack-data';
import { formatDate, formatUsd } from '@/utils/format';

export default async function PackDetailPage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  const pack = await getPackBySlug(params.slug);

  if (!pack) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
      <Link href="/" className="text-sm text-slate-300 hover:text-white">
        ← Back to all packs
      </Link>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-emerald-300">{pack.setName}</p>
        <h1 className="text-3xl font-bold">{pack.packName}</h1>
        <p className="mt-1 text-sm text-slate-400">Released {formatDate(pack.releaseDate)}</p>
        <p className="mt-3 text-slate-300">{pack.summary}</p>
        <p className="mt-3 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm">
          ROI signal: <span className="font-semibold">{pack.roiSignal}</span>
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Lowest pack price', formatUsd(pack.packCost)],
          ['Expected value', formatUsd(pack.expectedValue)],
          ['Value per pack', `${pack.valuePerPack.toFixed(2)}x`],
          ['Chase card value', formatUsd(pack.chaseCardValue)],
          ['Average hit value', formatUsd(pack.averageHitValue)],
          ['Pull value ratio', pack.pullValueRatio.toFixed(2)],
          ['Cost efficiency', `${pack.costEfficiencyScore}/100`],
          ['Median card value', formatUsd(pack.medianCardValue)]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="mb-3 text-lg font-semibold">Source pricing</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {pack.sources.map((source) => (
            <a
              key={source.source}
              href={source.listingUrl}
              className="rounded-lg border border-slate-700 p-3 hover:border-slate-500"
              target="_blank"
              rel="noreferrer"
            >
              <p className="text-sm text-slate-400">{source.source === 'POKEMON_CENTER' ? 'Pokémon Center' : 'eBay'}</p>
              <p className="text-lg font-semibold">{formatUsd(source.price)}</p>
            </a>
          ))}
        </div>
      </section>

      <CardTable cards={pack.cards} />
    </main>
  );
}
