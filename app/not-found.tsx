import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Pack not found</h1>
      <p className="mt-2 text-slate-400">The requested pack does not exist in the current dataset.</p>
      <Link className="mt-4 inline-block text-emerald-300" href="/">
        Return home
      </Link>
    </main>
  );
}
