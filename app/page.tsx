export const dynamic = "force-dynamic";

import { HomepageView } from '@/components/packs/homepage-view';
import { getPackMetrics } from '@/lib/pack-data';

export default async function HomePage(): Promise<JSX.Element> {
  const packs = await getPackMetrics('valuePerPack');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">PokeVolume</p>
        <h1 className="text-3xl font-bold md:text-4xl">Pokémon booster pack value intelligence</h1>
        <p className="max-w-3xl text-slate-300">
          Compare eBay and Pokémon Center pricing against expected card value to decide whether a pack is undervalued, fair,
          or overpriced.
        </p>
      </header>
      <HomepageView initialPacks={packs} />
    </main>
  );
}
